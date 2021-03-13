var DataBasepool = require('./connection/connection');


var GLServices = {
    info: function (info) { 
        console.log('Info: ' + info);
    },
    warning:function (warning) { 
        console.log('Warning: ' + warning);
    },
    error:function (error) { 
        console.log('Error: ' + error);
    },
    getEntityDataArray: async function(code, sql, connection){
        return new Promise((resolve, reject)=>{
            var current_bal=0;
            connection.query(sql, [code], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    
                    return
                } 
                resolve(result);

                // connection.release();
            })       
         
        })
    },
    getPenArray: async function(pen, sql, connection){
        return new Promise((resolve, reject)=>{
            connection.query(sql, [pen], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result)

                // connection.release();
            })        
        })
    },
    updateGLAccounts: async function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            // DEBIT  is -ve
            // CREDIT is +ve

            var amt=dataObj.amount;

            console.log(dataObj.glTT)
            console.log(dataObj.account_id)
            console.log("***********************")

            if(dataObj.glTT==='Debit'){
                amt = dataObj.amount * -1;
            }
            // else{
            //     dataObj.amount = dataObj.amount * -1;
            // }
            // console.log(dataObj.amount)
            // console.log(dataObj.account_id)
            var sql = "update general_ledger set current_bal = current_bal + '"+amt+"' where account_id = '"+dataObj.account_id+"'";
            // var sql = "update general_ledger set current_bal = current_bal + ? where account_id = ?";
            connection.query(sql, [dataObj.amount, dataObj.account_id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err);
                    return;
                }
                connection.query('select * from general_ledger where account_id=?', [dataObj.account_id], (err, results)=>{
                    if(err){
                        connection.rollback()
                        reject(err)
                        return
                    }

                    resolve(results);
                
                })
                
            })
        })
    },
    // supplier: supplier, tdate   : tdate, invoice : invoice, pen_id  : pen_id, buy_price : buy_price, amount   : amount,
    // goods_id : goods_id, quantity : quantity, ttC: "Credit", ttD: "Debit", narra: "Purchase of DOC",
    // user_id : "dele", balance: dataObj[0].current_bal, status: 0, td: "DOC", age: age, glTT: tt, serial: GLSerialnumber

    insertGLEntries: async function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql = "insert into gl_tran_hist(serial_numb, account_id, postdate, valuedate, narrative, trans_type, amount, user_id, status, pre_bal, curr_bal, pcv_no, entity, flag, invoice_no ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.serial, dataObj.account_id, dataObj.tdate, dataObj.tdate, dataObj.narra, dataObj.glTT, dataObj.amount, dataObj.user_id, dataObj.status, dataObj.balance, dataObj.current_bal, 0, 0, 0, 0 ], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }
                
                resolve(result);
                
            })
        })
    },
    getGLSerialNumber: async function(connection){
        return new Promise((resolve, reject)=>{
            var sql = "select current_nos from fresh_numb";
            connection.query(sql, [], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err);
                    return
                }
                var cur_nos=0;
                result.forEach((rec)=>{
                    cur_nos = rec.current_nos;
                })

                connection.query('update fresh_numb set current_nos= current_nos + 1', [], (err, res)=>{
                    if(err){
                        connection.rollback()
                        reject(err)
                        return
                    }

                    // console.log(cur_nos);


                    resolve(cur_nos);
                })
    
                
            })
        })
    },
    getTrialBalance_RS: async function(code) {
        return new Promise((resolve, reject) => {
            DataBasepool.getConnection((err, connection) => {
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                connection.beginTransaction((err)=>{
                    if(err) {
                        connection.rollback()
                        reject(err)
                        return
                    }
                
                    var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, gl.current_bal as gl_bal, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and gl.current_bal <> 0 group by g.account_id order by g.account_id";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 group by g.account_id order by g.account_id";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 and g.`narrative` not like 'Production%' group by g.account_id order by g.account_id";
                    connection.query(sql, [code], (err, result)=>{
                        if(err){
                            connection.rollback()
                            reject(err)
                            return
                        }
                        connection.commi((err)=>{
                            if(err) {
                                connection.rollback()
                                reject(err)
                                return
                            }
                            
                            connection.release();
            
                            resolve(result)
                        })
                    })
                })
            })
        })
    },
    getTrialBalanceDateRange_RS: async function(paramObj) {
        return new Promise((resolve, reject) => {
            DataBasepool.getConnection((err, connection) => {
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                
                connection.beginTransaction((err)=>{
                    if(err) {
                        connection.rollback()
                        reject(err)
                        return
                    } 
                     
                    var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, gl.current_bal as gl_bal, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and gl.current_bal <> 0 and g.valuedate = ? group by g.account_id order by g.account_id";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 group by g.account_id order by g.account_id";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 and g.`narrative` not like 'Production%' group by g.account_id order by g.account_id";
                    connection.query(sql, [paramObj.code, paramObj.bdate, paramObj.edate], (err, result)=>{
                        if(err){
                            console.log(err)
                            reject(err)
                            return
                        }
                        connection.commit((err)=>{
                            if(err) {
                                connection.rollback()
                                reject(err)
                                return
                            } 
                        
                            connection.release();
            
                            resolve(result)
                        })
                    })
                })
            })
        })
    },
    getAccountGrp_RS: async function(){
        return new Promise((resolve, reject)=>{
            DataBasepool.getConnection((err, connection)=>{
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                
                connection.beginTransaction((err)=>{
                    if(err) {
                        connection.rollback()
                        reject(err)
                        return
                    }

                    
                    connection.query('select * from account_group order by acct_sorter  ', [], (err, result)=>{
                        if(err){
                            connection.rollback()
                            reject(err);
                            return;
                        }
                        connection.commit((err)=>{
                            if(err) {
                                connection.rollback()
                                reject(err)
                                return
                            }
                            
                            connection.release();
                            // console.log(result);
            
                            resolve(result);
                        })
                    })
                })
            })
        })
    },
    getPLAccountGrp_RS: async function (){
        return new Promise((resolve, reject)=>{
            DataBasepool.getConnection((err, connection)=>{
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                
                connection.beginTransaction((err)=>{
                    if(err) {
                        connection.rollback()
                        reject(err)
                        return
                    }
                
                    
                    /** GET ALL P&L Items */
                    var sql = "select * from account_group where acc_group_code >= 60 order by acc_group_code ";
                    connection.query(sql, [], (err, result)=>{
                        if(err){
                            console.log(err)
                            reject(err)
                            return
                        }
                        connection.commit((err)=>{
                            if(err) {
                                connection.rollback()
                                reject(err)
                                return
                            }   
                            connection.release();
            
                            resolve(result)
                        })
                    })
                })
            })
        })
    },
    
    getTrialBalance_RS: async function (code){
        return new Promise((resolve, reject)=>{
            DataBasepool.getConnection((err, connection)=>{
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                connection.beginTransaction((err)=>{
                    if(err) {
                        connection.rollback()
                        reject(err)
                        return
                    }
                
                    var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and gl.current_bal <> 0 group by g.account_id order by g.trans_type";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 group by g.account_id order by g.account_id";
                    // var sql="select substr(g.account_id, 3,2) as acct_grp, g.account_id as acctid, gl.`account_title`, trans_type, sum( if(`trans_type`='Debit', amount * -1, amount) ) as amount, SIGN(sum( if(`trans_type`='Debit', amount * -1, amount) )) as signage from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` where substr(g.account_id, 3,2)=? and g.amount <> 0 and g.`narrative` not like 'Production%' group by g.account_id order by g.account_id";
                    connection.query(sql, [code], (err, result)=>{
                        if(err) {
                            connection.rollback()
                            reject(err)
                            return
                        }
                        connection.commit((err)=>{
                            if(err) {
                                connection.rollback()
                                reject(err)
                                return
                            }
                            
                            connection.release();
            
                            resolve(result)
                        })
                    })
                })
            })
        })
    },
    
    insertExpenseHistory: async function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="insert into expense_hist() values()";
            connection.query(sql, [], (err, result)=>{
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                
            })
        })
    },
    insertBankHistory: async function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="insert into bank_reco_history(bank_account, date, trans_type, amount, balance, narration, user_id, branch_code, refnos ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.bankid, dataObj.dated, dataObj.ttC, dataObj.amount, dataObj.balance, dataObj.narra, dataObj.user, dataObj.src_code, dataObj.refpt ], (err, result)=>{
                if(err) {
                    connection.rollback()
                    reject(err)
                    return
                }
                

                resolve(result)
            })
        })

    }
 
};

module.exports = GLServices
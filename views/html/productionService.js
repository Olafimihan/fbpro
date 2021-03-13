var DataBasepool = require('./connection/connection');
var dateFormat=require('dateformat');
var numeral = require('numeral');
const { connect } = require('http2');


var productionService = {

    getTotalFeedCost: function(dataObj, dated, connection){
        return new Promise((resolve, reject)=>{
            console.log("The got Date: "+ dated)
            console.log("The got Pen: "+ dataObj.penid)
            var sql="select sum(amount) as amt from feed_trans_hist where entity=? and code = 0 and trans_date=? and active_status='Y' and trans_type='Debit' ";
            connection.query(sql, [dataObj.penid, dated], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
     
                var totalAmt=0;
                result.forEach((row) => {
                    totalAmt = row.amt;
                })
 
                // if(totalAmt==='undefined'){
                //     totalAmt=0;
                // }
                resolve(totalAmt);
    
            })
    
        })

    },
    getTotalDrugCost: function(dataObj, dated, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select sum(amount) from drugusage where penid=? and trans_date=? and active_status="Y" ', [dataObj.penid, dated], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
    
                // console.log(result)

                var totalAmt=0;
                result.forEach((row)=>{
                    totalAmt = row.amount;
                })
    
                // console.log(totalAmt)

                if(totalAmt==undefined){
                    totalAmt=0;
                }
                resolve(totalAmt);
    
            })
    
        })

    },
    getTotalWages: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select monthlywages from pens where pen_id=? ', [dataObj.penid], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
    
                // console.log(result)

                var totalAmt=0;
                result.forEach((row)=>{
                    totalAmt = row.monthlywages;
                })
    
                if(totalAmt===undefined){
                    totalAmt=0;
                }
                resolve(totalAmt);
    
            })
    
        })
        

    },//total_h2o_cost
    getTotalWaterCost: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select waterqty, watercost, rate from pens where pen_id=? ', [dataObj.penid], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                } 
                var totalAmt=0, rate=0, factor=0;
                result.forEach((row)=>{
                    factor = row.waterqty;
                    rate   = row.rate;
                })
                totalAmt = rate * factor;
                
                resolve({totalAmt: totalAmt});
    
            })
    
        })
    },
    getNoOfDaysInaMonth: function(dated){
        return new Promise((resolve, reject)=>{
            var mth = dated.getMonth()+1;
            var yr  = dated.getFullYear();
            var NoOfDaysInaMonth=0;
            // console.log("mth: "+ mth)
            // console.log("yr: "+ yr)
            switch(mth){
                case 1: //JAN
                    NoOfDaysInaMonth=31;
                    break;
                case 2: //FEB
                    NoOfDaysInaMonth=28;
                    break;
                case 3: //MAR
                    NoOfDaysInaMonth=31;
                    break;
                case 4: //APR
                    NoOfDaysInaMonth=30;
                    break;
                case 5: //MAY
                    NoOfDaysInaMonth=31;
                    break;
                case 6: //JUN
                    NoOfDaysInaMonth=30;
                    break;
                case 7: //JUL
                    NoOfDaysInaMonth=31;        
                    break;
                case 8: //AUG
                    NoOfDaysInaMonth=31;
                    break;
                case 9: //SEP
                    NoOfDaysInaMonth=30;
                    break;
                case 10: //OCT
                    NoOfDaysInaMonth=31;
                    break;
                case 11: //NOV
                    NoOfDaysInaMonth=30;
                    break;
                case 12: //DEC
                    NoOfDaysInaMonth=31;
                    break;
            }

            resolve(NoOfDaysInaMonth);
        })
    },
    //{dated: tdate, pen: penid, product: productid, qty: quantity, amt: crateCost, 
    //user: 'dele', acttdr: production_DR, acctcr: production_CR, age: 0, rate: crateCost}
    
    insertProductionHistory: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            
            var sql = "insert into production (trans_date, penid, productid, quantity, amount, user_id, acct_dr, acct_cr, age, unit_rate, egg_pieces, srcdoc) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.dated, dataObj.pen, dataObj.product, dataObj.qty, dataObj.amt, dataObj.user, dataObj.acctdr, dataObj.acctcr, dataObj.age, dataObj.rate, dataObj.pieces, dataObj.srcdoc], (err, result)=>{
                if(err) {
                    connection.rollback()
                    reject(err);
                    return;
                }
                connection.query('select * from goods_table where goods_id=?', [dataObj.product], (err, results)=>{
                    if(err) {
                        connection.rollback()
                        reject(err);
                        return;
                    }
                    resolve(results);
                })
                
                
            })
        })
    },
    // src_tbl: "production", dated: tdate, pen: penid, product: productid, ttC: ttC, ttD: ttD, qty: quantity, amt: crateCost, 
    // user: 'dele', acctdr: production_DR, acctcr: production_CR, age: penAge, rate: crateCost/quantity
    insertStockCardHistory: function(dataObj, connection){ //FEEDS, EGGS AND DRUGS TABLE INSERT RECORD TRAILS HERE
        return new Promise((resolve, reject)=>{
            var sql="insert into stock_trans_hist(stock_id, trans_date, user_id, amount, quantity, price, balance, stock_balance, narration, src_tbl_pt, trans_type, entity_id, invoice, code, stockVal, pre_value, cur_value) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
            connection.query(sql, [dataObj.product, dataObj.dated, dataObj.user, dataObj.amt, dataObj.qty, dataObj.rate, dataObj.balance, dataObj.curr_balance, dataObj.narra, dataObj.src_tbl, dataObj.ttC, dataObj.supplier, dataObj.invoice, 0, dataObj.amt, dataObj.pre_value, dataObj.cur_value ], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result);
            })
        })
    },
    updateProductReversalflag: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var id = dataObj.id;

            connection.query('update sales set returned_code="YES", return_status=5 where refnos = ? ', [id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                } 

                resolve(result);
                
            })
        })
    },
    updateGoodsBalance:  function(dataObj, connection){ //EGGS TABLE
        return new Promise(  (resolve, reject)=>{
            
            //test for Debit and Credit, then give appropriate behaviour
            var stockBal=0;
            var qty = 0, pieces=0;
            var tt=dataObj.ttC;

            if(tt==="Credit"){
                stockBal=dataObj.amt; //the incoming stock value
                qty     =dataObj.qty; // the outgoing stock qty
                pieces  = dataObj.pieces;
            }else if(tt==="Debit"){
                stockBal = dataObj.amt * -1; // the outgoing stock value
                qty      = dataObj.qty * -1; // the outgoing stock qty
                pieces   = dataObj.pieces * -1;
            }

            //Ensure that the balance column value does not go out of scope, when qty becomes 0, balance should also be forced to be 0

            var data = {
                c_piece: pieces,
                stock_id: dataObj.product
            }

            //  var resp = await getNumberOfEggPiecesInStock(data); 
            
            connection.query('update goods_table set stock_level=stock_level + ?, balance=balance + ?, pieces=pieces+? where goods_id=?', [qty, stockBal, pieces, dataObj.product], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                } 
                console.log(pieces)

                connection.query('select * from goods_table where goods_id=?', [dataObj.product], (err, results)=>{
                    if(err){
                        connection.rollback()
                        reject(err)
                        return
                    }
                    // console.log(results)
                    resolve(results)
                })
                
            })
        })
    },
    getNumberOfEggPiecesInStock: function(data){
        return new Promise((resolve, reject)=>{
            console.log(data)

        })
    },
    updateDrugsBalance: function(dataObj, connection){ //DRUGS TABLE
        return new Promise((resolve, reject)=>{
            //test for Debit and Credit, then give appropriate behaviour
            var stockBal=0, value=0;
            
            if(dataObj.ttC==='Credit'){
                stockBal = dataObj.quantity;
                value    = dataObj.stockval;
            }else if(dataObj.ttC==='Debit'){
                stockBal = dataObj.quantity * -1;
                value    = dataObj.stockval * -1;
            }

            connection.query('update goods set stock_level=stock_level+?, stock_value=stock_value+? where goods_id =?', [stockBal, value, dataObj.product], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
                connection.query('select * from goods where goods_id=?', [dataObj.product], (err, results)=>{
                    if(err){
                        connection.rollback()
                        reject(err.sqlMessage)
                        return
                    }
                    resolve(results)
                })
                
                
            })
        })
    },
    updateFeedBalance: function(dataObj, connection){ //FEEDS TABLE
        return new Promise((resolve, reject)=>{
            //test for Debit and Credit, then give appropriate behaviour
            var amt=0, stockbal=0, value=0;
            if(dataObj.ttC==='Credit'){
                stockbal = dataObj.quantity;
                value = dataObj.amount;
            }else if(dataObj.ttC==='Debit'){
                stockbal = dataObj.quantity * -1;
                value = dataObj.amount * -1;
            }
            connection.query('update products set quantity=quantity+?, stock_value=stock_value+? where product_id =?', [stockbal, value, dataObj.product], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
                connection.query('select * from products where product_id=?', [dataObj.product], (err, results)=>{
                    if(err){
                        connection.rollback()
                        reject(err.sqlMessage)
                        return
                    }
                    resolve(results)
                })
                
                
            })
        })

    }, //{src_tbl: "goods_table", sql: "select * from goods_table", product: productid, qty: quantity, price: crateCost/quantity};
    calculateWeightedAverage: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            let old_qty=0, old_price=0;         
            connection.query(dataObj.sql, [dataObj.product], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
                result.forEach((rec)=>{
                    // switch(dataObj.src_tbl){
                    //     case 'goods_table': ///Eggs
                    //         old_qty   = rec.stock_level;
                    //         old_price = rec.buy_price;
                            
                    //         break;
                    //     case 'goods': //Drugs
                    //         old_qty   = rec.stock_level;
                    //         old_price = rec.amount;
                            
                    //         break;
                            
                    //     case 'products': //Feeds
                    //         old_qty   = rec.quantity;
                    //         old_price = rec.cost_price;
                            
                    //         break;
                    //     default:
                    //         break;    

                    // }

                    if(dataObj.src_tbl==='goods_table'){ ///Eggs
                        old_qty   = rec.stock_level;
                        old_price = rec.buy_price;
                    }else if(dataObj.src_tbl==='goods'){ //Drugs
                        old_qty   = rec.stock_level;
                        old_price = rec.amount;
                    }else if(dataObj.src_tbl==='products'){ //Feeds
                        old_qty   = rec.quantity;
                        old_price = rec.cost_price;
                    }
                    
                }); 
                let ldec_curr_stock_value=old_qty * old_price; //Get current stock value
                let ldec_new_stock_value= dataObj.qty * dataObj.price; //Get the value of the incoming quantity
                
                let ldec_stock=old_qty + dataObj.qty; //Get the total stock quantity for both current and incoming
                
                let ldec_sum=ldec_curr_stock_value + ldec_new_stock_value; //Get the value for both current and incoming
                let idec_new_price= ldec_sum / ldec_stock; // this is the new cost price for the item
                 
                resolve(idec_new_price.toFixed(2));
                
            })

        })
    }, 
    updateProductAverageCostPrice: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            connection.query(dataObj.sql, [dataObj.cost, dataObj.goods_id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }

                resolve(result)
            })
        })
    },
    getCurrentApplicationDate: function(connection) {
        return new Promise((resolve, reject)=>{
            var dated="";
            connection.query('select * from system_settings', [], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }
                result.forEach((rec) => {
                    dated = rec.sysdate;
                })

                // console.log(dated)

                resolve(dateFormat(dated, 'yyyy-mm-dd'));
            })
        })
    },
    getFeedArray: function(id, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select * from products where product_id=?', [id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }

                resolve(result)
            })
        })
    },
    getDrugArray: function(id, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select * from goods where goods_id=?', [id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }

                resolve(result)
            })
        })
    },
    getEggArray: function(id, connection){
        return new Promise((resolve, reject)=>{
            connection.query('select * from goods_table where goods_id=?', [id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err.sqlMessage)
                    return
                }

                resolve(result)
            })
        })
    },
    insertFeedTransHistory: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="insert into feed_trans_hist(stock_id, trans_date, user_id, amount, quantity, price, balance, stock_balance, trans_type, narration, entity, invoice, code, stockVal, acct_dr, acct_cr, currentweek, p_value, c_value) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.product, dataObj.dated, dataObj.user, dataObj.amount, dataObj.quantity, dataObj.price, dataObj.balance, dataObj.curr_balance, dataObj.ttC, dataObj.narra, dataObj.entity, dataObj.invoice, dataObj.code, dataObj.stockval, dataObj.acctdr, dataObj.acctcr, dataObj.age, dataObj.pre_value, dataObj.cur_value ], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result)

            })
        })
    },
    insertDrugUsage: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql ="insert into drugusage(penid, trans_date, stock_id, quantity, price, amount, user_id, invoice, acct_dr, acct_cr, currentweek) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.pen, dataObj.dated, dataObj.product, dataObj.quantity, dataObj.price, dataObj.amount, dataObj.user, dataObj.invoice, dataObj.acctdr, dataObj.acctcr, dataObj.age], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result)
            })
        })
    },
    getDrugGlAccountArray: function(id, connection){ //pass the drug group ID
        return new Promise((resolve, reject)=>{
            connection.query('select * from group_tbl where group_id=?', [id], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result);
            })
        })
    },
    getContribution_RS: function(penid, dateObj){
        return new Promise((resolve, reject)=>{
            DataBasepool.getConnection((err, connection)=>{
                if(err){
                    console.log(err);
                    reject(err)
                    return
                }
                connection.beginTransaction((err)=>{
                    if(err){
                        connection.rollback()
                        reject(err.sqlMessage)
                        return
                    }
                
                    var sql="select m.`pen_id`, m.date, p.`quantity` as prodqty, (((p.`quantity` * 30) / m.`balance`) * 100) as prodperc, f_getDateTotalSales(m.date) as totSales, ((m.`quantity`/m.`balance`) * 100) as mortaperc, m.balance as openstock, m.`quantity` as mortalityqty, m.`left_over` as closingstock, m.`cost_amt` as mortalitycost, f.`quantity` as feedused,  f.`stockVal` as feedusedcost, f_calculatePenLabourCost(m.`pen_id`) as labourCost, dr.`amount` as drugCost    , (f_calculatePenLabourCost(m.`pen_id`)+m.`cost_amt`+ f.stockval + dr.`amount`) as totalcost, (f_getDateTotalSales(m.date) - (f_calculatePenLabourCost(m.`pen_id`)+m.`cost_amt`)) as contr from mortality_hist m inner join production p ON p.`trans_date`=m.`date` and p.`penid`=m.`pen_id` inner join `feed_trans_hist` f ON f.`entity` = m.`pen_id` and f.`trans_date`=m.`date` left join drugusage dr on dr.`penid`=m.`pen_id` and dr.`trans_date`=m.`date` where m.pen_id=? and m.date between ? and ? group by  m.`pen_id`, m.`date`";
                    connection.query(sql, [penid, dateObj.bdate, dateObj.edate], (err, result)=>{
                        if(err){
                            console.log(err);
                            reject(err)
                            return
                        }
                        connection.commit((err)=>{
                            if(err){
                                console.log(err);
                                reject(err)
                                return
                            }
                       
                            connection.release()
            
                            resolve(result)
                        })
                    })
                })
            })
        })
    }
}

module.exports = productionService;


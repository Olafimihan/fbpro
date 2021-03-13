// var DataBasepool = require('./connection/connection');
let dateFormat = require('dateformat');


var mortalityCALL = {
    info: function (info) { 
        console.log('Info: ' + info);
    },
    warning:function (warning) { 
        console.log('Warning: ' + warning);
    },
    error:function (error) { 
        console.log('Error: ' + error);
    },
    insertDailyMortality: async function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="insert into mortality_hist(pen_id, date, quantity, balance, left_over, age, acct_dr, acct_cr, cost_amt, currentweek) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.pen, dataObj.dated, dataObj.quantity, dataObj.balance, dataObj.curr_balance, dataObj.age, dataObj.acttdr, dataObj.acctcr, dataObj.amt, dataObj.age], (err, result)=>{
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
    updateMortalityPen: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            
            // console.log("Date Of Birth: "+ dataObj.trans_date)

            connection.query('update pens set quantity_of_birds = quantity_of_birds - ? where pen_id=? ', [dataObj.quantity, dataObj.pen], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err);
                    return
                }
                // connection.query('select * from')

                resolve(result)
                
            })
        })
    } 
  
 
};

module.exports = mortalityCALL
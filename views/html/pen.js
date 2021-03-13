let DataBasepool = require('./connection/connection');
let dateFormat = require('dateformat');

var pen = {
    info: function (info) { 
        console.log('Info: ' + info);
    },
    warning:function (warning) { 
        console.log('Warning: ' + warning);
    },
    error:function (error) { 
        console.log('Error: ' + error);
    },
    getPenArray: async function(pen, sql, connection){
        return new Promise((resolve, reject)=>{
            connection.query(sql, [pen], (err, result)=>{
                if(err){
                    connection.rollback();
                    reject(err)
                    return
                }

                resolve(result)

                // connection.release();
            })        
        })
    },
    updatePenInvestment: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="update pens set balance=balance+? where pen_id =?";
            
            var amt=0;
            if(dataObj.tt==='Credit'){
                amt = dataObj.amt;
            }else if(dataObj.tt==='Debit'){
                amt = dataObj.amt * -1;
            }
            connection.query(sql, [amt, dataObj.pen], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result);
            })
        })
    }
 
};

module.exports = pen
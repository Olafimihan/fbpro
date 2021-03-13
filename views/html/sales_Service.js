var DataBasepool = require('./connection/connection');
var dateFormat=require('dateformat');

var salesService = {

    insertSalesBook: function(dataObj, connection){
        return new Promise((resolve, reject)=>{
            var sql="insert into sales(trans_date, invoice_no, trans_type, trans_desc, amount, cust_id, price, goods_id, narration, user_id, buy_price, quantity, cost, acct_dr_Sales, acct_cr_Sales, acct_dr_Cost, acct_cr_Cost) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [dataObj.dated, dataObj.invoice, dataObj.ttC, dataObj.td, dataObj.amount, dataObj.cust_id, dataObj.price, dataObj.goods_id, dataObj.narra, dataObj.user, dataObj.buy_price, dataObj.quantity, dataObj.totalCost, dataObj.acctdrsales, dataObj.acctcrsales, dataObj.acctdrcost, dataObj.acctcrcost], (err, result)=>{
                if(err){
                    connection.rollback()
                    reject(err)
                    return
                }

                resolve(result.insertId);


            })
        })
    }



}

module.exports = salesService;


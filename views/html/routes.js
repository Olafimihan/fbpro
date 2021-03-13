'use strict';
var bodyParser = require('body-parser')
var mysql = require('mysql') 
var multer = require('multer')
var path = require('path')
var nodemailer = require('nodemailer')
// var mailer = require('../mailer/mailer')
var urlencodedParser = bodyParser.urlencoded({extended: false})
 
/**
 * Communicate with the database here 
 */

/**Setup diskstorage for multer upload 
 * 
*/
// var diskstorage = multer.diskStorage({
//     destination: '/var/www/html/courier/',
//     filename: function(req, file, cb){
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
//     }
// });


/**Setup upload variable */
// var upload = multer({ storage: diskstorage }).single('myImage');

// var upload = multer({
//     dest: diskstorage
// }).single('image')

/**set your db connection here */
var DataBasepool = mysql.createPool({
    connectionLimit: 1000000, 
    host: "127.0.0.1",
    // host: "75.127.75.161",
    user: "root",
    password: "opeyemi",
    database: "aritz_frmdb" 
});
 


module.exports = function(app) { //start app route
    app.get('/', function(req, res) {
        console.log(path)
        console.log(__dirname)
        res.sendFile(path.join(__dirname + '/views/html/login.html'));
        // res.sendFile('html/login');
    });

    app.post('/login', urlencodedParser, (req, res) => {
        let queryParam = JSON.parse(req.body.queryParam)
        
        let user = queryParam.user;
        let pass = queryParam.pass;
        
        // let imei = req.query.imei;
    
        console.log(user);
        console.log(pass);
        // console.log(imei);
    
        DataBasepool.getConnection(function(err, connection) {
            if (err){
              console.log(err);
              res.json({resp: 'error', msg: err.sqlMessage})
              return;
            }
    
            connection.beginTransaction((err) => {
                if (err){
                    connection.rollback();
                    res.json({resp: 'error', msg: err.sqlMessage})
                    return;
                }
    
                let resp='none';
                let sql = "select * from webusers where UserID = ? and PassWord = ?";
                connection.query(sql, [user, pass], (err, result)=>{
                    if (err){
                        connection.rollback();
                        res.json({resp: 'error', msg: err.sqlMessage})
                        return;
                    }
                    connection.commit((err)=>{
                        if(err){
                            return connection.rollback(function() {
                                //  connection.release();
                            });
                        }
                        connection.release()
                    
                        console.log(result)
                        if(result.length = 1){
                            resp='success'
                        }else if(result.length < 1){
                            resp ='no record'
                        }

                        res.json({
                            resp: resp,
                            msg: result
                        })
                    })
    
                    
                })
              
            })
         
    
        }); //pooler
        
    })
    
      
    app.post('/menu', urlencodedParser, function(req, res){  
        let user = req.body.username;
        let pass = req.body.password;
        let valuestr="empty"
        //  console.log(user);
        //  console.log(pass);
      
        DataBasepool.getConnection(function(err, connection){
    
            if (err) {
                res.send(err.sqlMessage);
                return;
            }
          
            connection.beginTransaction((err)=>{
                if(err){
                    connection.rollback()
                    res.send(err.sqlMessage)
                    return
                }

                connection.query("select * from webusers where userid = ? AND password = ?", [user, pass], function (err, result, fields) {
                    if (err){
                        res.send(err);
                        return connection.rollback(function(){
                        //   connection.release();
                        })
                    }
                    connection.commit((err)=>{
                        if(err){
                            connection.rollback()
                            res.send(err.sqlMessage)
                            return
                        }
                        connection.release();
                        
                        result.forEach(function(row) { 
                            valuestr = row.FullName; 
                        }); 
            
                        if(valuestr=='empty'){
                            res.sendFile(htmlPath+'/404.html')  
                        }else{ 
                            console.log(htmlPath)
                            res.sendFile(htmlPath+'/board.html');
                        }
                        //socket.emit('tracked', result)
                        // return result
                    })
                }); 
            })
      
        })
      
    });
    
    
}; //end app route

/**
 * Function CALL to send E-Mail
 */
var emailsender = (a, b)=> {
    console.log(a);
    console.log(b);
}

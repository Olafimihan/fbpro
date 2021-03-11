'use strict';
let express = require('express');
// let mysql = require('mysql');

let app = express();

let port = process.env.PORT || 2000;
let cron = require('cron');
let CronJob = require('cron').CronJob;

let cors = require('cors');
let bodyParser = require('body-parser');

let multer = require('multer');
let path = require('path');

let nodemailer = require('nodemailer');
let mailer = require('./mailer/mailer');

 
var numeral = require('numeral');

// myLogModule.info('Node.js started');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let http = require('http');
let ejs = require('ejs');


let publicPath = path.join(__dirname, 'public');

let htmlPath = path.join(__dirname, 'views/html');

let socketIO = require('socket.io');
let server = http.createServer(app);

/** instantiate socket.io here */
let io = socketIO(server);

let fs = require('fs');
 
let dateFormat = require('dateformat');
const { Console } = require('console');
const { connect } = require('http2');
let outResultArray = [];

// ================================================================
// setup our express application
// ================================================================
// app.set('view engine', 'html');
// app.use('public', express.static(process.cwd() + 'public'));
// app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.set('views', __dirname);
app.use(express.static(htmlPath));
app.use(cors());

app.set('socketio', io);
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', "*");
    // res.header('Access-Control-Allow-Origin', "75.127.75.161:4000");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// cron.schedule('00 12 * * *', () => {
//     // Use moment.js or any other way to dynamically generate file name
//       const fileName = 'dbbackup.sql';//`${process.env.DB_NAME}_${moment().format('YYYY_MM_DD')}.sql`
//       const wstream = fs.createWriteStream(`/Path/You/Want/To/Save/${fileName}`)
//       console.log('---------------------')
//       console.log('Running Database Backup Cron Job')
//       const mysqldump = spawn('mysqldump', [ '-u', process.env.DB_USER, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME ])
    
//       mysqldump
//         .stdout
//         .pipe(wstream)
//         .on('finish', () => {
//           console.log('DB Backup Completed!')
//         })
//         .on('error', (err) => {
//           console.log(err)
//         })
// })


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads/');
     },
     filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname);
        // cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
     }
});

 

 
   
 
server.listen(port, function() {
    // console.log('Server listening on port ' + port + '...');
    console.log(`Server listening on port ${port}`)
});

 

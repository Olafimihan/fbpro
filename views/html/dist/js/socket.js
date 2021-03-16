

var data_socket_transporter = io.connect("http://139.162.192.74:2021");

var api_key = localStorage.getItem("SSH_KEY")
    
console.log(api_key);
console.log(data_socket_transporter);

data_socket_transporter.on('errmsg', (errmsg) => {
    console.log(errmsg);
});

function getSubscriptionFee(){
    alert('Dele')
}

// document.ready(function(){
//     alert('Dele')
// })


// var data_socket_transporter = io.connect("http://127.0.0.1:2000");
// var data_socket_transporter = io.connect("http://139.162.229.38:2000");
    
// console.log(data_socket_transporter);

// document.ready(function(){
//     alert('Dele')
// })
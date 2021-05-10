// var data_socket_transporter = io.connect("http://127.0.0.1:2000");
var data_socket_transporter = io.connect("http://139.162.192.74:2021");
      
const api_key = localStorage.getItem('SSH_KEY');

// console.log(data_socket_transporter);

data_socket_transporter.on('errmsg', (errmsg) => {
    // piping all exception to this event, you can send it in a mail later on for monitoring

    data_socket_transporter.emit('errormailer', errmsg);
    
    console.log(errmsg);
});



function getSubscriptionFee(id){
    data_socket_transporter.emit('sub_fee', id)
    data_socket_transporter.on('sub_fee', ()=>{
        
    })

}


const userlevel = document.getElementById('userlevel');

$('#userlevel').html(localStorage.getItem('FarmName'));

// userlevel.style.flex
// userlevel.innerHTML.value = localStorage.getItem('FarmName');


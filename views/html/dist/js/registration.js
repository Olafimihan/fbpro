

data_socket_transporter.emit('existing_plans');

data_socket_transporter.on('existing_plans', (respObj)=>{
    // write the object into memory for future assessment
    console.log(respObj)
    var planandpricing_ddlb = "<option value='" +0+ "'>"+"Select subscription plan....."+"</option>.....";        
    respObj.result.forEach(function(row) {
        planandpricing_ddlb += "<option value='" + row.refnos + "'>";
        planandpricing_ddlb += row.description;  
        planandpricing_ddlb += "</option>";
    });

    $("#sub_type").html(planandpricing_ddlb); 


    var state_ddlb = "<option value='" +0+ "'>"+"Select state....."+"</option>.....";        
    respObj.state.forEach(function(row) {
      state_ddlb += "<option value='" + row.state_id + "'>";
      state_ddlb += row.state_name;  
      state_ddlb += "</option>";
    });

    $("#state").html(state_ddlb); 
});

$(document).ready(function() {
    // console.log(data_socket_transporter);

    // alert('Dele')
    $('#plocked1').click(function(){
        let password = document.querySelector('password');
        console.log(password)
    });

    $('#join').click(function() {
      var pass = $('#password').val();
      var pass2 = $('#password2').val();
      
      if(pass !==pass2) {
        alert('Password Not equal, please re-enter password to continue...');
        return;
      }
      
      var registrationObject = {
        fname: $('#farmname').val(),
        uname: $('#username').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        subtype  : $('#sub_type').val(),
        passkey: $('#password').val(),
        state_id: $('#state').val()
      };
      
      data_socket_transporter.emit('newfarmregistration', registrationObject);

      data_socket_transporter.on('registration success', (msg) => {
        console.log(msg);
        // console.log(msg.msg);
        // console.log(msg.api_key);

        window.location='index.html';

      });

    });

});


function getSubscriptionFee(id){
    data_socket_transporter.emit('sub_fee', id);
    data_socket_transporter.on('sub_fee', (data) => {
        console.log(data);
    })

}
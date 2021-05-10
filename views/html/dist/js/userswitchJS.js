
    $(function(){
        $('#refresh').hide();
        $('.page_header').html('New Users Setup.')
    })
    
    data_socket_transporter.emit('get_userslists', {api_key: localStorage.getItem('SSH_KEY') });
    
    data_socket_transporter.on('get_userslists', (data)=>{
        console.log(data)
        let counter=0;
        let str="<table class='table table-bordered' width='100%' >";

        data.users.forEach((recs)=>{
            counter++;
            // console.log("Dele...")
            // console.log(counter)

            str += "<tr style='font-size: 12px'><td>" + counter + "</td><td>" + recs.FullName + "</td><td>" + recs.RoleId + "</td><td>" + recs.user_status + "</td></tr>"

        })
        str+="</table>"
        
        $("#userlist").html(str);
    
        counter=0;
        str="<table class='table table-bordered' width='100%' >"
        data.devices.forEach((recs)=>{
            counter++;
            // console.log("Dele...")
//             // console.log(counter)
// <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
//   <label class="form-check-label" for="flexSwitchCheckDefault"
//     >Default switch checkbox input</label>

    
            str += "<tr style='font-size: 12px'><td>" + counter + "</td><td>" + recs.username + "</td><td><input type='checkbox' ></td></tr>"
            // str += "<tr style='font-size: 12px'><td>" + counter + "</td><td>" + recs.username + "</td><td><button type='button' class='btn btn-sm btn-toggle active' data-toggle='button' aria-pressed='true' autocomplete='off' ><div class='handle'></div></button></td></tr>"
        })
        str+="</table>"

        $("#devicelist").html(str);
    
    
    })
    
    
    
    function saveData(){
        var outData={
            name: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            permission: $("#permission").val(),
            api_key: localStorage.getItem('SSH_KEY')
        }
    
        data_socket_transporter.emit('newUser', outData)
        data_socket_transporter.on('newUser', (responseObj)=>{
            console.log(responseObj)
        })
    
    }
    
    
    data_socket_transporter.on('errmsg', (err)=>{
        alert(err.sqlMessage)
    })
// page_header
$(function(){
    // $('#refresh').hide();
    $('.page_header').html('Vaccination Management.')
})

displayvaccination();

function displayvaccination(){
    data_socket_transporter.emit('get_vaccination_list', {api_key: localStorage.getItem('SSH_KEY')});

    data_socket_transporter.on('get_vaccination_list', (data) => {
        // console.log(data)
        var str="<table class='table table-bordered' >"
    
        var tot_amt=0;
        data.forEach((recs)=>{ 
            // tot_amt+= recs.current_bal;
            str += "<tr style='font-size: 14px'><td>" + recs.description + "</td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button></td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>"
        })
    
        // str += "<tr><td colspan='5' >TOTAL </td><td style='text-align: right; font-weight: bolder'>"+ tot_amt.toFixed(2)+"</td></tr>"
    
    
        str += "</table>"; 
        $("#vaccinationlist").html(str); 
    
    });
    
}

function deleter(id) {
    data_socket_transporter.emit('deletevaccination', id);
    // data_socket_transporter.emit('get_vaccination_list', {api_key: localStorage.getItem('SSH_KEY')});
    data_socket_transporter.on('deletevaccination', (data) => {
      console.log(data)
      if(data.affectedRows>0){
        displayvaccination()
      }
    })

}


function editter(id){
    // alert(id)
    $("#upd").attr('disabled', false)
    $("#sub").attr('disabled', true)
    
    data_socket_transporter.emit('editvaccination', id)
    data_socket_transporter.on('editvaccination', (resultSet)=>{
        console.log(resultSet)

        $("#refnos").val(resultSet[0].refnos);
        $("#vaccination").val(resultSet[0].description);
         
    })
}

function saveData(){
  $('#save').attr('disabled', true);

    let name = $("#vaccination").val();
    let api_key = localStorage.getItem('SSH_KEY') ; 

    var outData={
        name: name, api_key: api_key
    }
 
    data_socket_transporter.emit('savevaccination', outData)
    data_socket_transporter.on('savevaccination', (responseObj)=>{
        console.log(responseObj.insertId)
        displayvaccination();
    }) 
}

function updateData(){
    let refnos = $("#refnos").val();
    let name = $("#vaccination").val(); 

    var outData={
        refnos: refnos, name: name 
    }
 
    data_socket_transporter.emit('updatevaccination', outData)

}

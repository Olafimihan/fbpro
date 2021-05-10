// page_header
$(function(){
    // $('#refresh').hide();
    $('.page_header').html('Vaccination Programs Management.')
})

displayvaccination_programs();
// dispPrograms();

function dispPrograms(){ // MIGHT BE NEEDING THIS FUNCTION IF I NEED TO FILTER FOR EACH PEN HOUSE
    data_socket_transporter.emit('get_program_list', {api_key: localStorage.getItem('SSH_KEY')});

    data_socket_transporter.on('get_program_list', (data)=>{
        var str="<table class='table table-bordered' style='overflow: scroll' >"
        str += "<tr style='background-color: #ffcccc'><td>Pen</td><td>Date</td><td>Vaccination</td><td>Age</td><td>Frequency</td><td>Action</td><td>Add Members</td></tr>"
    
        var tot_amt=0;
        data.prog.forEach((recs)=>{ 
            // tot_amt+= recs.current_bal; moment(myFutureDate).format('YYYY-MM-DD')
            str += "<tr style='font-size: 14px'><td>" + recs.pen_name + "</td><td>" + moment(recs.vaccination_date).format('YYYY-MM-DD') + "</td><td>" + recs.vaccination + "</td><td>" + recs.age + "</td><td>" + recs.frequency + "</td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td><td><button class='btn btn-success' id='"+recs.refnos+"' onclick='addExecutors(this.id)' ><i class='fa fa-users' ></i></button></td></tr>"
        }) 
        str += "</table>"; 
        $("#programlist").html(str); 
    
    })

}


function displayvaccination_programs(){
    data_socket_transporter.emit('get_program_list', {api_key: localStorage.getItem('SSH_KEY')});

    data_socket_transporter.on('get_program_list', (data) => {
        console.log(data)
        var str="<table class='table table-bordered' style='overflow: scroll' >"
        str += "<tr style='background-color: #ffcccc'><td>Pen</td><td>Date</td><td>Vaccination</td><td>Age</td><td>Frequency</td><td>Action</td><td>Add Members</td></tr>"
    
        var tot_amt=0;
        data.prog.forEach((recs)=>{ 
            // tot_amt+= recs.current_bal; moment(myFutureDate).format('YYYY-MM-DD')
            str += "<tr style='font-size: 14px'><td>" + recs.pen_name + "</td><td>" + moment(recs.vaccination_date).format('YYYY-MM-DD') + "</td><td>" + recs.vaccination + "</td><td>" + recs.age + "</td><td>" + recs.frequency + "</td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td><td><button class='btn btn-success' id='"+recs.refnos+"' onclick='addExecutors(this.id)' ><i class='fa fa-users' ></i></button></td></tr>"
        }) 
        str += "</table>"; 
        $("#programlist").html(str); 
    
        var vaccination_ddlb = "<option value='" +0+ "'>"+"Select vaccination....."+"</option>.....";        
        data.vaccination.forEach(function(row) {
            vaccination_ddlb += "<option value='" + row.refnos + "'>";
            vaccination_ddlb += row.description;  
            vaccination_ddlb += "</option>";
        });
        $("#vaccination").html(vaccination_ddlb); 
    
        var frequency_ddlb = "<option value='" +0+ "'>"+"Select Interval....."+"</option>.....";        
        data.frequency.forEach(function(row) {
            frequency_ddlb += "<option value='" + row.refnos + "'>";
            frequency_ddlb += row.description;  
            frequency_ddlb += "</option>";
        });
        $("#frequency").html(frequency_ddlb); 
    
        var pens_ddlb = "<option value='" +0+ "'>"+"Select a Pen house....."+"</option>.....";        
        data.pens.forEach(function(row) {
            pens_ddlb += "<option value='" + row.pen_id + "'>";
            pens_ddlb += row.pen_name;  
            pens_ddlb += "</option>";
        });
        $("#pens").html(pens_ddlb); 
    
        // console.log(JSON.stringify(data.pens))
        localStorage.setItem('penData', JSON.stringify(data.pens))
    
    
    });
}

function addExecutors(id){
    alert(id)
}

function getPenInfo(id){
    // console.log()
    // console.log(id)
    
    const penArray = localStorage.getItem('penData');
    
    // console.log(penArray)
    // console.log()

    var pens =  JSON.parse(penArray).filter(function(pen) {
        return pen.pen_id == id ;
    });

    $('#qty').val(pens[0].quantity_of_birds)
    $('#age').val(pens[0].age)
    $('#bdate').val(pens[0].date)

    // console.log(pens);
    // displayvaccination_programs();

    
}

function getDueDate(val) {
    let noOfDays = val * 7;
    let DOC_date = $('#bdate').val();
    
    // var myCurrentDate=new Date();
    var myFutureDate=new Date(DOC_date);
    myFutureDate.setDate(myFutureDate.getDate()+ noOfDays);//myFutureDate is now 8 days in the future


    // console.log(myCurrentDate);
    // console.log(myFutureDate);

    let now = new Date();

    var dateString = moment(myFutureDate).format('YYYY-MM-DD');
    $('#startdate').val(dateString);
    // console.log(dateString) // Output: 2020-07-21
     
}

function deleter(id) {
    data_socket_transporter.emit('deletevaccination', id);
    data_socket_transporter.emit('get_vaccination_list', {api_key: localStorage.getItem('SSH_KEY')});
    data_socket_transporter.on('get_vaccination_list', (data) => {
      // console.log(data)
      var str="<table class='table table-head-fixed text-nowrap' >"
        data.forEach((recs)=>{
            str += "<tr style='font-size: 14px'><td>" + recs.description + "</td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button></td><td><button class='btn btn-primary' id='"+recs.refnos+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>"
      })

      str += "</table>"; 
      $("#vaccinationlist").html(str);
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

    let pen         = $("#pens").val();
    let vaccination = $("#vaccination").val();
    let a_age       = $("#a_age").val();
    let startdate   = $("#startdate").val();
    let frequency   = $("#frequency").val();


    let api_key = localStorage.getItem('SSH_KEY') ; 

    var outData={
        pen: pen, vaccination: vaccination, vaccinationAge: a_age, startDate: startdate, frequency: frequency, api_key: api_key
    }
 
    data_socket_transporter.emit('savevaccination_program', outData)
    data_socket_transporter.on('savevaccination_program', (responseObj)=>{
        console.log(responseObj.insertId)
        if(responseObj.insertId>0){
            dispPrograms();
            $("#a_age").val('');
            $("#startdate").val('');   
        }
        else{
            // Handle Client Side Error here
        }
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

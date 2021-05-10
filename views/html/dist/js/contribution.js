$(function(){
  // $('#refresh').hide();
  $('.page_header').html('Contribution Report.')
})

$(function () {

  

    $("#example1").DataTable({
      "responsive": true,
      "autoWidth": false,
      "overflow": scroll,
    });
    $('#example2').DataTable({
      "paging": true,
      "lengthChange": true,
      "searching": true,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
    });
    
  });


  function previewData(){
    var bdate = $("#bdate").val()
    var edate = $("#edate").val()

    $("h3").html('Contribution Analysis between '+ bdate + ' TO '+ edate)
    // alert(bdate)
    // alert(edate)
    //  console.log(data_socket_transporter)

    var dateObj={
      bdate: bdate,
      edate: edate,
      api_key: api_key
    }
    
    data_socket_transporter.emit('contribution_rpt', dateObj )
    data_socket_transporter.on('contribution_rpt', (dataObj)=>{
      $("#contribution_resp").html(dataObj);
      
    }) 
    
  }

  function printData(){
    window.print();
  }


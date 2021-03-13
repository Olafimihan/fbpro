// let api_key="";
// $(function(){
//     api_key=localStorage.getItem('SSH_KEY') 
//     console.log(api_key)
//     // console.log(data_socket_transporter)

// })

// includeHTML()

// function includeHTML() {
//   var z, i, elmnt, file, xhttp;
//   /* Loop through a collection of all HTML elements: */
//   z = document.getElementsByTagName("*");
//   for (i = 0; i < z.length; i++) {
//       elmnt = z[i];
//       /*search for elements with a certain atrribute:*/
//       file = elmnt.getAttribute("w3-include-html");
//       if (file) {
//       /* Make an HTTP request using the attribute value as the file name: */
//       xhttp = new XMLHttpRequest();
//       xhttp.onreadystatechange = function() {
//           if (this.readyState == 4) {
//           if (this.status == 200) {elmnt.innerHTML = this.responseText;}
//           if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
//           /* Remove the attribute, and call this function once more: */
//           elmnt.removeAttribute("w3-include-html");
//           includeHTML();
//           }
//       }
//       xhttp.open("GET", file, true);
//       xhttp.send();
//       /* Exit the function: */
//       return;
//       }
//   }
// }
// console.log(api_key);
// data_socket_transporter.emit('get gl drop down', {api_key: api_key});

// data_socket_transporter.on('get gl drop down', (data)=>{

//     $("#morta_acctdr").html(data.val);
//     $("#morta_acctcr").html(data.val);
//     $("#production_acctcr").html(data.val);
//     $("#production_acctdr").html(data.val);
//     $("#feed_costacct").html(data.val);
//     $("#drug_costacct").html(data.val);
//     $("#morta_costacct").html(data.val);
//     $("#investment_acct").html(data.val);
//     $("#layer_acct").html(data.val);
//     $("#layer_costacct").html(data.val);


//     $("#penslist").html(data.pens);

 

// })

// function editter(id){
//     data_socket_transporter.emit('editpen', id)
//     data_socket_transporter.on('editpen', (data)=>{
//         var resultSet = data.result;  
//         var dated     = data.dated;

//         // console.log(resultSet)

//         // alert(resultSet[0].date)
    
//         $("#pen_id").val(resultSet[0].pen_id);
//         $("#pen_name").val(resultSet[0].pen_name);
//         $("#mortacost").val(resultSet[0].mortalityCost);
//         $("#qty").val(resultSet[0].quantity_of_birds);

//         $("#dob").val(dated);
        
//         $("#morta_acctdr").val(resultSet[0].account_morta_dr);
//         $("#morta_acctcr").val(resultSet[0].account_morta_cr);

//         $("#production_acctcr").val(resultSet[0].account_prod_cr);
//         $("#production_acctdr").val(resultSet[0].account_prod_dr);
        
//         $("#feed_costacct").val(resultSet[0].feed_cost_acct);
//         $("#drug_costacct").val(resultSet[0].direct_exp_cost_acct);
//         $("#morta_costacct").val(resultSet[0].mortality_cost_acct);
        
//         $("#investment_acct").val(resultSet[0].pen_investment);

//         $("#layer_acct").val(resultSet[0].layers_sales_acct);
//         $("#layer_costacct").val(resultSet[0].layers_cfs_acct);

 


//     })
// }

// function saveData(){
//     let pname = $("#pen_name").val();
//     let mortacost = $("#mortacost").val();
    
//     let morta_acctdr = $("#morta_acctdr").val();
//     let morta_acctcr = $("#morta_acctcr").val();

//     let prod_acctcr = $("#production_acctcr").val();
//     let prod_acctdr = $("#production_acctdr").val();
    
//     let feedcostacct = $("#feed_costacct").val();
//     let drugcostacct = $("#drug_costacct").val();
//     let mortacostacct = $("#morta_costacct").val();
    
//     let investmentacct = $("#investment_acct").val();
//     let salesacct = $("#layer_acct").val();
//     let salescostacct = $("#layer_costacct").val();
 
//     var outData = {
//         pname: pname, mortacost: mortacost, morta_acctcr: morta_acctcr, morta_acctdr: morta_acctdr, prod_acctcr: prod_acctcr, prod_acctdr: prod_acctdr,
//         feedcostacct: feedcostacct, drugcostacct: drugcostacct, mortacostacct: mortacostacct, investmentacct: investmentacct,
//         salesAcct: salesacct, salesCostAcct: salescostacct
//     }

//     // data_socket_transporter.emit('savepen', outData)


// }
// function updateData(){
//     let pname = $("#pen_name").val();
//     let mortacost = $("#mortacost").val();
    
//     let morta_acctdr = $("#morta_acctdr").val();
//     let morta_acctcr = $("#morta_acctcr").val();

//     let prod_acctcr = $("#production_acctcr").val();
//     let prod_acctdr = $("#production_acctdr").val();
    
//     let feedcostacct = $("#feed_costacct").val();
//     let drugcostacct = $("#drug_costacct").val();
//     let mortacostacct = $("#morta_costacct").val();
    
//     let investmentacct = $("#investment_acct").val();
    
//     let Salesacct = $("#layer_acct").val();
//     let Costacct = $("#layer_costacct").val();

//     let dob = $("#dob").val();
// //  alert(dob)
//     var outData={
//         pen_id: $("#pen_id").val(), 
//         pname: pname, 
//         mortacost: mortacost, 
//         morta_acctcr: morta_acctcr, 
//         morta_acctdr: morta_acctdr, 
//         prod_acctcr: prod_acctcr, 
//         prod_acctdr: prod_acctdr,
//         feedcostacct: feedcostacct, 
//         drugcostacct: drugcostacct, 
//         mortacostacct: mortacostacct, 
//         investmentacct: investmentacct,
//         salesAcct: Salesacct,
//         CostAcct: Costacct
//     }

//     data_socket_transporter.emit('updatepen', outData)


// }

// data_socket_transporter.on('errmsg', (err)=>{
//     alert(err.sqlMessage)
// })
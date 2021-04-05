/**
 *  handles registration of a new user/wjatever
 */



function regNewUser(){
	
	// get users info from form
	var name = document.getElementById("reg-name").value;
	var password = document.getElementById("reg-password").value;
	var nickname = document.getElementById("reg-nick-name").value;
	var email = document.getElementById("reg-email").value;
	var address = document.getElementById("reg-address").value;
	var requestString = JSON.stringify({ "name": name, "password": password, "nickname": nickname, "email": email, "address": address });
	alert("requestString:" + requestString);
	
	/*
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'RegisterServlet', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(requestString);	
	xhr.onreadystatechange = function() {
	
		if (xhr.readyState == 4) {
			
			var data = xhr.responseText;
			//alert("response from servlet: " + data);
			//var response = ""; 
			if (data == "1")  helloUser(name);			
		}
	}
	*/
	
    $.ajax({
	    url: 'RegisterServlet', 	// point to server-side 
	    dataType: 'text',  		// what to expect back from the server, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: requestString,                         
	    type: 'post',
	    success: function(response){
	       			alert("user: " + name + " registered successfully!"); 
    			}
 	});
}





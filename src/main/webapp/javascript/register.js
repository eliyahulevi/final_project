/********************** 	handles user page messages ***************************
 *  
 *	handles registration of a new user/whatever
 *
 ********************************************************************************/



function regNewUser(){
	
	// get users info from form
	var name = document.getElementById("reg-name").value;
	var password = document.getElementById("reg-password").value;
	var nickname = document.getElementById("reg-nick-name").value;
	var email = document.getElementById("reg-email").value;
	var address = document.getElementById("reg-address").value;
	var requestString = JSON.stringify({ "name": name, "password": password, "nickname": nickname, "email": email, "address": address });
	alert("requestString:" + requestString);
	window.location.replace("/final-project/user.html");
	
	
    $.ajax({
	    url: 'RegisterServlet', 	// point to server-side 
	    dataType: 'text',  		// what to expect back from the server, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: requestString,                         
	    type: 'post',
	    success: function(response){
	       			//alert("user: " + name + " registered successfully!"); 
	       			//onUserLogin(name, password, nickname, email, address);
    			}
 	});
}


function onUserLogin(name, password, nickname, email, address){
	
	sessionStorage.setItem('username', name);
	sessionStorage.setItem('password', password);
	sessionStorage.setItem('nickname', nickname);
	sessionStorage.setItem('email', email);
	sessionStorage.setItem('phone', phone);
	sessionStorage.setItem('address', address);
	window.location.replace("/final-project/user.html");
	alert();
}



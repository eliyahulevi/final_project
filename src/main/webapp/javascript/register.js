/********************** 	handles user page messages ***************************
 *  
 *	handles registration of a new user/whatever
 *
 ********************************************************************************/



/*********************************************************************************
 *	this function fires up upon registration form submission
 ********************************************************************************/
function regNewUser(){
	
	// get users info from form
	var name = document.getElementById("reg-name").value;
	var password = document.getElementById("reg-password").value;
	var nickname = document.getElementById("reg-nick-name").value;
	var email = document.getElementById("reg-email").value;
	var address = document.getElementById("reg-address").value;
	var requestString = JSON.stringify({ "name": name, "password": password, "nickname": nickname, "email": email, "address": address });
	
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
	       			onUserRegistration(name, password, nickname, email, address);
    			}
 	});
}


/********************************************************************************
 *	this function fires up upon successful registration, clean session storage
 *	 and redirect to user page, with user details
 ********************************************************************************/
function onUserRegistration(name, password, nickname, email, address){
	
	sessionStorage.removeItem('username');
	sessionStorage.removeItem('password');
	sessionStorage.removeItem('nickname');
	sessionStorage.removeItem('email');
	sessionStorage.removeItem('phone');
	sessionStorage.removeItem('address');
	
	sessionStorage.setItem('username', name);
	sessionStorage.setItem('password', password);
	sessionStorage.setItem('nickname', nickname);
	sessionStorage.setItem('email', email);
	sessionStorage.setItem('address', address);
	window.location.replace("/final-project/user.html");
}



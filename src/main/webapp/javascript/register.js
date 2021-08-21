/********************** 	handles user page messages ***************************
 *  
 *	handles registration of a new user/whatever
 *
 ********************************************************************************/



/*********************************************************************************
 *	this function fires up upon registration form submission
 ********************************************************************************/
function regNewUser(){
	
	console.log('register new user');
	// get users info from form
	var name 			= document.getElementById("reg-name").value;
	var password 		= document.getElementById("reg-password").value;
	var nickname 		= document.getElementById("reg-nick-name").value;
	var email 			= document.getElementById("reg-email").value;
	var address 		= document.getElementById("reg-address").value;
	var image			= "";		// optional
	var description		= "";		// optional
	var phone			= "";		// optional
	var formData		= new FormData();
	
	formData.append("code", "0");
	formData.append("user", name);
	formData.append("nickname", nickname);
	formData.append("password", password);  
	formData.append("email", email);
	formData.append("address", address);
	formData.append("image", image);
	formData.append("date", new Date().getTime());
	formData.append("phone", phone);
	formData.append("description", description);
	
    $.ajax({
	    url: 'RegisterServlet', 	 
	    dataType: 'text',  		
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: formData,                         
	    type: 'post',
	    success: function(response){
					console.log(response);
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



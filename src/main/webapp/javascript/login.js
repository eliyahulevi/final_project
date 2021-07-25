/********************** 	handles user login **********************************
*		user JSON format (sent from loginservlet):
*		{
*		"username": user name,
*		"password": user password,
*		"nickname": nickName,
*		"email": e-mail,
*		"phone": phone,
*		"address": address
*		}
*
********************************************************************************/


/*********************************************************************************
*	this function finds the registered user as typed into the login form and
*	sends the request to the server  
*********************************************************************************/	
function login(){
	
	var name = document.getElementById("sign-in-model-name").value;
	var password = document.getElementById("sign-in-model-password").value;
	var requestString = 'name=' + name + ',password=' + password;
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', 'LoginServlet2', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(requestString);	
	xhr.onreadystatechange = function() {
	
		if (xhr.readyState == 4) {			
			var data = xhr.responseText;
			if (data != "") {
				onSuccess(data);
			}	
			else alert("no user found!");		
		}
	}
}


/*********************************************************************************
*	this function handles on successful login event
*********************************************************************************/
function onSuccess(data){
	var user = JSON.parse(data);
	sessionStorage.setItem('username', user.username);
	sessionStorage.setItem('password', user.password);
	sessionStorage.setItem('nickname', user.nickname);
	sessionStorage.setItem('email', user.email);
	sessionStorage.setItem('phone', user.phone);
	sessionStorage.setItem('address', user.address);
	console.log('log in success: ' + user.username);
	window.location.replace("/final-project/user.html");
}


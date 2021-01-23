/**
 *  handle login functionality
 */
function login(){
	
	var name = document.getElementById("sign-in-model-name").value;
	var password = document.getElementById("sign-in-model-password").value;
	var requestString = 'name=' + name + ',password=' + password;
	//alert("requestString:" + requestString);
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'LoginServlet2', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(requestString);	
	xhr.onreadystatechange = function() {
	
		if (xhr.readyState == 4) {
			
			var data = xhr.responseText;
			alert("response from servlet: " + data);
			//var response = ""; 
			if (data == "1")  helloUser(name);	
			else alert("no user found!");		
		}
	}
	

}

function helloUser(name){
	alert(name);
	window.location.replace("/final-project/user_page.html");
}

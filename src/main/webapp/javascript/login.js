/**
 *  handle login functionality
 */
function login(){
	
	var name = document.getElementById("sign-in-model-name").value;
	var password = document.getElementById("sign-in-model-password").value;
	url = "LoginServlet2"; 
	//alert("name:" + name + " password:" + password);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			var response = "";
			if (data == 1) response = "hello" + name;
			else response = "unknown user";
			alert(response);
		}
	}
	
    xhr.open('POST', 'LoginServlet2', true);
    xhr.send(name, password);
}

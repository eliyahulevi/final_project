/**
 * 	handles user page functionality
 */

$(document).ready(function(){
  $("#send-Message-Modal").on('show.bs.modal', function(){
    loadUsers();
  });
}); 

function myFunction(){	
	alert("page loaded");
	var name = sessionStorage.getItem('label', name);
	var obj = JSON.parse(name);
	//alert(name);
	document.getElementById("name-user-page-body").innerHTML = obj.username;
	document.getElementById("nickname-user-page-body").innerHTML = obj.nickname;
	document.getElementById("email-user-page-body").innerHTML = obj.email;
	document.getElementById("phone-user-page-body").innerHTML = obj.phone;
	document.getElementById("address-user-page-body").innerHTML = obj.address;
}

function loadUserPage(user){
	sessionStorage.getItem('user');
	alert(user);
}

function loadUsers(){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'UserServlet', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();	
	xhr.onreadystatechange = function() {
		
		if (xhr.readyState == 4) {
			
			var count;		
			var data = xhr.responseText;
			var obj = JSON.parse(data);
 			alert(obj.length);	
			if ( obj.length > 0) 
			{
				 alert(obj);	
			}	
			else alert("no user found!");		
			
		}
	}

}

/**
 * 	handles user page functionality
 */


function myFunction(){	
	alert("page loaded");
	var name = sessionStorage.getItem('label', name);
	var obj = JSON.parse(name);
	//alert(name);
	document.getElementById("user-page-body").innerHTML = obj.username;
}

function loadUserPage(user){
	sessionStorage.getItem('user');
	alert(user);
}

/**
 * 	handles user page functionality
 */


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

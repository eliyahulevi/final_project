/**
 * 	handles user page functionality
 */


function myFunction(){	
	var user = JSON.parse(sessionStorage.user);
	alert(user);
	document.getElementById("user-page-body").innerHTML = user.username;
}

function loadUserPage(user){
	sessionStorage.getItem('user');
	alert(user);
}

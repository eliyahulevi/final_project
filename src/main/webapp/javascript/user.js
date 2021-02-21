/**
 * 	handles user page functionality according to msg code from userservlet.
 *	the messages codes are as follows:
 *	0x0000 - load registered users into "send message" modal
 *	0x0001 - send the message the user typed in
 *	0x0002 -  
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
	//alert(user);
}

function loadUsers(){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'UserServlet', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({code: 0x0000}) );	
	xhr.onreadystatechange = function() {	
		if (xhr.readyState == 4) {			
			var count;		
			var data = xhr.responseText;
			var array = JSON.parse(data);
 				
			if ( (count = array.length) > 0) 
			{
				var selectList = document.getElementById("users");
				for (var i = 0; i < count; i++) {
					var option = document.createElement("option");
			    	option.value = array[i];
			    	option.text = array[i];
			    	selectList.appendChild(option);
				}
			}	
			else alert("no users found!");					
		}
	}
}

function sendMessage(){
	var msg = document.getElementById("msg");
	var usrs = document.getElementById("users");
	var usr = usrs.options[usrs.selectedIndex].text;
	alert(JSON.stringify([0x0001, usr, msg.value]));
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'UserServlet', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({code: 0x0001, user: usr, message: msg.value}));	
    
}

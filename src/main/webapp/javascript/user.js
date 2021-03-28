/********************** 	handles user page messages ***************************
 *	the message format is as follows (JSON):
 *	[{"code", "user", "message", "image"}]
 *
 *	the messages codes are as follows:
 *	0x0000 - load registered users into "send message" modal
 *	0x0001 - send the message the user typed in
 *	0x0002 - uploap images  
 *
 ********************************************************************************/



/*********************************************************************************
*	this function is the first to file up when the page is loaded, it
*	binds the on.show event of the send message modal to fire up
*	the loadUsers function, in order to populate the users list
*********************************************************************************/
$(document).ready(function(){

	// hide the 'update' button in 'personal-details' section
	document.getElementById("pt-update").style.display = "none";
	
	// load user's personal details & messages
	loadUserDetails();
	loadUserMessages();

	// load users to 'send-message' modal
	$("#send-Message-Modal").on('show.bs.modal', function(){
		loadUsers();
	});
  
});


/*********************************************************************************
*	this function sends the updated user details to the server
*********************************************************************************/
function loadUserMessages(){
	alert("messages loaded");
	
}


/*********************************************************************************
*	this function sends the updated user details to the server
*********************************************************************************/
function pt_update(){
	var name = 	document.getElementById("pt-user-name").value;
	var password = document.getElementById("pt-password").value;
	var nickname = document.getElementById("pt-nickname").value;
	var email = document.getElementById("pt-email").value;
	var address = document.getElementById("pt-address").value;
	alert("name:" + name + " password:" + password + " nickname:" + nickname + " email:" +  email + " address" + address);
}


/*********************************************************************************
*	this function DISABLES all fields in 'personal details' section and HIDES 
*	'update' and 'cancel' buttons
*********************************************************************************/
function pt_cancel(){
	document.getElementById("pt-user-name").disabled = true;
	document.getElementById("pt-password").disabled = true;
	document.getElementById("pt-nickname").disabled = true;
	document.getElementById("pt-email").disabled = true;
	document.getElementById("pt-address").disabled = true;
	document.getElementById("pt-update").style.display = "none";
	document.getElementById("pt-cancel").style.display = "none";	
}


/*********************************************************************************
*	this function enables all fields in 'personal details' section and shows 
*	'update' and 'cancel' buttons
*********************************************************************************/
function edit(){	
	document.getElementById("pt-user-name").disabled = false;
	document.getElementById("pt-password").disabled = false;
	document.getElementById("pt-nickname").disabled = false;
	document.getElementById("pt-email").disabled = false;
	document.getElementById("pt-address").disabled = false;
	document.getElementById("pt-update").style.display = "block";
	document.getElementById("pt-cancel").style.display = "block";		
}

/*********************************************************************************
*	this function iterate over all images, checked if chosen and sent to server
*********************************************************************************/
function upload(){
	let arr = [];
	var ckbx = document.getElementById("output").getElementsByTagName("input");
	var images = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			alert("array at:" + i + " = " + images[i].name);
  		}
	}
	sendImages(arr);
}


/*********************************************************************************
*	this function resets the images chosen
*********************************************************************************/
function cancel(){
	alert("TODO: add cancel functionality");
}


/*********************************************************************************
*	this function simply shows the hidden elements to allow images upload
*********************************************************************************/
function showFileLoad(){
	document.getElementById("file-upload-area").style.display = "block";
	document.getElementById("upload-file-btn").style.display = "block";
	document.getElementById("cancel-file-btn").style.display = "block";
} 


/*********************************************************************************
*	this function does the same as the following but for 'browsing option'
*********************************************************************************/
function onChange(input){
	var url = $(input).val();
	var file = input.files[0];
	var name = file.name;
	var parent = document.getElementById("output");	
	var reader = new FileReader();
    reader.onload = function (event) {
				    	parent.appendChild(createCheckedImage(event.target.result, name));
				    };

    reader.readAsDataURL(file);
}


/*********************************************************************************
*	this function handles the drop event of the files upload element,
*	simply places the chosen images in the output element
*
*********************************************************************************/
function drop(event){
    event.stopPropagation();
    event.preventDefault();
    
    var parent = document.getElementById("output");
    var files = event.dataTransfer.files;
    var file = files[0];
	var reader = new FileReader();
  	
    reader.onload = function (event) {
				    	var image = new Image();
				    	image.src = (event.target.result);
				    	parent.appendChild(createCheckedImage(image.src));
				    };

    reader.readAsDataURL(file);
}


/*********************************************************************************
*	this function creates the following div structure:
*	that will hold a checkbox element with image
*						<div>
*							<input type="checkbox"../>
*							<label>
*								<img/>
*							</label>
*						</div>
*********************************************************************************/
function createCheckedImage(source, name){
	
	var id = Math.floor(Math.random() * 100); 
	var newDiv = document.createElement("div");
	var newImg = document.createElement("img");
	var newLbl = document.createElement("label");
	var newCheckbox = document.createElement("input");
	
	newCheckbox.setAttribute("type", "checkbox");
	newCheckbox.setAttribute("class", "custom-control-input");
	newCheckbox.setAttribute("id", id);
	
	newImg.setAttribute("alt", "#");
	newImg.setAttribute("class", "thumb");
	newImg.setAttribute("src", source);
	newImg.setAttribute("name", name);
	
	newLbl.setAttribute("class", "custom-control-label");
	newLbl.setAttribute("for", id);
	newLbl.appendChild(newImg);
	
	newDiv.setAttribute("class", "custom-control custom-checkbox image-checkbox");
	newDiv.setAttribute("style", "display:inline-block");
	newDiv.appendChild(newCheckbox);
	newDiv.appendChild(newLbl);

	return newDiv;
}


/*********************************************************************************
*	this function loads the registered user details into:
*	1. the page header
*	2. the page 'Personal DEtails' section 
*********************************************************************************/
function loadUserDetails(){

	let name = sessionStorage.getItem('username');
	let password = sessionStorage.getItem('password');
	let nickname = sessionStorage.getItem('nickname');
	let email = sessionStorage.getItem('email');
	let address = sessionStorage.getItem('address');
	
	//alert("name:" + name + " password:" + password + " nickname:" + nickname + " email:" +  email + " address" + address);
	document.getElementById("user-details-header").innerHTML = name;
	
	document.getElementById("pt-user-name").value = name;
	document.getElementById("pt-user-name").disabled = true;
	document.getElementById("pt-password").value = password;
	document.getElementById("pt-password").disabled = true;
	document.getElementById("pt-nickname").value = nickname;
	document.getElementById("pt-nickname").disabled = true;
	document.getElementById("pt-email").value = email;
	document.getElementById("pt-email").disabled = true;
	document.getElementById("pt-address").value = address;
	document.getElementById("pt-address").disabled = true;
	//TODO: add phone detail
	//document.getElementById("pt-user-name").value = phone;
	//document.getElementById("pt-user-name").disabled = true;
	
}


/*********************************************************************************
*	this function loads registered user from db and add to the list of users
*	to choose from while sending a new message 
*********************************************************************************/
function loadUsers(){

	const obj = {hello: 'world'};
	var selectList = document.getElementById("users");
	var blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
	var form_data = new FormData();
	form_data.append("code", "0");
	form_data.append("user", "test");
	form_data.append("sender", ""); 
	form_data.append("message", "");
	form_data.append("image", blob);
	form_data.append("date", "");
	
	/*
	for (var value of form_data.values()) {
  		alert(value);
	}*/
	
    $.ajax({
        url: 'UserServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(data){
        			
		            var count;		
					//var data = xhr.responseText;
					var array = JSON.parse(data);
					
			
					if ( (count = array.length) > 0) 
					{
						// init & fill  the selection 
						for (var i = 0; i < count; i++) {
							alert(array[i]);
							selectList.options[i] = null;
							var option = document.createElement("option");
					    	option.value = array[i];
					    	option.text = array[i];
					    	selectList.appendChild(option);
						}
					}	
					else alert("no users found!");
        		}
     });
	
	/*
	var selectList = document.getElementById("users");
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
										// init the selection
										for (var i = 0; i < count; i++) {
											selectList.options[i] = null;
										}
										// fill  the selection 
										for (var i = 0; i < count; i++) {
											selectList.options[i] = null;
											var option = document.createElement("option");
									    	option.value = array[i];
									    	option.text = array[i];
									    	selectList.appendChild(option);
										}
									}	
									else alert("no users found!");					
								}
							 }
	 */ 
}


/*********************************************************************************
*	this function sends a image(s) to the server 
*********************************************************************************/
function sendImages(images){
	
	for (var i = 0; i < images.length; i++){
		var data = images[i];
		var form_data = new FormData();
		form_data.append("image", data);
		form_data.append("user", "admin");
		form_data.append("name", data.name); 
		//alert(data);
	    $.ajax({
	        url: 'ImageServlet', 	// point to server-side PHP script 
	        dataType: 'text',  		// what to expect back from the PHP script, if anything
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,                         
	        type: 'post',
	        success: function(response){
	            alert("file uploaded successfully!" + response); 
	        }
	     });
	
	}    
}


/*********************************************************************************
*	this function sends a new message to user: usr 
*********************************************************************************/
function sendMessage(){
	var msg = document.getElementById("msg");
	var usrs = document.getElementById("users");
	var usr = usrs.options[usrs.selectedIndex].text;
	var sender = sessionStorage.getItem('username');
	var date = new Date();
	var blob = new Blob(['0x0003'], {type: 'text/plain'});
	
	var form_data = new FormData();
	form_data.append("code", 0x0001);
	form_data.append("sender", sender); 
	form_data.append("user", usr);
	form_data.append("message", msg);
	form_data.append("date", date);
	form_data.append("image", blob);
	
    $.ajax({
	    url: 'ImageServlet', 	// point to server-side PHP script 
	    dataType: 'text',  		// what to expect back from the PHP script, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: form_data,                         
	    type: 'post',
	    success: function(response){
	       			alert("file uploaded successfully!" + response); 
    			}
 	});
		
	/*
	var xhr = new XMLHttpRequest();
	alert(JSON.stringify({code: 0x0001, user: usr, sender: sender, message: msg.value, date: date, image:blob}));
	xhr.open('POST', 'UserServlet', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({code: 0x0001, user: usr, sender: sender, message: msg.value, date: date, image:blob}));	
    */
}

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
	document.getElementById("msg-text-upload").style.display = "none";
	
	if( sessionStorage.getItem('username') == 'admin' ){
		displayAdmin();
	}
	loadUserOrders();
	loadUserDetails();
	loadUserMessages();

	// load users to 'send-message' modal
	$("#send-Message-Modal").on('show.bs.modal', function(){
		loadUsers();
	});
  
});


/*********************************************************************************
*	this function displays admin functionality: add product..
*********************************************************************************/
function displayAdmin(){
	
	var header = document.getElementById('nav-bar-items');
	var li = document.createElement('li');
	var a = document.createElement('a');
	
	li.setAttribute('id', 'add-product');
	a.innerHTML = 'Add Product';
	a.setAttribute('href', '#products');
	
	li.appendChild(a);
	header.appendChild(li);
	alert('display admin');
}


/*********************************************************************************
*	this function get a message in JSON format, parse it and displays
*********************************************************************************/
function onTextChange(){	
	var key = window.event.keyCode;
	if (key === 13) {
        upload();
    }  
}


/*********************************************************************************
*	this function load all the users orders (past and present) from the server DB
*********************************************************************************/
function loadUserOrders(){
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "0");
		formdata.append("user", sessionStorage.getItem('username'));
		formdata.append("sender", ""); 
		formdata.append("message", "");
		formdata.append("image", "");
		formdata.append("date", date);
		alert('load products'); 
		
		$.ajax({    
        url: 'ProductServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        success: function(response){ 
        			var products = JSON.parse(response);    			 			
		            //var form = document.getElementById("items");
		            var length = products.length;
		            for(var i = 0; i < length; i++){
		            	//var item = createItem(product[i]);		// TODO: implement 'createItem' (below)
		            	//form.appendChild(item);					
		            }
    			}
     	});
}


/*********************************************************************************
*	this function sends the updated user details to the server
*********************************************************************************/
function loadUserMessages(){
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "2");
		formdata.append("user", sessionStorage.getItem('username'));
		formdata.append("sender", ""); 
		formdata.append("message", "");
		formdata.append("image", "");
		formdata.append("date", date);
	    $.ajax({
        url: 'UserServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        success: function(response){ 
        			var messages = JSON.parse(response);      			
		            var form = document.getElementById("msg-display");
		            var users_list = document.getElementById("users-list");
		            for(var i = 0; i < messages.length; i++){
		            	var msg = createMessage(messages[i]);
		            	var sender = createSender(messages[i]);
		            	if(!userExist(sender.value) ){
		            		users_list.add(sender);
	            		}
		            	form.appendChild(msg);
		            }
        		}
     });
}


/*********************************************************************************
*	this function search for a specific user name 'sender' in the user select 
*	drop-down menu
*********************************************************************************/
function userExist(user){
	var result = false;
	var users = document.getElementById('users-list');
	var len = users.length;
	for(var i = 0; i < len; i++){
		if(users[i].value == user){
			//alert(users[i]);
			result = true;
			break;
		}
	}	
	return result;
}



/*********************************************************************************
*	this function load all message of a specific 'sender' (user)
*********************************************************************************/
function onSenderChosen(){
	alert();
}


/*********************************************************************************
*	this function takes a message in JSON format and create an option 'sender'
*********************************************************************************/
function createSender(jMessage){

	var result 	  = document.createElement("option");
	var message   = JSON.parse(jMessage);
	result.value  = message.sender;
	result.innerHTML = message.sender;
	return result;
}



/*********************************************************************************
*	this function takes a message in JSON format and create a message element
*********************************************************************************/
function createMessage(jsonMessage){
	
	var message   = JSON.parse(jsonMessage);
	var user 	  = message.user;
	var sender	  = message.sender;
	var date 	  = Number(message.date);
	var clicked   = message.clicked;
	var msg_text  = message.message;
	var msgCount  = 0;
	
	var frame 	  = document.createElement("div");
	var userTag   = document.createElement("a");
	var replyUser = document.createElement("a");
	var p 		  = document.createElement("p");
	var span 	  = document.createElement("span");
	var spanStart = document.createElement("span");
	var spanEnd   = document.createElement("span");
	var reply 	  = document.createElement("span");
	var msg       = document.createElement("p");	
	var clkd      = document.createElement("a");
	var messages  = document.getElementsByClassName('message');
	
		
	alert(clicked);
	for(var i = 0; i < messages.length; i++){	
		msgCount++;
	}
	
	sessionStorage.setItem('messageRealTime' + msgCount, date);	
	
	clkd.setAttribute('id', 'clicked' + msgCount);
	clkd.setAttribute('style', 'visibility:hidden;');
	clkd.innerHTML = clicked;
	
	spanStart.innerHTML = msg_text;
	spanEnd.innerHTML = " on " + new Date(date);
	spanEnd.setAttribute("id", 'date' + msgCount );
	
	userTag.setAttribute('id', 'user' + msgCount);
	userTag.setAttribute('href', '#user' + msgCount);
	userTag.innerHTML = sender;
	
	replyUser.setAttribute('id', 'user-reply' + msgCount);
	replyUser.setAttribute('href', '#reply' + msgCount);
	replyUser.setAttribute('onclick', 'replyClicked(' + msgCount + ')' );
	replyUser.innerHTML = " reply";
	
	span.appendChild(userTag);
	
	p.appendChild(spanStart);
	p.appendChild(span);
	p.appendChild(spanEnd);
	
	if(user == "admin" ){
		reply.appendChild(replyUser);
		p.appendChild(reply);
	}

	frame.setAttribute("class", "message");
	frame.setAttribute("id", "message" + msgCount);
	frame.setAttribute("onclick", 'messageClicked(' + msgCount + ')' );
	frame.appendChild(userTag);
	frame.appendChild(p);
	frame.appendChild(clkd);
	if(clicked == 'true'){
		frame.setAttribute("style", "background: rgba(0.0, 0.0, 0.0, 0.0)");
	}
	
	return frame;	
}


/*********************************************************************************
*	this function handles message element being clicked
*********************************************************************************/
function messageClicked(p){
	var click = document.getElementById('clicked' + p);
	var user = sessionStorage.getItem('username');
	var date = sessionStorage.getItem('messageRealTime' + p)
	var formData = new FormData();
	
	if(click.innerHTML == 'false'){
		formData.append("code", "3");
		formData.append("user", user.slice(0,20)); 
		formData.append("sender", user.slice(0,20));
		formData.append("message", "");
		formData.append("date", date); 
		
	    $.ajax({
		    url: 'UserServlet', 	// point to server-side 
		    dataType: 'text',  		// what to expect back from the server, if anything
		    cache: false,
		    contentType: false,
		    processData: false,
		    data: formData,                         
		    type: 'post',
		    success: function(response){
       					var msg = document.getElementById('message' + p);
						msg.setAttribute('style', 'background-color: #ffffff;');
						click.innerHTML = 'true';
	    			}
	 	});
 	}
}


/*********************************************************************************
*	this function is fired up when reply to specific message is clicked. reply
*	area is being added to page under the chosen message and 'message clicked' 
*	is sent
*********************************************************************************/
function replyClicked(p){
	var count = p;
	var sender = document.getElementById('user' + count);
	var date = document.getElementById('date' + count).innerHTML;
	var user = sessionStorage.getItem('username');
	var formData = new FormData();
	
	
	
	var existingNode = document.getElementById("message" + count);	
	var reply = document.createElement("div");
	var replyText = document.createElement("textarea");
	var form = document.createElement("form");
	var span1 = document.createElement("span");
	var span2 = document.createElement("span");
	var p = document.createElement("p");	
	var btnUpload = document.createElement("button");
	var btnCancel = document.createElement("button");
	
	replyText.setAttribute("id", "msg-txt");
	replyText.setAttribute("name", "msg-txt");
	replyText.setAttribute("onkeypress", "onTextChange()");
	
	form.setAttribute("id", "output1");
	form.setAttribute("action", "upload");
	form.setAttribute("method", "post");
	form.setAttribute("enctype", "multipart/form-data");
	
	span1.setAttribute("style", "display:inline-block");
	span2.setAttribute("style", "float:right; padding-right:0px;");
	
	btnUpload.innerHTML = "upload";
	btnUpload.setAttribute('id', 'upload-file-btn' + count);
	btnUpload.setAttribute('type', 'button');
	btnUpload.setAttribute('class', 'btn btn-success');
	btnUpload.setAttribute("onclick", 'upload(' + count + ')');
	
	btnCancel.innerHTML = "cancel";
	btnCancel.setAttribute('id', 'cancel-file-btn' + count);
	btnCancel.setAttribute('type', 'button');
	btnCancel.setAttribute('class', 'btn btn-danger');
	btnCancel.setAttribute("onclick", 'cancel(' + count + ')' );
	
	
	// build the element hierarchy and add to page
	reply.setAttribute("id", 'reply' + count);
	reply.appendChild(replyText);	
	reply.appendChild(form);
	form.appendChild(p);
	p.appendChild(span1);
	p.appendChild(span2);
	span1.appendChild(btnUpload);
	span2.appendChild(btnCancel);
	existingNode.parentNode.insertBefore(reply, existingNode.nextSibling);
	
	//alert(user);
	notifyMessageClicked(user, date);
	
	/*
	formData.append("code", "3");
	formData.append("user", (sender.innerHTML).slice(0,20)); 
	formData.append("sender", user.slice(0,20));
	formData.append("message", replyText.value);
	formData.append("date", date); 
	
    $.ajax({
	    url: 'UserServlet', 	// point to server-side 
	    dataType: 'text',  		// what to expect back from the server, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: formData,                         
	    type: 'post',
	    success: function(response){
	       			alert("file uploaded successfully!" + response); 
    			}
 	});
	*/
}


/*********************************************************************************
*	this function resets the images chosen
*********************************************************************************/
function cancel(p){
	var obj = document.getElementById('reply' + p);	
	obj.remove();	
}


/*********************************************************************************
*	this function notify the server that the message with 'user' and 'data'
*	was clicked
*********************************************************************************/
function notifyMessageClicked(user, date){
	var formData = new FormData();
	formData.append("code", "3");
	formData.append("user", user.slice(0,20)); 
	formData.append("sender", "");
	formData.append("message", "");
	formData.append("date", date); 
    $.ajax({
	    url: 'UserServlet', 	// point to server-side 
	    dataType: 'text',  		// what to expect back from the server, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: formData,                         
	    type: 'post',
	    success: function(response){
	       			alert("message clicked"); 
    			}
	});

}


/*********************************************************************************
*	this function creates a new message element to be displayed and replied
*********************************************************************************/
function createMsgElement(message){

var form = document.getElementById("msg-display");
	
	var user = sessionStorage.getItem('username');
	var sender = sessionStorage.getItem('sender');
	var date = new Date(); 
	var msgCount = 0;
	
	var frame = document.createElement("div");
	var userTag = document.createElement("a");
	var replyUser = document.createElement("a");
	var p = document.createElement("p");
	var span = document.createElement("span");
	var spanStart = document.createElement("span");
	var spanEnd = document.createElement("span");
	var reply = document.createElement("span");
	var msg = document.createElement("p");	
	var messages = document.getElementsByClassName('message');

		
	for(var i = 0; i < messages.length; i++){	
		msgCount++;
	}
	
	spanStart.innerHTML = "user ";
	spanEnd.innerHTML = " on " + date;
	
	msg.innerHTML = " this is a test message ";
	
	userTag.setAttribute("href", "#");
	userTag.innerHTML = user;
	replyUser.setAttribute("href", "#");
	replyUser.innerHTML = " reply";
	
	span.appendChild(userTag);
	reply.appendChild(replyUser);
	
	p.appendChild(spanStart);
	p.appendChild(span);
	p.appendChild(spanEnd);
	p.appendChild(reply);

	frame.setAttribute('class', 'message');
	frame.setAttribute('id', 'message' + msgCount);
	frame.setAttribute('onclick', 'messageClicked(' + msgCount + ')' );
	frame.appendChild(userTag);
	frame.appendChild(p);
	
	return frame; 
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
	//alert("name:" + name + " password:" + password + " nickname:" + nickname + " email:" +  email + " address" + address);
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
	var formData	  = new FormData();		
	let arr 		  = [];
	var ckbx 		  = document.getElementById("output").getElementsByTagName("input");
	var images 		  = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	//sendImages(arr);
	sendMessage1(arr);
}


/*********************************************************************************
*	this function cretaes a JSON object of 'Message' type,  iterate over all images, 
*	checked if chosen and sent to server
*********************************************************************************/
function uploadMessage(number){
	let arr 		 = [];
	var msg 		 = document.getElementById('message' + number).value;
	var ckbx 		 = document.getElementById("output").getElementsByTagName("input");
	var images 		 = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	//sendImages(arr);
	sendMessage1(arr);
}


/*********************************************************************************
*	this function simply shows the hidden elements to allow images upload
*********************************************************************************/
function showFileLoad(){
	document.getElementById("file-upload-area").style.display = "block";
} 


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload
*********************************************************************************/
function showMsgText(){
	loadUsers();
	document.getElementById("msg-text-upload").style.display = "block";
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
	
	let name	   = sessionStorage.getItem('username');
	let password   = sessionStorage.getItem('password');
	let nickname   = sessionStorage.getItem('nickname');
	let email      = sessionStorage.getItem('email');
	let address	   = sessionStorage.getItem('address');
	
	alert("name:" + name + " password:" + password + " nickname:" + nickname + " email:" +  email + " address" + address);
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

	const obj	   = {data: ''};
	var selectList = document.getElementById("users");
	var blob	   = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
	var formData   = new FormData();
	var date	   = new Date();
	
	formData.append("code", "0");
	formData.append("user", "test");
	formData.append("sender", ""); 
	formData.append("message", "");
	formData.append("image", blob);
	formData.append("date", date.getTime());
	
	alert(date.getTime());
	
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
        data: formData,                         
        type: 'post',
        success: function(data){
        			
		            var count;		
					//var data = xhr.responseText;
					var array = JSON.parse(data);
					
			
					if ( (count = array.length) > 0) 
					{
						// init & fill  the selection 
						for (var i = 0; i < count; i++) {
							//alert(array[i]);
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
	
	alert(date.toISOString().split('T')[0]);
	form_data.append("code", "2");
	form_data.append("sender", sender.slice(0,20)); 
	form_data.append("user", usr.slice(0,20));
	form_data.append("message", msg);
	form_data.append("date", date.toISOString().split('T')[0]);
	form_data.append("image", blob);
	
    $.ajax({
	    url: 'UserServlet', 	// point to server-side PHP script 
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


/*********************************************************************************
*	this function sends a new message to user: usr 
*********************************************************************************/
function sendMessage1(images){

	var msg 	  = document.getElementById("msg-txt").value;
	var usrs 	  = document.getElementById("users");
	var usr  	  = usrs.options[usrs.selectedIndex].text;
	var sender	  = sessionStorage.getItem('username');
	var date	  = new Date();
	var clicked   = false;
	var formData  = new FormData();
	
	alert(date.getTime());
	formData.append("code", "1");
	formData.append("sender", sender.slice(0,20)); 
	formData.append("user", usr.slice(0,20));
	formData.append("message", msg);
	formData.append("date", date.getTime());
	formData.append("clicked", clicked);
	
	if( images.length > 0){
		for(var i = 0; i < images.length; i++){
			form_data.append("image", images[i]);
		}		
	}
	
    $.ajax({
	    url: 'UserServlet', 	// point to server-side PHP script 
	    dataType: 'text',  		// what to expect back from the PHP script, if anything
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: formData,                         
	    type: 'post',
	    success: function(response){
	       			alert("file uploaded successfully!" + response); 
    			}
 	});
}


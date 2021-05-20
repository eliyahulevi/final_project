/********************** 	handles user page messages ***************************
 *	the message format is a JSON object as follows:
 *	{ 	
 *		"code", 	message code,
 *		"sender", 	sender, 
 *		"user", 	user,
 *		"message", 	message,
 *		"date", 	date,
 *		"clicked", 	clicked,
 *		"image",	image(s),
 *		"offset", 	0
 *	}
 *
 *	the messages codes are as follows:
 *	0x0000 - load registered users into "send message" modal
 *	0x0001 - send the message the user typed in
 *	0x0002 - uploap images  
 *
 ********************************************************************************/


var wsocket = null;

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
	loadProducts(false);
	loadUserOrders(false);
	loadUserDetails();
	//loadUserMessages(false);

	// load users to 'send-message' modal
	$("#send-Message-Modal").on('show.bs.modal', function(){
		loadUsers();
	});
	
	wsocket 			= new WebSocket("ws://localhost:8080/final-project/messages");
	wsocket.onopen 		= onOpen; 	
	wsocket.onclose		= onClose;
	wsocket.onerror		= onError;	
	wsocket.onmessage 	= onMessage;
  
});


/*********************************************************************************
*	this function handles the event a web socket is being started at the client
*	side. 
*	@parameter event: 	holds the socket data(?)
*	return:				null
*********************************************************************************/
function onOpen(event) {
	var date = new Date().getTime();
	var message = createSocketMessage("0", sessionStorage.getItem('username'), "", "", date, "", "", 0, "");	
	wsocket.send(JSON.stringify(message));
}


/*********************************************************************************
*	this function handles the event when a message comes in from the server 
*	endpoint. 
*	@parameter event: 	holds the message data
*	return:				null
*********************************************************************************/
function onMessage(event) {	
    var message = JSON.parse(event.data);
    
    if (message.action === "add") {

    }
    if (message.action === "remove") {

    }
    if (message.action === "messages") {
    	
    	var form 		= document.getElementById("msg-display");
		var parsedMsgs 	= [];	
		var messages 	= message.src;	
		var numberOfMessages = messages.length;
		
		alert('on message: ' + messages);
		document.getElementById('numberOfMessages').innerHTML = numberOfMessages;
		for(var i = 0; i < messages.length; i++){
			var parsedMsg = JSON.parse(messages[i]);
 			parsedMsg.visited = 0;
			parsedMsgs[i] = parsedMsg;
		}
	    while (form.firstChild) {
        	form.removeChild(form.firstChild);
    	}
        for(var i = 0; i < parsedMsgs.length; i++){
			var msg = createMessage(parsedMsgs[i]);
			if(parsedMsgs[i].visited == 0){
				var msg = createMessage(parsedMsgs[i]);
				form.appendChild(msg);
			}
			insertRepliedMessages(parsedMsgs, i);       	
		}
    }
	if(message.action === "image")
	{	
		//addImage(message.src);
	}	
}


/*********************************************************************************
*	this function handles the event a web socket is closing at the client
*	side. 
*	@parameter event: 	holds the socket closing data(?)
*	return:				null
*********************************************************************************/
function onClose(event) {
	alert('closing socket' + event);
}



/*********************************************************************************
*	this function handles the event of a socket error at the client side. 
*	@parameter event: 	holds the socket error data(?)
*	return:				null
*********************************************************************************/
function onError(event) {
	alert('error in socket' + event);
}


/*********************************************************************************
*	this function insert imcomming images from sever into 'content' div in page.
*	for now, only png format is handled. 
*	@parameter image: 	the image SOURCE encoded in Base64
*	return:				null
*********************************************************************************/
function addImage(image){
	var content = document.getElementById("content");	
	var img = document.createElement("img");
	img.src = "data:image/png;base64," + image;
	content.appendChild(img);	
}



/*********************************************************************************
*	this function loads all available product from DB
*********************************************************************************/
function loadProducts(sync){
		var formdata = new FormData();
		formdata.append("code", "0");
		formdata.append("catalog", "0");
		formdata.append("type", "0"); 
		formdata.append("price", "0");
		formdata.append("length", "0");
		formdata.append("color", "");
		//alert('load products'); 
		
		$.ajax({    
        url: 'ProductServlet', 	
        dataType: 'text',  		
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        async: sync,
        success: function(response){ 
        			var products = JSON.parse(response);
        			var table = document.getElementById("products-table");
        			for(var i = 0; i < products.length; i++){
        				var row = table.insertRow(i);
        				var cell1 = row.insertCell(0);
        				var cell2 = row.insertCell(1);
        				var cell3 = row.insertCell(2);
        				var cell4 = row.insertCell(3);
        				var cell5 = row.insertCell(4);
        				
        				cell1.innerHTML = products[i].catalog;
        				cell2.innerHTML = products[i].type;
        				cell1.innerHTML = products[i].price;
        				cell4.innerHTML = products[i].length;
        				cell5.innerHTML = products[i].color;
        			}
    			}
     	});
}


/*********************************************************************************
*	this function send added product to the server (and from there to the DB)
*********************************************************************************/
function addNewProduct(){
		
		var productID = document.getElementById('product-id');
		var productLength = document.getElementById('product-length');
		var productType = document.getElementById('product-type');
		var productPrice = document.getElementById('product-price');
		var productColor = document.getElementById('product-color');
		
		
		if(productLength.value === ''){
			alert('productLength is empty');
		}
		if(productID.value == "" || productLength.value == "" || productType.value === "" || productPrice.value == "" || productColor.value == ""){
			alert('please fill out ALL fields!');
			alert('cat:' + productID.value+
				  ' type:' + productType.value +
				  ' length:' + productLength.value +
				  ' price: ' + productPrice.value +
				  ' color: ' + productColor.value);
			return;
		}
		var formdata = new FormData();
		formdata.append("code", "1");
		formdata.append("catalog", productID.value);
		formdata.append("type", productType.value); 
		formdata.append("price", productPrice.value);
		formdata.append("length", productLength.value);
		formdata.append("color", productColor.value);
		//alert('load products'); 
		
		$.ajax({    
        url: 'ProductServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        success: function(response){ 
        			cancelAddProduct()
    			}
     	});
}


/*********************************************************************************
*	this function cancel the adding product procedure
*********************************************************************************/
function cancelAddProduct(){
	var addProductBtn 		= document.getElementById('add-product-btn');
	var cancelAddProductBtn = document.getElementById('cancel-product-btn');
	var addProductFoprm 	= document.getElementById('new-product');
	
	addProductBtn.setAttribute('style', 'display:none;');
	cancelAddProductBtn.setAttribute('style', 'display:none;');
	addProductFoprm.setAttribute('style', 'display:none;');
}


/*********************************************************************************
*	this function displays admin functionality: add product..
*********************************************************************************/
function showAddProduct(){
	
	var form 			= document.createElement('form');
	var inputCat 		= document.createElement('input');
	var inputType 		= document.createElement('input');
	var inputLength 	= document.createElement('input');
	var inputPrice 		= document.createElement('input');
	var inputColor 		= document.createElement('input');
	var addProductBtn 	= document.createElement("button");
	var cancelProductBtn= document.createElement("button");
	var p 				= document.createElement("p");
	var tbl 			= document.createElement('table');
	var trHeader 		= document.createElement('tr');
	var trValues 		= document.createElement('tr');
	var thCatalog 		= document.createElement('th');
	var thType 			= document.createElement('th');
	var thPrice 		= document.createElement('th');
	var thLength 		= document.createElement('th');
	var thColor 		= document.createElement('th');
	var tdCatalogInput 	= document.createElement('td');
	var tdTypeInput 	= document.createElement('td');
	var tdPriceInput 	= document.createElement('td');
	var tdLengthInput 	= document.createElement('td');
	var tdColorInput 	= document.createElement('td');
	var hr			 	= document.createElement('hr');
	
	
	
	tbl.setAttribute('class', 'Table');
	thCatalog.innerHTML = 'Catalog [integer]';
	thType.innerHTML 	= 'Type [integer]';
	thPrice.innerHTML 	= 'Price [decimal]';
	thLength.innerHTML 	= 'Length [decimal]';
	thColor.innerHTML 	= 'Color [name]';

	trHeader.appendChild(thCatalog);
	trHeader.appendChild(thType);
	trHeader.appendChild(thPrice);
	trHeader.appendChild(thLength);
	trHeader.appendChild(thColor);

	tdCatalogInput.setAttribute('align', 'center');
	tdCatalogInput.appendChild(inputCat);
	tdTypeInput.appendChild(inputType);
	tdLengthInput.appendChild(inputLength);
	tdPriceInput.appendChild(inputPrice);
	tdColorInput.appendChild(inputColor);
	
	trValues.appendChild(tdCatalogInput);
	trValues.appendChild(tdTypeInput);
	trValues.appendChild(tdPriceInput);
	trValues.appendChild(tdLengthInput);
	trValues.appendChild(tdColorInput);

	tbl.appendChild(trHeader);
	tbl.appendChild(trValues);
	
	hr.setAttribute("class", "separator");
  			
	form.setAttribute("id", "new-product");
	form.setAttribute('style', 'float:center;');

	inputCat.setAttribute("type", "text");
	inputCat.setAttribute("id", "product-id");
    inputCat.setAttribute("placeholder", "insert catalog number");  
    inputCat.setAttribute("required", "");
    
    inputType.setAttribute("id", "product-type");
    inputType.setAttribute("required", "");
    inputPrice.setAttribute("id", "product-price");
    inputPrice.setAttribute("required", "");
    inputLength.setAttribute("id", "product-length");
    inputLength.setAttribute("required", "");
    inputColor.setAttribute("id", "product-color");
    inputColor.setAttribute("required", "");
    
    addProductBtn.innerHTML = "add product";
	addProductBtn.setAttribute('id', 'add-product-btn');
	addProductBtn.setAttribute('type', 'button');
	addProductBtn.setAttribute('class', 'btn btn-success');
	addProductBtn.setAttribute("onclick", 'addNewProduct()');
	
	cancelProductBtn.innerHTML = "cancel";
	cancelProductBtn.setAttribute('id', 'cancel-product-btn');
	cancelProductBtn.setAttribute('type', 'button');
	cancelProductBtn.setAttribute('class', 'btn btn-danger');
	cancelProductBtn.setAttribute('style', 'float:right; padding-right:10px;');
	cancelProductBtn.setAttribute("onclick", 'cancelAddProduct()' );
	
	p.appendChild(addProductBtn);
	p.appendChild(cancelProductBtn);
	
	form.appendChild(hr);
	form.appendChild(tbl);
	form.appendChild(p);
	
	var container = document.getElementById("products");
	container.appendChild(form);
	
}


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
	//alert('display admin');
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
function loadUserOrders(sync){
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "4");
		formdata.append("user", sessionStorage.getItem('username'));
		formdata.append("sender", ""); 
		formdata.append("message", "");
		formdata.append("image", "");
		formdata.append("date", date);
		//alert('load products'); 
		
		$.ajax({    
        url: 'UserServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        async: sync,
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
*	this function load all users messages from the server for the registered user 
*********************************************************************************/
function loadUserMessages(sync){
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "2");
		formdata.append("user", sessionStorage.getItem('username'));
		formdata.append("sender", ""); 
		formdata.append("message", "");
		formdata.append("image", "");
		formdata.append("date", date);
		formdata.append("offset", 0);
		formdata.append("repliedTo", "");
	    $.ajax({
        url: 'UserServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        async: sync,
        success: function(response){ 
               			
        		    var form = document.getElementById("msg-display");
        			var parsedMsgs = [];
        			var messages = JSON.parse(response);   
        			
        			for(var i = 0; i < messages.length; i++){
        				var parsedMsg = JSON.parse(messages[i]);
        				parsedMsg.visited = 0;
        				parsedMsgs[i] = parsedMsg;
        			}   		
        			
		            for(var i = 0; i < parsedMsgs.length; i++){
	            		var msg = createMessage(parsedMsgs[i]);
		            	if(parsedMsgs[i].visited == 0){
		            		var msg = createMessage(parsedMsgs[i]);
		            		form.appendChild(msg);
		            	}
		            	insertRepliedMessages(parsedMsgs, i);       	
		            }
        		}
     });
}


/*********************************************************************************
*	this function inserts a message element into the document tree
*********************************************************************************/
function insertRepliedMessages(messages, index){
	
	var msgin		= (messages[index]);
	for(var i = 0; i < messages.length; i++){
		if( i == index) { continue; }
		var msgi 	= messages[i];
		var msg 	= createMessage(msgi);
		
		if(msgin.user + msgin.date == msgi.repliedTo){
			var date = msgin.date;
			var msgNode = document.getElementById('messageElement' + date);
			msgNode.parentNode.insertBefore(msg, msgNode.nextSibling);
			messages[i].visited = 1;
			
		}
	}
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
*	this function takes a message in JSON format and create an option 'sender'
*********************************************************************************/
function createSender(message){

	var result 	  = document.createElement("option");
	result.value  = message.sender;
	result.innerHTML = message.sender;
	return result;
}



/*********************************************************************************
*	this function takes a message in JSON format and create a message element, 
*	with the message details including offset, content, etc. as follows:
*	user 	  : user;
*	sender	  : sender;
*	date 	  : date;
*	clicked   : clicked;
*	msg_text  : message;
*	offset    : offset;
*	images    : image;
*********************************************************************************/
function createMessage(message){
	
	var user 	  = message.user;
	var sender	  = message.sender;
	var date 	  = Number(message.date);
	var clicked   = message.clicked;
	var msg_text  = message.message;
	var offset    = message.offset;
	var images    = message.image;
	
	
	var frame 	  = document.createElement("div");
	var imgsFrame = document.createElement("div");
	var userTag   = document.createElement("a");
	var replyUser = document.createElement("a");
	var p 		  = document.createElement("p");
	var spanStart = document.createElement("span");
	var spanDate  = document.createElement("span");
	var reply 	  = document.createElement("span");
	var clkd      = document.createElement("a");
	var rawDate	  = document.createElement("pre");
	var del	  = document.createElement("a");
	//alert('create new message element ' + images);
	
	del.setAttribute('id', 'delete' + date);
	del.setAttribute('href', '#delete' + date);
	del.setAttribute('style', 'color:red; padding-right:' + offset + 'px;');
	del.setAttribute('onclick', 'deleteMessage(' + date + ')');
	del.innerHTML = ' delete';
	
	clkd.setAttribute('id', 'clicked' + date);
	clkd.setAttribute('style', 'visibility:hidden;');
	clkd.innerHTML = clicked;
	
	spanStart.innerHTML = ": " + msg_text + " on ";
	spanDate.innerHTML =  new Date(date).toUTCString().split(' ').slice(0, 5);
	spanDate.setAttribute("id", 'date' + date );
	
	userTag.setAttribute('id', 'user' + date);
	userTag.setAttribute('href', '#user' + date);
	userTag.innerHTML = sender;
	
	replyUser.setAttribute('id', 'user-reply' + date);
	replyUser.setAttribute('href', '#reply' + date);
	replyUser.setAttribute('onclick', 'replyClicked(' + date + ')' );
	replyUser.setAttribute('style', 'color:green;');
	replyUser.innerHTML = " reply";
	
	rawDate.setAttribute('id', 'raw-date' + date);
	rawDate.setAttribute('style', 'display: none;');
	rawDate.innerHTML = date;
	
	p.appendChild(userTag);
	p.appendChild(spanStart);
	p.appendChild(spanDate);
	p.appendChild(rawDate);
	
	if(user == "admin" ){
		reply.appendChild(replyUser);
		p.appendChild(reply);
		p.appendChild(del);
	}
	
	images		= 'd' + images;
	var jimg	= images.split(	'data:image/png;base64,' );
	for(var i = 0; i < jimg.length; i++){
		if( jimg[i] === "" || jimg[i] === "d") { continue; }
		
		var img 	= document.createElement("img");
		img.src 	= 'data:image/png;base64,' + jimg[i];
		img.setAttribute('class', 'image');
		imgsFrame.appendChild(img);	
	}

	frame.setAttribute('style', 'margin-left:' + offset + 'px;');
	frame.setAttribute('class', 'message');
	frame.setAttribute('id', 'messageElement' + date);
	frame.setAttribute("onclick", 'messageClicked(' + date + ')' );
	frame.appendChild(p);
	frame.appendChild(clkd);
	frame.appendChild(imgsFrame);
	if(clicked == 'true'){
		frame.setAttribute('style', 'background: rgba(0.0, 0.0, 0.0, 0.0); margin-left:' + offset + 'px;');
	}
	
	return frame;	
}


/*********************************************************************************
*	this function deletes a given message
*********************************************************************************/
function deleteMessage(id){
	alert('delete message:' + id);
	var msg = document.getElementById('messageElement' + id);
	msg.remove();
}


/*********************************************************************************
*	this function handles message element being clicked, notify server that message
*	was clicked
*********************************************************************************/
function messageClicked(p){

	var click 		= document.getElementById('clicked' + p);
	var user 		= sessionStorage.getItem('username');
	

	var formData 	= new FormData();
	
	if(click.innerHTML == 'false'){
		formData.append("code", "3");
		formData.append("user", user.slice(0,20)); 
		formData.append("sender", user.slice(0,20));
		formData.append("message", "");
		formData.append("date", p); 
		
	    $.ajax({
		    url: 'UserServlet', 	// point to server-side 
		    dataType: 'text',  		// what to expect back from the server, if anything
		    cache: false,
		    contentType: false,
		    processData: false,
		    data: formData,                         
		    type: 'post',
		    success: function(response){
		    			
       					var msg = document.getElementById('messageElement' + p);
       					var compStyles = window.getComputedStyle(msg);
       					var offset = compStyles.getPropertyValue('margin-left');
						msg.setAttribute('style', 'background-color: #ffffff; margin-left:' + offset);
						click.innerHTML = 'true';
						//alert('success');
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
	var date = document.getElementById('date' + count).innerHTML;
	var user = sessionStorage.getItem('username');
	var dateMiliseconds	=	Date.parse(date);
	//alert(dateMiliseconds);
	
	
	var existingNode = document.getElementById("messageElement" + count);	
	var reply = document.createElement("div");
	var replyText = document.createElement("textarea");
	var form = document.createElement("form");
	var span1 = document.createElement("span");
	var span2 = document.createElement("span");
	var p = document.createElement("p");	
	var btnUpload = document.createElement("button");
	var btnCancel = document.createElement("button");
	
	replyText.setAttribute("id", "reply-msg-txt" + count);
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
	btnUpload.setAttribute("onclick", 'replyMessage(' + count + ')');
	
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
	notifyMessageClicked(user, dateMiliseconds);
}



/*********************************************************************************
*	this function send a message in JSON format to the server to be inserted into
*	the DB: format is: { user: 'user', sender: 'sender', text: 'text', date: 'date',
*						 offset:'offset',  }
*********************************************************************************/
function sendUserReply(jmessage){
	
	//var message 	= JSON.parse(jmessage);
	var message 	= jmessage;
	var formData 	= new FormData();
	var user 		= message.user;
	var sender 		= message.sender;
	var msg			= message.text;
	var date		= new Date().getTime();
	var offset		= message.offset;
	var repliedTo	= message.repliedTo;
	
	//alert('user: ' + user);
	
	formData.append("code", "1");
	formData.append("user", user); 	
	formData.append("sender", sender);
	formData.append("message", msg);	
	formData.append("date", date);
	formData.append("offset", offset); 
	formData.append("repliedTo", repliedTo);  
	//alert(message);
	
    $.ajax({
    url: 'UserServlet', 	// point to server-side 
    dataType: 'text',  		// what to expect back from the server, if anything
    cache: false,
    contentType: false,
    processData: false,
    data: formData,                         
    type: 'post',
    success: function(response){
    			/*
				var msg = document.getElementById('messageElement' + p);
				var compStyles = window.getComputedStyle(msg);
				var offset = compStyles.getPropertyValue('margin-left');
				msg.setAttribute('style', 'background-color: #ffffff; margin-left:' + offset);
				click.innerHTML = 'true';
				*/
				//alert('success');
			}
	});
	
}



/*********************************************************************************
*	this function gather 'pop up' text area text, user ,sender etc. and send
*********************************************************************************/
function replyMessage(p){

	var	msgElement	= document.getElementById('messageElement' + p);
	var offsetVal	= window.getComputedStyle(msgElement, null).getPropertyValue("margin-left");
	var senderName	= sessionStorage.getItem("username");			// who is sending
	var userName 	= document.getElementById('user' + p);			// to whom
	var dateMilis	= new Date().getTime();							// date in miliseconds
	var msgText 	= document.getElementById('reply-msg-txt' + p);	// message 
	var offs		= parseInt(offsetVal) + 20;						// offset
	var rawDate		= document.getElementById('raw-date' + p);		// raw date
	var jsonMessage = {	user: 		userName.innerHTML, 
						sender: 	senderName,
						date: 		dateMilis,
						clicked: 	false,
						message: 	msgText.value,
						offset: 	offs,
						repliedTo:  userName.innerHTML + rawDate.innerHTML};										
	var replyElement = createMessage(jsonMessage);

	sendUserReply(jsonMessage);	
	cancel(p);
	msgElement.parentNode.insertBefore(replyElement, msgElement.nextSibling);
	
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
	       			//alert("message clicked"); 
    			}
	});

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
	
	let arr 		  = [];
	var ckbx 		  = document.getElementById("output").getElementsByTagName("input");
	var images 		  = document.getElementById("output").getElementsByTagName("img");
	
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	sendMessage(arr);
}


/*********************************************************************************
*	this function creates a JSON object of 'Message' type,  iterate over all images, 
*	checked if chosen and sent to server
*********************************************************************************/
function uploadMessage(number){
	let arr 		 = [];
	var ckbx 		 = document.getElementById("output").getElementsByTagName("input");
	var images 		 = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	//sendImages(arr);
	sendMessage(arr);
}


/*********************************************************************************
*	this function simply shows the hidden elements to allow images upload
*********************************************************************************/
function showFileLoad(){
	document.getElementById("file-upload-area").style.display = "block";
	document.getElementById("upload-file-btn").style.display = "block";
	document.getElementById("cancel-file-btn").style.display = "block";
	document.getElementById("msg-text-upload").style.display = "none";
} 


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload
*********************************************************************************/
function showMsgText(){
	loadUsers();
	document.getElementById("msg-text-upload").style.display = "block";
	document.getElementById("upload-file-btn").style.display = "block";
	document.getElementById("cancel-file-btn").style.display = "block";
	document.getElementById("file-upload-area").style.display = "block";
} 


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload
*********************************************************************************/
function cancelMsgText(){
	document.getElementById("msg-text-upload").style.display = "none";
	document.getElementById("upload-file-btn").style.display = "none";
	document.getElementById("cancel-file-btn").style.display = "none";
	document.getElementById("file-upload-area").style.display = "none";
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
	//alert('drop');
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
	newCheckbox.setAttribute("checked", true);
	
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
		form_data.append('offset', '0');  
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
function sendMessage(images){

	var msg 	  	= document.getElementById("msg-txt").value;
	var usrs 	  	= document.getElementById("users");
	var usr  	  	= usrs.options[usrs.selectedIndex].text;
	var sender	  	= sessionStorage.getItem('username');
	var date	  	= new Date();
	var clicked   	= 'false';
	var formData  	= new FormData();
	var blob		= '';
	var imgs 		= [];
	
	formData.append("code", "2");
	formData.append("sender", sender.slice(0,20)); 
	formData.append("user", usr.slice(0,20));
	formData.append("message", msg);
	formData.append("date", date.getTime());
	formData.append("clicked", clicked);
	formData.append("offset", 0);
	
	
	if( images.length > 0){
		
		for(var i = 0; i < images.length; i++){
			imgs[i] = images[i].src;
		}		
		blob = new Blob(imgs, {type: 'image/png' });
		//formData.append("image", blob);
		
	}
	else{
		
		blob = new Blob(imgs, {type: 'image/png' });
		alert(blob);
	}
	
	
	var message = createSocketMessage("2", sender, usr, msg, date.getTime(), clicked, blob, 0, "");	
	wsocket.send(JSON.stringify(message));
	alert("file uploaded successfully!" + response); 
	cancelMsgText();
	
	/*
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
	       			cancelMsgText();
    			}
 	});
 	*/
}


function testMessages(){
	
	var user = sessionStorage.getItem('username');
	var message = createSocketMessage("1", user, "", "", new Date().getTime(), "", "", 0, "");	
	wsocket.send(JSON.stringify(message));
	alert(message);
}
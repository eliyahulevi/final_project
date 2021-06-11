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
	loadUserMessages(false);

	// load users to 'send-message' modal
	$("#send-Message-Modal").on('show.bs.modal', function(){
		loadUsers(false);
	});
	
	wsocket 			= new WebSocket("ws://localhost:8080/final-project/messages2");
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
	var message = createSocketMessageByteArray("0", sessionStorage.getItem('username'), "", "", date, false, "", 0, "");	
	wsocket.send((message));
}


/*********************************************************************************
*	this function handles the event when a message comes in from the server 
*	endpoint. 
*	@parameter event: 	holds the message data
*	return:				null
*********************************************************************************/
function onMessage(event) {	
	
    var message = JSON.parse(event.data);
    //alert('on message..' + message.action);
    
    if (message.action === "add") {

    }
    if (message.action === "remove") {

    }
    if (message.action === "message") {
		
		var messageSrc 	= message.src;	
		var parsedMsgs 	= [];	
		insertMessage(JSON.parse(messageSrc))
    }
    if (message.action === "messages") {
    	
    	var form 		= document.getElementById("msg-display");
		var parsedMsgs 	= [];	
		var messages 	= message.src;			
		var numOfMessages = messages.length;
	
		document.getElementById('numberOfMessages').innerHTML = numOfMessages;
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
				//alert(window.getComputedStyle(msg, null).getPropertyValue("margin-left"));
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
	alert('closing socket: ' + event.code);
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
               			
        		    var form 		= document.getElementById("msg-display");
        			var parsedMsgs 	= [];
        			var messages 	= JSON.parse(response);  
        			var length		= messages.length;
        			var max			= 0;
        			var step		= 20;
        			var currentOff	= 0;
        			
        			// 1.	find maximum offset and append all messages
        			//		with offset 0, also, find maximum offset value
        			for(var i = 0; i < length; i++){
        				var message	= JSON.parse(messages[i]);
        				if( message.offset > max ){
        					
        					max = message.offset;
        				}
        				if( message.offset == 0 ){
        					var msg = createMessage(message);
		            		form.appendChild(msg);
        				}
        			}
        			//2.	insert all other messages with offset > 0
        			//		according to message 'repliedTo' field
        			while( max > 0 ){
        				currentOff = currentOff + step;
        				for(var i = 0; i < length; i++){
        					var message	= JSON.parse(messages[i]);
	        				if( message.offset == currentOff ){
	        					var msg = createMessage(message);
			            		insertMessage(message);
			            		//form.appendChild(msg);
	        				}
	        			}
	        			max = max - step;
        			}
        			 
        			/*
        			for(var i = 0; i < messages.length; i++){
        				var parsedMsg = JSON.parse(messages[i]);
        				parsedMsg.visited = 0;
        				parsedMsgs[i] = parsedMsg;
        			}   		
        			
		            for(var i = 0; i < parsedMsgs.length; i++){
	            		var msg = createMessage(parsedMsgs[i]);
		            	if(parsedMsgs[i].visited == 0){
		            		var msg = createMessage(parsedMsgs[i]);
		            		//form.appendChild(msg);
		            	}
		            	else{
		            		//insertRepliedMessages(parsedMsgs, i);
		            	}       	
		            	insertRepliedMessages(parsedMsgs, i);
		            }
		            */
        		}
     });
}


/*********************************************************************************
*	this function inserts a new message element into messages displayed area
*	@param: messages,		an array of already parsed messages in JSON format
*	@param: index,			the index of the message in the array 
*********************************************************************************/
function insertMessage(message){
	
	var msgDisplay	= document.getElementById('msg-display');
	var msgElement 	= createMessage(message);
	var messages	= document.getElementsByClassName('message');
	var userReply	= null;
	

	
	if(message.offset === '0' ){
		msgDisplay.appendChild(msgElement);	
		alert(	'insert message with offset 0:' +
		'\nmessage: ' 	+ message.message + 
		'\nreply to: ' 	+ message.repliedTo + 
		'\nuser: ' 		+ message.user +
		'\nsender: ' 	+ message.sender +
		'\noffset: ' 	+ message.offset +
		'\nimages: ' 	+ message.image);
	}
	else{
	
		alert(	'insert message with offset bigger than 0:' +
		'\nmessage: ' 	+ message.message + 
		'\nreply to: ' 	+ message.repliedTo + 
		'\nuser: ' 		+ message.user +
		'\nsender: ' 	+ message.sender +
		'\noffset: ' 	+ message.offset +
		'\nimages: ' 	+ message.image);
			
		for(var i = 0; i < messages.length; i++){
			var msgi 		= messages[i];
			var childNodes	= msgi.childNodes;	
			
			for (var j = 0; j < childNodes.length; j++) {	
			    if (childNodes[j].class === 'user-date' ){ 
			    	//alert('node name: ' + childNodes[j].name);
			    	userReply = childNodes[j].name;
			    	break;
			    }        
			}			
			if(userReply === message.repliedTo){
				var msg 	= createMessage(message);
				messages[i].parentNode.insertBefore(msg, msgi.nextSibling);
				message.visited = 1;
				return;
			}
		}
	}
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
*	this function takes a message in JSON format and create a message element to be
*	displayed on the 'form' element 'msg-display'. The message details include 
*	offset, content, etc. as follows:
*	user 	  : user;
*	sender	  : sender;
*	date 	  : date;
*	clicked   : clicked;
*	msg text  : message;
*	offset    : offset;
*	images    : image;
*	images source extraction in 3 steps:
*		1. remove '"[' from the beginning and '"]"' from the end
*		2. split on 'data:image/png;base64,'
*		3. for each source string remove the '","' tail end 
*********************************************************************************/
function createMessage(message){

	var user 	  	= message.user;
	var sender	  	= message.sender;
	var date 	  	= Number(message.date);
	var clicked   	= message.clicked;
	var msg_text  	= message.message;
	var offset    	= message.offset;
	var images    	= message.image;
	var imagesSrc	= "";
	var src			= null;	
	var splitImg	= null;
	
	
	var frame 	  	= document.createElement("div");
	var imgsFrame 	= document.createElement("div");
	var userTag   	= document.createElement("a");
	var replyUser 	= document.createElement("a");
	var p 		  	= document.createElement("p");
	var spanStart 	= document.createElement("span");
	var spanDate  	= document.createElement("span");
	var reply 	  	= document.createElement("span");
	var clkd      	= document.createElement("a");
	var rawDate	  	= document.createElement("pre");
	var del	  		= document.createElement("a");
	
	
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
	
	userTag.setAttribute('id', 'user-tag' + date);
	userTag.setAttribute('class', 'user-tag');
	userTag.setAttribute('href', '#user' + date);
	userTag.innerHTML = sender;
	
	replyUser.setAttribute('id', 'user-reply' + date);
	replyUser.setAttribute('href', '#messageElement' + date);
	replyUser.setAttribute('onclick', 'replyClicked(' + date + ')' );
	replyUser.setAttribute('style', 'color:green;');
	replyUser.innerHTML = " reply";
	
	
	rawDate.setAttribute('id', 'raw-date' + date);
	rawDate.setAttribute('style', 'display: none;');
	rawDate.class = 'user-date';
	rawDate.name = user + date;
	rawDate.innerHTML = date;
	
	p.appendChild(userTag);
	p.appendChild(spanStart);
	p.appendChild(spanDate);
	//p.appendChild(rawDate);
	
	reply.appendChild(replyUser);
	p.appendChild(reply);
	p.appendChild(del);
		
	/*
	if(sender == "admin" ){
		reply.appendChild(replyUser);
		p.appendChild(reply);
		p.appendChild(del);
	}
	*/
	if( images != '{}' )
	{	
		imagesSrc	= images.slice(2, images.length - 4);	
		splitImg	= imagesSrc.split( 'data:image/png;base64,' );

		for(var i = 1; i < splitImg.length; i++){	
			if( splitImg[i] === "") { continue; }		
			if( i < splitImg.length ){
				//alert('message number: ' + i + '\nof length: ' + splitImg[i].length + '\nstarts with: ' + splitImg[i][0] + ' \nends with: ' + splitImg[i][splitImg[i].length - 1] + '\nis: ' + splitImg[i]);
				src	= splitImg[i].replace('","', '');
			}
			var img 	= document.createElement("img");
			img.src 	= 'data:image/png;base64,' + src;
			img.setAttribute('class', 'image');
			imgsFrame.appendChild(img);
		}
	}

	//alert('message offset: ' + message.offset);
	if(clicked == 'true'){
		frame.setAttribute('style', 'border-radius: 5px; border: 1px solid #000000; background: rgba(0, 0, 0, 0.0);   margin-left:' + offset + 'px; margin-right: ' + offset + ' px;');
	}
	else{
		frame.setAttribute('style', 'border-radius: 5px; border: 1px solid #000000; background: rgba(0, 255, 0, 0.9); margin-left:' + offset + 'px; margin-right: ' + offset + ' px;');
	}
	frame.setAttribute('class', 'message');
	frame.setAttribute('id', 'messageElement' + date);
	frame.setAttribute("onclick", 'messageClicked(' + date + ')' );
	frame.appendChild(p);
	frame.appendChild(clkd);
	frame.appendChild(imgsFrame);
	frame.appendChild(rawDate);
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
						msg.setAttribute('style', 'border-radius: 5px; border: 1px solid #000000; background-color: #ffffff; margin-left:' + offset);
						click.innerHTML = 'true';
						//alert('success');
	    			}
	 	});
 	}
}


/*********************************************************************************
*	this function is fired up when the reply hyper link to specific message is 
*	clicked. reply area is being added to page under the chosen message and 
*	'message clicked' is sent.
*	@param:		p,	unique identifier (date of creation)
*	return:		null
*********************************************************************************/
function replyClicked(p){

	var imgReplies	= document.getElementsByClassName('upload-image');
	var txtReplies	= document.getElementsByClassName('msg-area');
	
	// erase all other reply messages text AND images upload from page 
	for(var i = txtReplies.length - 1; i >= 0; --i){ txtReplies[i].remove(); } 
	for(var i = 0; i < imgReplies.length; i++){ imgReplies[i].remove(); }
	
	var count 		= p;
	var date 		= document.getElementById('date' + count).innerHTML;
	var user 		= sessionStorage.getItem('username');
	var time		= Date.parse(date);	
	var users		= loadUsers(false);
	var userTag		= document.getElementById('user-tag' + p).innerHTML;
	var msgReply	= createMsgTextArea(p, users, userTag);
	var imgReply	= createImageUploadArea(p);
	var currnetNode	= document.getElementById('messageElement' + count);	

	//alert('date: ' + p + '\nusers: ' + users + '\ncurrent node element: ' + currnetNode);
	
	currnetNode.parentNode.insertBefore(msgReply, currnetNode.nextSibling);
	currnetNode.parentNode.insertBefore(imgReply, currnetNode.nextSibling);
	end = replyText.selectionEnd;
	replyText.focus();
	replyText.selectionEnd + 1;
	notifyMessageClicked(user, time);
}


/*********************************************************************************
*	this function create the file upload area as an html element and return it.
*	@param:		p, unique identifier
*	return:		null
*********************************************************************************/
function createImageUploadArea(p){
	//alert('date: ' + p);
	var div			= document.createElement('div');
	div.setAttribute('id', 'upload-image' + p);
	div.setAttribute('class', 'upload-image');
	div.innerHTML 	=  "<label for='file-input' >" +
							"<img class='file-image' src='https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg'/>" +
						"</label>" +
						"<input id='file-input' type='file' style='display:none;' ondrop='drop()' onchange='onChange(" + p + ",this)'/>";
	return div;
}



/*********************************************************************************
*	this function create the message text area as an html element and return it.
*	@param:		p, 		unique identifier
*	@param:		user, 	a specific user name to be replied to. if @user is empty,
*						the first option of users is displayed
*	@param:		users, 	an array of users names
*	return:		div, 	the element created which holds the functionality
*********************************************************************************/
function createMsgTextArea(msgNumber, users, user){
	
	var div			= document.createElement('div');
	var p			= document.createElement('p');
	var pp			= document.createElement('p');
	var a			= document.createElement('a');
	var select		= document.createElement('select');
	var textArea	= document.createElement('textarea');
	var form		= document.createElement('form');
	var span1		= document.createElement('span');
	var span2		= document.createElement('span');
	var btnUpload	= document.createElement('button');
	var btnCancel	= document.createElement('button');
	
	div.setAttribute('id', 'msg-text-upload' + msgNumber);
	div.setAttribute('class', 'msg-area');
	
	p.setAttribute('style', 'display: inline;');
	p.innerHTML		= 'send a message to ';
	
	a.setAttribute('id', 'user' + msgNumber);
	a.setAttribute('style', 'display: inline;');
	a.setAttribute('href', 'msg-text-upload' + msgNumber);
	a.setAttribute('onclick', '');
	a.innerHTML = user;
	
	select.setAttribute('name', 'users');
	select.setAttribute('id', 'users' + msgNumber);
	select.setAttribute('style', 'display: inline;');
	
	for(var i = 0; i < users.length; i++){
		var option = document.createElement("option");
		option.value = users[i];
		option.text = users[i];
		select.appendChild(option);
	}
	
	textArea.setAttribute('id', 'msg-text' + msgNumber);
	textArea.setAttribute('name', 'msg-text');
	textArea.setAttribute('onkeypress', 'onTextChange()');
	textArea.setAttribute('placeholder', 'enter text here...');
	
	form.setAttribute('id', 'output' + msgNumber);
	form.setAttribute('action', 'upload');
	form.setAttribute('method', 'post');
	form.setAttribute('enctype', 'multipart/form-data');
	
	span1.setAttribute('style', 'display:inline-block;');
	span2.setAttribute('style', 'float:right; padding-right:0px;');
	
	btnUpload.setAttribute('id', 'upload-file-btn' + msgNumber);
	btnUpload.setAttribute('type', 'button');
	btnUpload.setAttribute('class', 'btn btn-success');
	btnUpload.setAttribute('onclick', 'upload(' + msgNumber+ ')');
	btnUpload.innerHTML = 'upload';
	
	btnCancel.setAttribute('id', 'cancel-file-btn' + msgNumber);
	btnCancel.setAttribute('type', 'button');
	btnCancel.setAttribute('class', 'btn btn-danger');
	btnCancel.setAttribute('onclick', 'cancelMsgText()');
	btnCancel.innerHTML = 'cancel';
	
	span1.appendChild(btnUpload);
	span2.appendChild(btnCancel);
	pp.appendChild(span1);
	pp.appendChild(span2);
	form.appendChild(pp);
	
	div.appendChild(p);
	if( user === ""){
		div.appendChild(select);
	}
	else{
		div.appendChild(a);
	}
	div.appendChild(textArea);
	div.appendChild(form); 
		
	alert('create message area with number: ' + msgNumber);			
	return div;
	
}



/*********************************************************************************
*	this function send a message in JSON format to the server to be inserted into
*	the DB: format is: { user: 'user', sender: 'sender', text: 'text', date: 'date',
*						 offset:'offset',  }
*********************************************************************************/
function sendReplyMessage(jmessage){
	
	//var message 	= JSON.parse(jmessage);
	var message 	= jmessage;

	var user 		= message.user;
	var sender 		= message.sender;
	var msg			= message.text;
	var date		= new Date().getTime();
	var offset		= message.offset;
	var repliedTo	= message.repliedTo;
	
	var message 	= createSocketMessage("2", sender, usr, msg, date.getTime(), clicked, imgs, 0, "");	
	var msgByteArr	= [...message];
	var msgBuffer	= new ArrayBuffer(message.length);
	var messageArray= new Uint8Array(msgBuffer);
	
	for(var i = 0; i < msgByteArr.length; i++){
		messageArray[i] = message.charCodeAt(i);
	}
}



/*********************************************************************************
*	this function gather 'pop up' text area text, user ,sender etc. and send the
*	message through websocket via binary option
*	@param:		p, the message unique identifier (its date) 
*********************************************************************************/
function replyMessage(p){
	
	var	step		= 20;
	var	msgElement	= document.getElementById('messageElement' + p);
	var offsetVal	= window.getComputedStyle(msgElement, null).getPropertyValue("margin-left");
	var sender		= sessionStorage.getItem("username");			// who is sending
	var user	 	= document.getElementById('user' + p);			// to whom
	var date		= new Date().getTime();							// date in miliseconds
	var msg		 	= document.getElementById('reply-msg-txt' + p);	// message 
	var offs		= parseInt(offsetVal) + step;					// offset
	var rawDate		= document.getElementById('raw-date' + p);		// raw date
	var imgsElement	= document.getElementById('image-upload' + p);	// images element
	
										
	var message 	= createSocketMessage("2", sender, user.innerHTML, msg.value, date, false, imgs, offs, user.innerHTML + rawDate.innerHTML);	
	var msgByteArr	= [...message];
	var msgBuffer	= new ArrayBuffer(message.length);
	var msgArray= new Uint8Array(msgBuffer);
	//alert('reply message length: ' );
	for(var i = 0; i < msgByteArr.length; i++){
		msgArray[i] = message.charCodeAt(i);
	}
	cancel(p);
	//alert('reply message length: ' + msgArray.length);
	wsocket.send(msgArray);
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
*	this function is fires up when a reply to a message was pressed, iterate over 
*	all images, checked if chosen and sent to the sendMessage function
*	@param:		p, unique identifier
*	return:		null
*********************************************************************************/
function upload(p){

	var imgReplyEle		= document.getElementById('upload-image' + p);
	let imgs 		  	= [];
	var ckbx 		  	= document.getElementById('upload-image' + p).getElementsByTagName("input");
	var images 		  	= document.getElementById('upload-image' + p).getElementsByTagName("img");

	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			imgs.push(images[i].src);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	//alert('images: ' + imgs);
	sendMessage(imgs, p);
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
*	this function gathers all selected images for a specific message
*********************************************************************************/
function getSelectedImages(number){
	let arr 		 = [];
	var ckbx 		 = document.getElementById("output").getElementsByTagName("input");
	var images 		 = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  			//alert("array at:" + i + " = " + images[i].name);
  		}
	}
	return arr;
}


/*********************************************************************************
*	this function simply shows the hidden elements to allow images upload
*********************************************************************************/
function showFileLoad(){
	alert('obsolete');
	/*
	var messages	= document.getElementsByClassName('message');
	var uploadImg	= document.getElementsByClassName('upload-image');
	var upldLength	= uploadImg.length;
	var msgLength	= messages.length;
	var	newMessage	= document.getElementById("new-msg");
	var fileUpload	= createImageUploadArea(msgLength + 1);
	
	alert(uploadImg.length);
	for(var i = 0; i < upldLength; i++){
		uploadImg.remove();
	}
	newMessage.appendChild(fileUpload);
	
	document.getElementById("file-upload-area").style.display = "block";
	document.getElementById("upload-file-btn").style.display = "block";
	document.getElementById("cancel-file-btn").style.display = "block";
	document.getElementById("msg-text-upload").style.display = "none";
	*/
} 


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload
*	@param:		null
*	return:		null
*********************************************************************************/
function showOutgoingMsgArea(){
	var users		= loadUsers(false);
	var messages	= document.getElementsByClassName('message');
	var uploadImg	= document.getElementsByClassName('upload-image');
	var upldLength	= uploadImg.length;
	var msgLength	= messages.length;
	var	newMessage	= document.getElementById("new-msg");
	var msgArea		= document.getElementById("new-area");
	var fileUpload	= null;
	//alert('users: ' + users);
	for(var i = 0; i < upldLength; i++){
		//alert('i ' + i + ' ' + uploadImg[i]);
		uploadImg[i].remove();
	}
	
	newMessage.appendChild(createImageUploadArea(msgLength));
	newMessage.appendChild(createMsgTextArea(msgLength, users, ''));
} 


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload
*********************************************************************************/
function cancelMsgText(){
	var imgReplies	= document.getElementsByClassName('upload-image');
	var txtReplies	= document.getElementsByClassName('msg-area');
	
	// erase all other reply messages text AND images upload from page 
	for(var i = txtReplies.length - 1; i >= 0; --i){ txtReplies[i].remove(); } 
	for(var i = 0; i < imgReplies.length; i++){ imgReplies[i].remove(); }
} 


/*********************************************************************************
*	this function does the same as the following but for 'browsing option'
*********************************************************************************/
function onChange(p, input){
	//alert(p);
	var url 	= $(input).val();
	var file 	= input.files[0];
	var name 	= file.name;
	var parent 	= document.getElementById('upload-image' + p);	
	var src		= null;
	
	var reader = new FileReader();
    reader.onload = function (event) {
    					var newImg	=	createCheckedImage(event.target.result, name);
				    	parent.appendChild(newImg);
 						//alert('new image: ' + newImg);
						//alert('file selected: ' + event.target.result);			    	
				    };
	
    reader.readAsDataURL(file);
    //alert('file src: ' + src);	
}


/*********************************************************************************
*	this function handles the drop event of the files upload element,
*	simply places the chosen images in the output element
*
*********************************************************************************/
function drop(event){
	alert('drop');
    event.stopPropagation();
    event.preventDefault();
    
    //var date	= event.target;
    var parent 	= document.getElementById("output");
    var files 	= event.dataTransfer.files;
    var file 	= files[0];
	var reader 	= new FileReader();
  	
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
*	to choose from while sending a new message, and return the users as string
*	array.
*	@param:		null
*	return:		result, a string array of users names
*********************************************************************************/
function loadUsers(sync){

	const obj	   	= {data: ''};
	var selectList 	= document.getElementById("users");
	var blob	   	= new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
	var formData   	= new FormData();
	var date	   	= new Date();
	var result		= [];
	
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
        async: sync,
        success: function(data){
        			
		            var count;		
					//var data = xhr.responseText;
					var array = JSON.parse(data);
					
					if ( (count = array.length) > 0) 
					{
						for (var i = 0; i < count; i++) {
							result[i] = array[i];
						}
					}	
					else alert("no users found!");
        		}
     });
     return result;
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
function sendMessage(images, msgNumber){
	//alert('images received: ' + images);
	var	msgElement	= document.getElementById('messageElement' + msgNumber);
	var msg 	  	= document.getElementById("msg-text" + msgNumber).value;	
	var usrs 	  	= document.getElementById('users' + msgNumber);
	var usrElement 	= document.getElementById('user-tag' + msgNumber); 	
	var usr			= "";
	var sender	  	= sessionStorage.getItem('username');
	var date	  	= new Date();
	var clicked   	= 'false';
	var imgs 		= [];
	var data		= null; 
	var size 		= 0;
	var imageBuffer = null;
	var msgBuffer 	= null;
	var numOfImages	= images.length;
	var offset		= 0;
	var offsetCalc	= null; 
	var offsetStep	= 20;
	var replyTo		= "";	
	
	/*
	if(offsetCalc !== null ){
		offset = parseInt(offsetCalc) + offsetStep;
	}
	*/
	
	
	if( usrElement === null ){
		usr = usrs.options[usrs.selectedIndex].text;
	}
	else{
		usr = usrElement.innerHTML;
		replyTo = usr + msgNumber; 	
	}
	
	if(msgElement !== null ){
		offsetCalc = window.getComputedStyle(msgElement, null).getPropertyValue("margin-left");
		offset = parseInt(offsetCalc) + offsetStep;
		
	}
	
	
	
	/*
	if( images.length > 0){
		for(var i = 0; i < numOfImages; i++){
			size += images[i].src.length;
		}
		
		imageBuffer = new ArrayBuffer(size + 2 + (numOfImages - 1));
		data	   	= new Uint8Array(imageBuffer);
		var step 	= 0;
		
		for(var i = 0; i < numOfImages; i++){
			imgs[i] = images[i].src;
			for( j = 0; j < imgs[i].length; j++, step++ ){
				data[step] = (imgs[i].charCodeAt(j));
			}
		}		
	}
	else{
		alert('no images chosen..');
	}
	
	alert(	'message element: ' + msgElement + 
			'\nmsg: ' + msg + 
			'\nusers: ' + users + 
			'\nuser: ' + usr +
			'\nsender: ' + sender+
			'\nreply to: ' + replyTo);
	*/
	var message 		= createSocketMessage("2", sender, usr, msg, date.getTime(), clicked, images, offset, replyTo);	
	var msgByteArr		= [...message];
	var msgBuffer		= new ArrayBuffer(message.length);
	var messageArray	= new Uint8Array(msgBuffer);
	
	for(var i = 0; i < msgByteArr.length; i++){
		messageArray[i] = message.charCodeAt(i);
	}
	
	cancelMsgText();
	wsocket.send(messageArray);
}


function testMessages(){
	var test		= document.getElementById('test-images');
	var div			= document.createElement("div");
	
	//div.setAttribute('class', 'image-upload');
	div.innerHTML 	=  "<label for='file-input' style='cursor: pointer;'> \
							<img src='https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg'/> \
						</label> \
						<input id='file-input' type='file' style='display:none';/>";
	
	test.appendChild(createImageUploadArea(0));

}
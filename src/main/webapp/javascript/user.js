
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
 *		"offset", 	<message offset>,
 *		"display",	<name of user NOT to display to>
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
	
	// Add smooth scrolling to all links in navbar + footer link
  	$(".navbar a, a[href='#userPage']").on('click', function(event) {
    	// Make sure this.hash has a value before overriding default behavior
    	if (this.hash !== "") {
	      	// Prevent default anchor click behavior
	      	event.preventDefault();
	
	      	// Store hash
	      	var hash = this.hash;
	
	      	// Using jQuery's animate() method to add smooth page scroll
	      	// The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
	      	$('html, body').stop().animate({
	        	scrollTop: $(hash).offset().top + 10
	      	}, 900, function(){
	   
	        	// Add hash (#) to URL when done scrolling (default click behavior)
	        	window.location.hash = hash;
	      	});
    	} // End if
  	});
  
	$(window).scroll(function() {
		$(".slideanim").each(function(){
	    	var pos = $(this).offset().top;
			var winTop = $(window).scrollTop();
	        if (pos < winTop + 600) {
	        	$(this).addClass("slide");
	        }
	    });
	});
	
	if( sessionStorage.getItem('username') == 'admin' ){
		displayAdmin();
	}
	loadProducts(false);
	loadUserOrders(false);
	loadUserDetails();
	loadUserMessages(false);

	// load users to 'send-message' modal
	$("#send-message-modal").on('show.bs.modal', function(){
			loadMessageModal();
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
*	@parameter 		event: 	holds the socket data(?)
*	@return:		null
*********************************************************************************/
function loadMessageModal(){
	var usersArray		= loadUsers(false);
	var fileUploadArea	= document.getElementById('file-upload-area');
	var length			= usersArray.length;		
	var uploadImage		= fileUploadArea.getElementsByClassName('upload-image');
	var uploadTxt		= fileUploadArea.getElementsByClassName('msg-area');
	
	if(uploadImage.length > 0)
		uploadImage[0].remove();
		
	if(uploadTxt.length > 0)
		uploadTxt[0].remove();
	
	fileUploadArea.appendChild(createImageUploadArea(length));
	fileUploadArea.appendChild(createMsgTextArea(length, usersArray, ''));
}


/*********************************************************************************
*	this function handles the event a web socket is being started at the client
*	side. 
*	@parameter 		event: 	holds the socket data(?)
*	@return:		null
*********************************************************************************/
function onOpen(event) {
	var date = new Date().getTime();
	var message = createSocketMessageByteArray("0", sessionStorage.getItem('username'), "", "", date, false, "", 0, "", "");	
	wsocket.send((message));
}


/*********************************************************************************
*	this function handles the event when a message comes in from the server 
*	endpoint. 
*	@parameter 		event: 	holds the message data
*	@return:		null
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
		//insertMessage(JSON.parse(messageSrc))
		window.location.reload(true);  
    }
    if (message.action === "messages") {
    	var messages 	= (message.src);  
    	var form 		= document.getElementById("msg-display");
    	
		// remove all messages
		while (form.firstChild) {
			form.removeChild(form.lastChild);
		}
		
		// append all relevant messages
		for(var i = 0 ; i < messages.length; i++){
			form.appendChild(createMessage1(JSON.parse(messages[i])));
		}
		
		numOfMsgs.innerHTML = messages.length;
    }
	if(message.action === "image")
	{	
		//addImage(message.src);
	}	
}


/*********************************************************************************
*	this function handles the event a web socket is closing at the client
*	side. 
*	@parameter 		event: 	holds the socket closing data(?)
*	@return:		null
*********************************************************************************/
function onClose(event) {
	alert('closing socket: ' + event.code);
}



/*********************************************************************************
*	this function handles the event of a socket error at the client side. 
*	@parameter 		event: 	holds the socket error data(?)
*	return:			null
*********************************************************************************/
function onError(event) {
	alert('error in socket' + event);
}


/*********************************************************************************
*	this function insert incoming images from sever into 'content' div in page.
*	for now, only png format is handled. 
*	@parameter 		image: 	the image SOURCE encoded in Base64
*	@return:		null
*********************************************************************************/
function addImage(image){
	var content = document.getElementById("content");	
	var img = document.createElement("img");
	img.src = "data:image/png;base64," + image;
	content.appendChild(img);	
}



/*********************************************************************************
*	this function edit product
*	@parameter:			num, the product number in the table
*	@return:		null
*********************************************************************************/
function editProduct(num){
	console.log('product number: ' + num);
	
}


/*********************************************************************************
*	this function remove a product given its number in the table
*	@parameter:			num, the product number in the table
*	@return:		null
*********************************************************************************/
function removeProduct(num){
	
	var table		= document.getElementById('products-table');
	var catalog		= table.rows[num + 1].cells[0].innerHTML;
	var formdata	= new FormData();
	
	console.log('deleting product catalog number: ' + catalog );
	
	formdata.append("code", "2");
	formdata.append("catalog", catalog);
	formdata.append("type", "0"); 
	formdata.append("price", "0");
	formdata.append("length", "0");
	formdata.append("color", "");
	
	
	$.ajax({    
    url: 			'ProductServlet', 	
    dataType: 		'text',  		
    cache: 			false,
    contentType:	false,
    processData:	false,
    data: 			formdata,                         
    type: 			'post',
    async: 			true,
    success: function(response){
    		if(response > 0)
    		{
    			loadProducts(true);
    			console.log('response from server' + response);
    		}
    	}
    });
}



/*********************************************************************************
*	this function loads all available product from DB
*	@parameter:			sync, boolean weather the function executes in/out of sync
*	@return:			null
*********************************************************************************/
function loadProducts(sync){
		var formdata = new FormData();
		formdata.append("code", "0");
		formdata.append("catalog", "0");
		formdata.append("type", "0"); 
		formdata.append("price", "0");
		formdata.append("length", "0");
		formdata.append("color", "");
		
		
		$.ajax({    
        url: 			'ProductServlet', 	
        dataType: 		'text',  		
        cache: 			false,
        contentType:	false,
        processData:	false,
        data: 			formdata,                         
        type: 			'post',
        async: 			sync,
        success: function(response){
     			
        			var products 	= JSON.parse(response);
        			var table 		= document.getElementById("products-table");
        			var number		= document.getElementById('number-of-products');
    			    var tr			= document.createElement("tr");


        			number.innerHTML = products.length;             			 			
        			console.clear();
 
        			while(table.rows.length > 1)
        				table.deleteRow(1);
        			
        		       			
        			for(var i = 0; i < products.length; i++){
        			
        				var product 		= JSON.parse(products[i]);
        				var del				= document.createElement("input");
	    			    var edit			= document.createElement("a");
    			    	var remove			= document.createElement("a");
    			    	var span_re_del		= document.createElement("span");
        				var tr				= document.createElement("tr");
        				var td_cat 			= document.createElement("td");
        				var td_type 		= document.createElement("td");
						var td_cs	 		= document.createElement("td");
        				var td_price 		= document.createElement("td");
        				var td_len 			= document.createElement("td");
        				var td_clr 			= document.createElement("td");
        				var td_img 			= document.createElement("td");
        				var img				= document.createElement("img");
        				var td_del 			= document.createElement("td");
        				
						del.setAttribute("type", "checkbox"); 
        				edit.innerHTML		= 'edit';
        				edit.setAttribute('onclick', 'editProduct(' + i + ')');
        				remove.innerHTML	= 'remove';
        				remove.setAttribute('onclick', 'removeProduct(' + i + ')');
        				span_re_del.innerHTML= edit + ' / ' + remove;
        				
        				img.setAttribute('class', 'image');
        				img.src = product.image;
        				
        				td_cat.innerHTML 	= product.catalog;
        				td_type.innerHTML 	= product.type;
						td_cs.innerHTML 	= product.crossSection;
        				td_price.innerHTML 	= product.price;
        				td_len.innerHTML 	= product.length;
        				td_clr.innerHTML 	= product.color;
        				td_img.innerHTML	= img;
        				td_del.appendChild(edit);
        				td_del.appendChild(span_re_del);
        				td_del.appendChild(remove);
        				
						tr.setAttribute('class', 'row-products');
        				tr.appendChild(td_cat);
        				tr.appendChild(td_type);
						tr.appendChild(td_cs);
        				tr.appendChild(td_price);
        				tr.appendChild(td_len);
        				tr.appendChild(td_clr);
        				tr.appendChild(img);
        				tr.appendChild(td_del);
        				table.appendChild(tr);
        				
        			}
    			}
     	});
}


/*********************************************************************************
*	this function send added product to the server, thus allowing to upload a new
*	product to the server\DB. if one of the fields is missing the function prompts
*	a message urging user to complete the product form
*	@parameter:			null
*	@return: 		null		
*********************************************************************************/
function addNewProduct(){
		
		var productID 		= document.getElementById('product-id');
		var productLength 	= document.getElementById('product-length');
		var productType 	= document.getElementById('product-type');
		var productPrice 	= document.getElementById('product-price');
		var productColor 	= document.getElementById('product-color');
		var productImage	= document.getElementById('new-product');
		var images			= productImage.getElementsByClassName('thumb');
		var formdata 		= new FormData();
		
		console.log('image name: ' + images[0].name);
		
		if(productLength.value === ''){
			alert('productLength is empty');
		}
		if(productID.value == "" || productLength.value == "" || productType.value === "" || productPrice.value == "" || productColor.value == ""){
			
			alert('one or all of the following fields is missing:' + 
				  '\ncat:' + productID.value+
				  '\ntype:' + productType.value +
				  '\nlength:' + productLength.value +
				  '\nprice: ' + productPrice.value +
				  '\ncolor: ' + productColor.value);
			return;
		}
		
		formdata.append("code", "1");
		formdata.append("catalog", productID.value);
		formdata.append("type", productType.value); 
		formdata.append("price", productPrice.value);
		formdata.append("length", productLength.value);
		formdata.append("color", productColor.value);
		
		if(images.length === 0 )
			formdata.append("image", null);
		else
			formdata.append("image", images[0].src); 
		
		$.ajax({    
        url: 			'ProductServlet', 	
        dataType: 		'text',  		
        cache: 			false,
        contentType:	false,
        processData:	false,
        data: 			formdata,                         
        type: 			'post',
        success: function(response){ 
        			loadProducts(true);
        			cancelAddProduct()
    			}
     	});
}


/*********************************************************************************
*	this function cancel the adding product procedure
*********************************************************************************/
function cancelAddProduct(){
	
	var p	= document.getElementById('new-product');
	p.remove();
}


/*********************************************************************************
*	this function displays admin functionality: add product..
*	@parameter		null
*	@return		null
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
	var addImage		= document.createElement('a');
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
	var loadFile		= document.createElement('div');
	
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
	addProductBtn.setAttribute('style', 'vertical-align:bottom !important');
	addProductBtn.setAttribute('class', 'btn btn-success');
	addProductBtn.setAttribute("onclick", 'addNewProduct()');
	
	cancelProductBtn.innerHTML = "cancel";
	cancelProductBtn.setAttribute('id', 'cancel-product-btn');
	cancelProductBtn.setAttribute('type', 'button');
	cancelProductBtn.setAttribute('class', 'btn btn-danger');
	cancelProductBtn.setAttribute('style', 'float:right; padding-right:10px;');
	cancelProductBtn.setAttribute("onclick", 'cancelAddProduct()' );
	
	p.setAttribute('id', 'p-add-cancel');
	p.setAttribute('style', 'align-items: bottom;');
	p.appendChild(addProductBtn);
	p.appendChild(addImage);
	p.appendChild(cancelProductBtn);
	
	loadFile.setAttribute('id', 'product-image-upload');
	loadFile .setAttribute('class', 'upload-image');
	loadFile.innerHTML = 	"<label for='file-input' >" +
								"<img class='file-image' src='https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg'/>" +
							"</label>" +
							"<input id='file-input' type='file' style='display:none;' ondrop='drop()' onchange='onProductAdded(this)'>";

	
	form.appendChild(hr);
	form.appendChild(tbl);
	form.appendChild(loadFile);
	form.appendChild(p);
	
	var container = document.getElementById("products");
	container.appendChild(form);
	
}


/*********************************************************************************
*	this function displays the file upload module in the 'new product' area
*	@parameter:		null
*	@return 	null
*********************************************************************************/
function showProductImageUpload(){
	var ele		= document.getElementById('product-image-upload');
	ele.style.display = 'block';
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
*	this function load all users messages from the server for the registered user 
*	@parameter	sync boolean, if the adding of messages will be synchronous or not
*	@return	null
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
		formdata.append("display", "");
	    $.ajax({
        url: 			'UserServlet', 	
        dataType: 		'text',  		
        cache: 			false,
        contentType: 	false,
        processData: 	false,
        data: 			formdata,                         
        type: 			'post',
        async: 			sync,
        success: function(response){ 
               		if (response == '') return;
        		    var form 		= document.getElementById("msg-display");
        		    var numOfMsgs	= document.getElementById("numberOfMessages");
        			var messages 	= JSON.parse(response);  
        			var length		= messages.length;
        			var max			= 0;
        			var step		= 20;
        			var currentOff	= 0;
        			var prevMsg		= null;	
        			var msgs		= [];

        			// remove all messages
        			while (form.firstChild) {
						form.removeChild(form.lastChild);
					}
  					
  					// append all relevant messages
        			for(var i = 0 ; i < length; i++){
        				var msg		= createMessage1(JSON.parse(messages[i]));
						var imgs	= msg.getElementsByTagName('img');
        				form.appendChild(msg);
						
        			}
        			numOfMsgs.innerHTML = length;
        		}
     });
}


/*********************************************************************************
*	this function inserts a new message element into messages displayed area
*	@parameter: messages,		an array of already parsed messages in JSON format
*	@parameter: index,			the index of the message in the array 
*********************************************************************************/
function insertMessage(message){
	
	console.log('message added');
	var msgDisplay	= document.getElementById('msg-display');
	var msgElement 	= createMessage1(message);
	var messages	= document.getElementsByClassName('message');
	var msgsLength	= messages.length;
	var userReply	= null;
	var display		= message.display;
	var msg			= null;
	var offset		= Number(message.offset);
	var img			= document.createElement('img');
	
	img.src			= message.image;
	
	msgElement.appendChild(img);
	/*
	console.log(	'insert message with offset bigger than 0:' +
	'\nmessage: ' 	+ message.message + 
	'\nreply to: ' 	+ message.repliedTo + 
	'\nuser: ' 		+ message.user +
	'\nsender: ' 	+ message.sender +
	'\noffset: ' 	+ message.offset +
	'\nimages: ' 	+ message.image);	 
	*/
	
	if(message.offset === '0' ){
		//alert('insert message with offset = 0');
		msgDisplay.appendChild(msgElement);		
	}
	else if( message.offset > 0 ){
		//alert('insert message with offset > 0');
		msgDisplay.appendChild(msgElement);
	}
	else{
		for(var i = 0; i < messages.length; i++){
			var msgi 		= messages[i];
			var childNodes	= msgi.childNodes;	
			
			for (var j = 0; j < childNodes.length; j++) {	
			    if (childNodes[j].class === 'user-date' ){ 
			    	alert('node name: ' + childNodes[j].name);
			    	userReply = childNodes[j].name;
			    	break;
			    }        
			}			
			if(userReply === message.repliedTo){
				messages[i].parentNode.insertBefore(msgElement, msgi.nextSibling);
				message.visited = 1;
				return;
			}
		}
	}
}


/*********************************************************************************
*	this function inserts a message element into the document tree
*	@parameter		messages, an array of all messages
*	@parameter		index, int, the index of desired message to insert in the array
*	@return		null
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
*	drop-down menu given by the element 'user-list'. 
*	@parameter		user, string the name of the user to find
*	@return		result, the name of the user found
*********************************************************************************/
function userExist(user){
	var result = false;
	var users = document.getElementById('users-list');
	var len = users.length;
	for(var i = 0; i < len; i++){
		if(users[i].value == user){
			result = true;
			break;
		}
	}	
	return result;
}


/*********************************************************************************
*	this function takes a message in JSON format and create an option 'sender'
*	@parameter		message, a JSON object that holds all of the message details
*	@return		result, an 'option' tag element with value and innerHTML of the user
*********************************************************************************/
function createSender(message){

	var result 	  = document.createElement("option");
	result.value  = message.sender;
	result.innerHTML = message.sender;
	return result;
}


/********************************************************************************
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
*	@parameter		message, a JSON object that holds all of the message details
*	@return		newMessage, a 'div' element that holds all of the new message details
*				including text, date, sending and recieving parties and images
*********************************************************************************/
function createMessage1(message){

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
	var width		= '53%';
	var space		= '10%';
	
	var newMessage 	= document.createElement("div");
	var frame 	  	= document.createElement("div");
	var imgsFrame 	= document.createElement("div");
	var userTag   	= document.createElement("a");
	var replyUser 	= document.createElement("a");
	var replyTo 	= document.createElement("a");
	var pDate  		= document.createElement("p");
	var p 		  	= document.createElement("p");
	var spanMsg 	= document.createElement("span");
	var dateSpan	= document.createElement("span");
	var reply 	  	= document.createElement("span");
	var clkd      	= document.createElement("a");
	var rawDate	  	= document.createElement("pre");
	var del	  		= document.createElement("a");
	var br	  		= document.createElement("div");
	
	
	
	
	
	del.setAttribute('id', 'delete' + date);
	del.setAttribute('href', '#delete' + date);
	del.setAttribute('style', 'color:red; padding-right:' + offset + 'px;');
	del.setAttribute('onclick', 'hideMessage(' + date + ')');
	del.innerHTML = ' hide';
	
	clkd.setAttribute('id', 'clicked' + date);
	clkd.setAttribute('style', 'visibility:hidden;');
	clkd.innerHTML = clicked;

	spanMsg.innerHTML = ": " + msg_text;
	pDate.innerHTML =  " on " + new Date(date).toUTCString().split(' ').slice(0, 5);
	pDate.setAttribute("id", 'date' + date );
	pDate.setAttribute("style", 'text-align:right;' );
	
	userTag.setAttribute('id', 'user-tag' + date);
	userTag.setAttribute('class', 'user-tag');
	userTag.setAttribute('href', '#user' + date);
	userTag.setAttribute('onclick', 'userClick(' + date + ')' );
	userTag.innerHTML = sender;
	
	replyUser.setAttribute('id', 'user-reply' + date);
	replyUser.setAttribute('href', '#messageElement' + date);
	replyUser.setAttribute('onclick', 'replyClicked(' + date + ')' );
	replyUser.setAttribute('style', 'color:green;');
	replyUser.innerHTML = " reply";
	
	replyTo.setAttribute('class', 'reply-to');
	replyTo.setAttribute('id', 'reply-to' + date);
	replyTo.setAttribute('style', 'color:green;');
	replyTo.innerHTML = 'reply to message you sent on: ' + new Date(date).toUTCString().split(' ').slice(0, 5);
	
	rawDate.setAttribute('id', 'raw-date' + date);
	rawDate.setAttribute('style', 'display: none;');
	rawDate.class = 'user-date';
	rawDate.name = user + date;
	rawDate.innerHTML = date;
	
	br.class = 'container';
	
	p.appendChild(userTag);
	p.appendChild(spanMsg);
	p.appendChild(pDate);
	
	reply.appendChild(replyUser);
	p.appendChild(del);
	pDate.appendChild(reply);
	pDate.appendChild(del);
		
	
	
	if( images != '{}' )
	{		
		imagesSrc	= new String(images.slice(2, images.length - 4));	
		var regex	= new RegExp(/data:image\/[a-z]+\;base64,|data:image\/[a-z]+\;/g);
	
		splitImg	= imagesSrc.split( regex );
		
		for(var i = 1; i < splitImg.length; i++){	
			if( splitImg[i] === "") { continue; }		
			if( i < splitImg.length ){
				src	= splitImg[i].replace('","', '');
			}
			var img 	= document.createElement("img"); 
			img.src 	= 'data:image/png;base64,' +  src;
			img.setAttribute('class', 'image');
			imgsFrame.appendChild(img);	
		}
	}
	
	
	//frame.setAttribute('class', 'message');
	frame.setAttribute('id', 'messageElement' + date);
	frame.setAttribute("onclick", 'messageClicked(' + date + ')' );
	frame.appendChild(p);
	frame.appendChild(imgsFrame);
	
	newMessage.setAttribute('class',   'message');
	newMessage.setAttribute.innerHTML = message.message;
	newMessage.setAttribute('style',   'width:' + width + '				\
										border: 1px solid black;		\
										border-radius: 5px;				\
										background-color: lightblue;	\
										padding-top: 5px;				\
									  	padding-right: 10px;			\
									  	padding-bottom: 5px;			\
									  	padding-left: 10px;				\
									  	margin-top: 30px;				\
									  	margin-right: 80px;				\
									  	margin-left: 0px;'); 
									  	
	if(message.sender !== sessionStorage.getItem('username')){
		newMessage.setAttribute('style',   	'width:' + width +			
											'border: 1px solid black;		\
											border-radius: 5px;				\
											background-color: lightblue;	\
											padding-top: 5px;				\
										  	padding-right: 10px;			\
										  	padding-bottom: 5px;			\
										  	padding-left: 10px;				\
										  	margin-top: 30px;				\
										  	margin-right: 0px;				\
										  	margin-left: 80px;'); 
	}
	
	newMessage.appendChild(frame);
	return newMessage ;
}



/*********************************************************************************
*	this function shows outgoing messages only
*	@parameter:		long, date a unique identifier for the user clicked
*	@return:	null
*********************************************************************************/
function userClick(date){

	var user			= sessionStorage.getItem('username');
	var clickedUser		= document.getElementById('user-tag' + date);
	var message			= null;
	
	if(user === clickedUser.innerHTML )
		message = createSocketMessageByteArray("5", user, user, "", date, false, "", 0, "", "");
	else
		message = createSocketMessageByteArray("6", clickedUser.innerHTML, user, "", date, false, "", 0, "", "");
		
	wsocket.send(message); 
}



/*********************************************************************************
*	this function hides a message for a specific user by gathering the sender and 
*	user of a specific message and sends a request for the server so the message
*	will not be displayed on the users messages feed anymore. the function also 
*	remove the message element from the user page. 
*	@parameter		id, string a unique identifier for an 'a' tag in the message   
*	@return		null
*********************************************************************************/
function hideMessage(id){
	var user		= sessionStorage.getItem('username');
	var sender		= document.getElementById('user-tag' + id).innerHTML;
	var msgElement 	= document.getElementById('messageElement' + id);
	var message		= createSocketMessageByteArray("3", sender, user, "", id, false, "", 0, "", "");
	msgElement.remove();
	wsocket.send(message); 
}


/*********************************************************************************
*	this function handles message element being clicked, notify server that message
*	was clicked and changes the message element background color.
*	@parameter		p, string a unique identifier of a given message
*	@return		null 
*********************************************************************************/
function messageClicked(p){

	console.log('message: ' + p + ' clicked');
	var click 		= document.getElementById('clicked' + p);
	var user 		= document.getElementById('user-tag' + p).innerHTML;
	var formData 	= new FormData();
	
	if(click.innerHTML == 'false'){
		formData.append("code", "3");
		formData.append("user", user.slice(0,20)); 
		formData.append("sender", user.slice(0,20));
		formData.append("message", "");
		formData.append("date", p); 
		
	    $.ajax({
		    url: 			'UserServlet', 	 
		    dataType: 		'text',  		
		    cache: 			false,
		    contentType: 	false,
		    processData: 	false,
		    data: 			formData,                         
		    type: 			'post',
		    success: 		function(response){
		       					var msg = document.getElementById('messageElement' + p);
		       					var compStyles = window.getComputedStyle(msg);
		       					var offset = compStyles.getPropertyValue('margin-left');
								msg.setAttribute('style', 'border-radius: 5px; border: 1px solid #000000; background-color: #ffffff; margin-left:' + offset);
								click.innerHTML = 'true';
			    			}
	 	});
 	}
}


/*********************************************************************************
*	this function is fired up when the reply hyper link to specific message is 
*	clicked. reply area is being added to page under the chosen message and 
*	'message clicked' is sent.
*	@parameter:		p,	unique identifier (date of creation)
*	@return:	null
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

	currnetNode.parentNode.insertBefore(msgReply, currnetNode.nextSibling);
	currnetNode.parentNode.insertBefore(imgReply, currnetNode.nextSibling);
	end = replyText.selectionEnd;
	replyText.focus();
	replyText.selectionEnd + 1;
	notifyMessageClicked(user, time);
}


/*********************************************************************************
*	this function create the file upload area as an html element and return it.
*	@parameter:		p, unique identifier
*	@return:	null
*********************************************************************************/
function createImageUploadArea(p){

	var div			= document.createElement('div');
	div.innerHTML 	=  	"<label for='file-input' >" +
						"<img class='file-image' src='resources/upload-icon.png'/>" +
						"</label>" +
						"<input id='file-input' type='file' style='display:none;' ondrop='drop()' onchange='onChange(" + p + ",this)'>";
	div.setAttribute('id', 'upload-image' + p);
	div.setAttribute('class', 'upload-image');						
	return div;
}



/*********************************************************************************
*	this function create the message text area as an html element and return it.
*	@parameter:		p, 		unique identifier
*	@parameter:		user, 	a specific user name to be replied to. if @user is empty,
*						the first option of users is displayed, i.e. NO REPLY: 
*						fresh new message
*	@parameter:		users, 	an array of users names
*	@return:	div, 	the element created which holds the functionality
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
	//btnUpload.setAttribute('onclick', 'upload(this)');
	btnUpload.setAttribute('data-dismiss', 'modal');
	btnUpload.innerHTML = 'upload';
	
	btnCancel.setAttribute('id', 'cancel-file-btn' + msgNumber);
	btnCancel.setAttribute('type', 'button');
	btnCancel.setAttribute('class', 'btn btn-danger');
	btnCancel.setAttribute('onclick', 'cancelMsgText()');
	btnCancel.setAttribute('data-dismiss', 'modal');
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
		
	return div;	
}



/*********************************************************************************
*	this function send a message in JSON format to the server to be inserted into
*	the DB: format is: { user: 'user', sender: 'sender', text: 'text', date: 'date',
*						 offset:'offset',  }
*	@parameter		jmessage, the message JSON object
*	@return		null
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
	
	var message 	= createSocketMessage("2", sender, usr, msg, date.getTime(), clicked, imgs, 0, "", "");	
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
*	@parameter:		p, the message unique identifier (its date) 
*	@return		null
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
	
										
	var message 	= createSocketMessage("2", sender, user.innerHTML, msg.value, date, false, imgs, offs, user.innerHTML + rawDate.innerHTML, "");	
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
*	@parameter		p, string a unique identifier 
*	@return		null
*********************************************************************************/
function cancel(p){
	var obj = document.getElementById('reply' + p);	
	obj.remove();	
}


/*********************************************************************************
*	this function notify the server that the message with 'user' and 'data'
*	was clicked
*	@parameter		user, string the user name
*	@parameter		date, string the string representation of a long number
*	@return		null
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
*	this function sends the updated user details to the server, after 'update'
*	button was clicked on the user page and send to the server the new details.
*	@parameter		null
*	@return		null
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
*	@parameter		null
*	@return		null
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
*	@parameter		null
*	@return		null
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
*	this function is fired up when a reply to a message was pressed, iterate over 
*	all images, checked if chosen and sent to the sendMessage function
*	@parameter:		p, unique identifier
*	@return:	null
*********************************************************************************/
function upload(p){

	let imgs 		  	= [];
	var imgReplyEle		= document.getElementById('upload-image' + p);
	var ckbx 		  	= document.getElementById('upload-image' + p).getElementsByTagName("input");
	var images 		  	= document.getElementById('upload-image' + p).getElementsByTagName("img");

	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			imgs.push(images[i].src);
  		}
	}
	sendMessage(imgs, p);
}



/*********************************************************************************
*	this function creates a JSON object of 'Message' type,  iterate over all images, 
*	checked if chosen and sent to server
*	@parameter		number, REDUNDENT
*	@return		null
*********************************************************************************/
function uploadMessage(number){
	let arr 		 = [];
	var ckbx 		 = document.getElementById("output").getElementsByTagName("input");
	var images 		 = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  		}
	}
	sendMessage(arr);
}


/*********************************************************************************
*	this function gathers all selected images for a specific message
*	@parameter		number, REDUNDENT
*	@return		arr, an array of all selected ('checked') images
*********************************************************************************/
function getSelectedImages(number){
	let arr 		 = [];
	var ckbx 		 = document.getElementById("output").getElementsByTagName("input");
	var images 		 = document.getElementById("output").getElementsByTagName("img");
	for (var i=0; i<ckbx.length; i++) {
  		if( ckbx[i].checked == Boolean(true) ){
  			arr.push(images[i]);
  		}
	}
	return arr;
}


/*********************************************************************************
*	this function simply shows the hidden elements to allow message text upload,
*	after removing all existing messages
*	@parameter:		null
*	@return:	null
*********************************************************************************/
function showOutgoingMsgArea(){
	console.log('out going message'); 
	var users		= loadUsers(false);
	var messages	= document.getElementsByClassName('message');
	var uploadImg	= document.getElementsByClassName('upload-image');
	var upldLength	= uploadImg.length;
	var msgLength	= messages.length;
	var	newMessage	= document.getElementById("new-msg");
	var msgArea		= document.getElementById("new-area");
	var fileUpload	= null;

	for(var i = 0; i < upldLength; i++){
		uploadImg[i].remove(); 
	}
	
	newMessage.appendChild(createImageUploadArea(msgLength));
	newMessage.appendChild(createMsgTextArea(msgLength, users, ''));
} 


/*********************************************************************************
*	this function remove all chosen images and text from message modal uploading
*	area and then closes the new message modal
*	@parameter:		null
*	@return:	null
*********************************************************************************/
function cancelMsgText(){
	var imgReplies	= document.getElementsByClassName('upload-image');
	var txtReplies	= document.getElementsByClassName('msg-area');
	
	// erase all other reply messages text AND images upload from page 
	for(var i = txtReplies.length - 1; i >= 0; --i){ txtReplies[i].remove(); } 
	for(var i = 0; i < imgReplies.length; i++){ imgReplies[i].remove(); }
	
	$('#send-message-modal').modal('hide');
} 


/*********************************************************************************
*	this function handles product image upload event, display the selected imnage
*	to the 'addNewProduct' area
*	@parameter:		input, the selected file from file-upload dialog
*	@return		null
*********************************************************************************/
function onProductAdded(input){
	
	var file 			= input.files[0];
	var name 			= file.name;
	var productArea		= document.getElementById('new-product');
	var reader 			= new FileReader();
    reader.onload = function (event) {
    					var image = createCheckedImage(event.target.result, name);
				    	productArea.appendChild(image);		    	
				    };
	reader.readAsDataURL(file);    
}

/*********************************************************************************
*	this function does the same as the following but for 'browsing option'
*	@parameter:		p, long a unique identifier
*	@parameter:		input, the file upload selections
*	@return:	null
*********************************************************************************/
function onChange(p, input){

	var url 	= $(input).val();
	var file 	= input.files[0];
	var name 	= file.name;
	var parent 	= document.getElementById('upload-image' + p);	
	var src		= null;
	
	var reader = new FileReader();
    reader.onload = function (event) {
    					var newImg	=	createCheckedImage(event.target.result, name);
				    	parent.appendChild(newImg);			    	
				    };
    reader.readAsDataURL(file);
}


/*********************************************************************************
*	this function handles the drop event of the files upload element,
*	simply places the chosen images in the output element
*	@parameter:		event, handle the object that holds the 'drop' file-upload event 
*	@return:	null
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
*	@parameter:		source, the source of the file uploaded
*	@parameter:		name, the name of the file uploaded
*	@return:	newDiv, the created element
*********************************************************************************/
function createCheckedImage(source, name){
	
	var id 			= Math.floor(Math.random() * 100); 
	var newDiv 		= document.createElement("div");
	var newImg 		= document.createElement("img");
	var newLbl 		= document.createElement("label");
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
*	2. the page 'Personal Details' and 'card' sections 
*	@parameter:		null
*	@return:		null
*********************************************************************************/
function loadUserDetails(){
	
	let name	   = sessionStorage.getItem('username');
	let password   = sessionStorage.getItem('password');
	let nickname   = sessionStorage.getItem('nickname');
	let email      = sessionStorage.getItem('email');
	let address	   = sessionStorage.getItem('address');
	
	console.log("user details: \nname: " + name + "\npassword: " + password + "\nnickname: " + nickname + "\nemail: " +  email + "\naddress: " + address);
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
	
	document.getElementById("card-name").innerHTML = name;
	document.getElementById("card-description").innerHTML = nickname;
	document.getElementById("card-image").src = name;
	//TODO: add phone detail
	//document.getElementById("pt-user-name").value = phone;
	//document.getElementById("pt-user-name").disabled = true;
	
}


/*********************************************************************************
*	this function loads registered user from db and add to the list of users
*	to choose from while sending a new message, and return the users as string
*	array.
*	@parameter:		sync, boolean, whether the function should run in parallel or not  
*	@return:	result, a string array of users names
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
*	this function sends a request message to the server to get all messages for the
*	user name, as kept in the sessionStorage memory. after this, the function call
*	the loadUserMessages with the false argument to indicate asynchronous action
*	@parameter:		null
*	@return:	null
*********************************************************************************/
function showAllMessages(){
	var user		= sessionStorage.getItem('username');
	var message		= createSocketMessageByteArray("4", "", user, "", 0, false, "", 0, "", "");
	wsocket.send(message); 
	alert('load user messages');
	loadUserMessages(false);
}



/*********************************************************************************
*	this function sends a new message to a specific user
*	@parameter:		images,		an array that contains all the images uploaded by the user
*	@parameter:		msgNumber	int, a unique identifier (time stamp)
*	@return:	null  
*********************************************************************************/
function sendMessage(images, msgNumber){

	var	msgElement	= document.getElementById('messageElement' + msgNumber);
	var msg 	  	= document.getElementById("msg-text" + msgNumber).value;	
	var usrs 	  	= document.getElementById('users' + msgNumber);
	var usrElement 	= document.getElementById('user-tag' + msgNumber); 	
	var usr			= "";
	var sender	  	= sessionStorage.getItem('username');
	var date	  	= new Date();
	var clicked   	= 'false';
	var imgs 		= [];
	var msgBuffer 	= null;
	var offset		= 0;
	var offsetCalc	= null; 
	var offsetStep	= 20;
	var replyTo		= "";	
	
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
	alert(	'message element: ' + msgElement + 
			'\nmsg: ' + msg + 
			'\nusers: ' + users + 
			'\nuser: ' + usr +
			'\nsender: ' + sender+
			'\nreply to: ' + replyTo);
	*/
	var message 		= createSocketMessageByteArray("2", sender, usr, msg, date.getTime(), clicked, images, offset, replyTo, "");	
	cancelMsgText();
	wsocket.send(message);
}


/*********************************************************************************
*	this function handles message actions requests from the user: reset messages 
*	to show the last view, show all, incoming or outgoing messages
*	@parameter:		select,		the select element that holds the users required action
*	@return:	null  
*********************************************************************************/
function messagesAction(select){

	switch (select.selectedIndex) {
	  case 1:
	 	console.log('open modal');
		$('#send-message-modal').modal('show'); //open modal
		//showOutgoingMsgArea();
	    break;
	  case 2:
	 	//resetMessages();
	    break;
	  case 3:
	  	showAllMessages()
	  	break;
	  case 4:
		showOutgoingMessages();
	    break;
	  case 5:
		showIncomingMessages();
	    break;
	  default:
    	alert('selection not supported, contact @support');
    }
	select.selectedIndex = 0;
}



/**
 * 	file holds functionality to handle messages
 */
 
 


/*********************************************************************************
*	this function converts an image to Base64 encoding string
*********************************************************************************/
function encodeImageFileAsURL(image) {
 	var result;
	var reader = new FileReader();
	reader.onloadend = function() {
    	result =  reader.result;
  	}
  	reader.readAsDataURL(image);
  	alert(result);
	return result;
}



/*********************************************************************************
*	this function send a message in JSON format to the server to be inserted into
*	the DB: format is: { user: 'user', sender: 'sender', text: 'text', date: 'date',
*						 offset:'offset',  }
*********************************************************************************/
/*
function uploadMessage(message){
	alert();
	formData.append("code", "1");
	formData.append("user", message.user.slice(0,20)); 
	formData.append("sender", message.sender.slice(0,20));
	formData.append("message", message.text);
	formData.append("date", message.date);
	formData.append("offset", message.date); 
	formData.append("repliedTo", message.date);  
	
	alert('reply uploaded: ' + text);
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
				*
				alert('success');
			}
	});
	 
}
*/

 /*********************************************************************************
*	this function creates a JSON format message
*********************************************************************************/
function createSocketMessage(code, sender, user, msg, date, clckd, imgs, offset, repliedTo) {
	//alert('create message: imgs ' + imgs.type);
 	var result =  {	
 					"code": 	code,
 					"sender": 	sender, 
 					"user": 	user,
			 		"message": 	msg,
			 		"date": 	date,
			 		"clicked": 	clckd,
			 		"image":	imgs,
			 		"offset": 	offset,
			 		"repliedTo": repliedTo
			 		};
	//alert('message.js >> images: ' + (imgs));
			 		
	alert('sent message \ncode:' + code + '\nsender:' + sender + '\nuser: ' + user +
						'\nmessage:' + msg + '\ndate: ' + date + '\nclicked: ' + clckd +
						'\nimage: ' + imgs + '\noffset: ' + offset + '\nreplied to: ' + repliedTo);
	
	return JSON.stringify(result);
}


 /*********************************************************************************
*	this function creates a JSON format message, and places it into a byte array
*********************************************************************************/
function createSocketMessageByteArray(code, sender, user, msg, date, clckd, imgs, offset, repliedTo) {
 	var message	=  JSON.stringify({	
 					"code": 	code,
 					"sender": 	sender, 
 					"user": 	user,
			 		"message": 	msg,
			 		"date": 	date,
			 		"clicked": 	clckd,
			 		"image":	imgs,
			 		"offset": 	offset,
			 		"repliedTo": repliedTo
			 		});
	var msgByteArr		= [...message];
	var msgBuffer		= new ArrayBuffer(message.length);
	var messageArray	= new Uint8Array(msgBuffer);
	for(var i = 0; i < msgByteArr.length; i++){
		messageArray[i] = message.charCodeAt(i);
	}
	/*		 		
	alert('sent message \ncode:' + code + '\nsender:' + sender + '\nuser: ' + user +
						'\nmessage:' + msg + '\ndate: ' + date + '\nclicked: ' + clckd +
						'\nimage: ' + imgs + '\noffset: ' + offset + '\nreplied to: ' + repliedTo);
	*/
	return messageArray;
}




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




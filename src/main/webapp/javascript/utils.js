/**
 * 
 */


/*********************************************************************************
*	this function converts an image to Base64 encoding string
*********************************************************************************/
function encodeImageFileAsURL(image) {
	alert(image.src);
 	var result = URL.createObjectURL(image.src);
	
	var reader = new FileReader();
	
	reader.onload = function() { 
		alert(image);    	
		result =  reader.result;
		
  	}
  	reader.readAsDataURL(image.src);
  	
	return result;
}








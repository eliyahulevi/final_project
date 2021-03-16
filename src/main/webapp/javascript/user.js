/********************** 	handles user page messages ***************************
 *
 *	the messages codes are as follows:
 *	0x0000 - load registered users into "send message" modal
 *	0x0001 - send the message the user typed in
 *	0x0002 - uploap images  
 *
 ********************************************************************************/


$(document).ready(function(){
  $("#send-Message-Modal").on('show.bs.modal', function(){
    loadUsers();
  });
  
});


/*********************************************************************************
*	this function iterate over all images, checked if chosen and sent to server
*********************************************************************************/
function upload(){
		
	var images = document.getElementById("output").getElementsByTagName("input");
	for (var i=0; i<images.length; i++) {
  		if( images[i].checked == Boolean(true) ){
  			alert("true at:" + i);
  		}
	}

}

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
	var parent = document.getElementById("output");	
	var reader = new FileReader();
    reader.onload = function (event) {
				    	parent.appendChild(createCheckedImage(event.target.result));
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
*							<checkbox/>
*							<label>
*								<img/>
*							</label>
*						</div>
*********************************************************************************/
function createCheckedImage(source){
	
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
	
	newLbl.setAttribute("class", "custom-control-label");
	newLbl.setAttribute("for", id);
	newLbl.appendChild(newImg);
	
	newDiv.setAttribute("class", "custom-control custom-checkbox image-checkbox");
	newDiv.setAttribute("style", "display:inline-block");
	newDiv.appendChild(newCheckbox);
	newDiv.appendChild(newLbl);

	return newDiv;
}


function loadUserPage(user){
	sessionStorage.getItem('user');
	//alert(user);
}

/*********************************************************************************
*	this function loads registered user from db and add to the list of users
*	to choose from while sending a new message 
*********************************************************************************/
function loadUsers(){
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
										for (var i = 0; i < count; i++) {
											selectList.options[i] = null;
										}
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

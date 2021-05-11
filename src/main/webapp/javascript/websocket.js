/**
 * 	handles the socket functionality
 */

window.onload 		= init;
var socket 			= new WebSocket("ws://localhost:8080/final-project/messages");
socket.onppen 		= onOpen; 
socket.onclose		= onClose;
socket.onerror		= onError;
socket.onmessage 	= onMessage;



/*********************************************************************************
*	this function handles the event a web socket is being started at the client
*	side. 
*	@parameter event: 	holds the socket data(?)
*	return:				null
*********************************************************************************/
function onOpen(event) {
	var message = JSON.stringify({ id: 'id' })
	websocket.send(message);
	alert('open socket' + event.data);
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
*	this function handles the event when a message comes in from the server 
*	endpoint. 
*	@parameter event: 	holds the message data
*	return:				null
*********************************************************************************/
function onMessage(event) 
{	
    var device = JSON.parse(event.data);
    if (device.action === "add") {
        printDeviceElement(device);
    }
    if (device.action === "remove") {
        document.getElementById(device.id).remove();
        //device.parentNode.removeChild(device);
    }
    if (device.action === "toggle") {
        var node = document.getElementById(device.id);
        var statusText = node.children[2];
        if (device.status === "On") {
            statusText.innerHTML = "Status: " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.id + ")>Turn off</a>)";
        } else if (device.status === "Off") {
            statusText.innerHTML = "Status: " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.id + ")>Turn on</a>)";
        }
    }
	if(device.action == "image")
	{
		addImage(device.src);
	}	
}


/*********************************************************************************
*	this function insert imcomming images from sever into 'content' div in page.
*	for now, only png format is handled. 
*	@parameter image: 	the image SOURCE encoded in Base64
*	return:				null
*********************************************************************************/
function addImage(image)
{
	var content = document.getElementById("content");	
	var img = document.createElement("img");
	img.src = "data:image/png;base64," + image;
	content.appendChild(img);
	
}


/*
function addDevice(name, type, description){
    var DeviceAction = {
        action: "add",
        name: name,
        type: type,
        description: description
    };
    socket.send(JSON.stringify(DeviceAction));
}

function removeDevice(element) {
    var id = element;
    var DeviceAction = {
        action: "remove",
        id: id
    };
    socket.send(JSON.stringify(DeviceAction));
}

function toggleDevice(element) {
    var id = element;
    var DeviceAction = {
        action: "toggle",
        id: id
    };
    socket.send(JSON.stringify(DeviceAction));
}

function image(){
    var DeviceAction = {
	    action: "addImage",
	    name: name,
	    type: type,
	    description: description
    };
    socket.send(JSON.stringify(DeviceAction));	
}
*/


/*
function printDeviceElement(device) {
    var content = document.getElementById("content");
    
    var deviceDiv = document.createElement("div");
    deviceDiv.setAttribute("id", device.id);
    deviceDiv.setAttribute("class", "device " + device.type);
    content.appendChild(deviceDiv);

    var deviceName = document.createElement("span");
    deviceName.setAttribute("class", "deviceName");
    deviceName.innerHTML = device.name;
    deviceDiv.appendChild(deviceName);

    var deviceType = document.createElement("span");
    deviceType.innerHTML = "<b>Type:</b> " + device.type;
    deviceDiv.appendChild(deviceType);

    var deviceStatus = document.createElement("span");
    if (device.status === "On") {
        deviceStatus.innerHTML = "<b>Status:</b> " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.id + ")>Turn off</a>)";
    } else if (device.status === "Off") {
        deviceStatus.innerHTML = "<b>Status:</b> " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.id + ")>Turn on</a>)";
        //deviceDiv.setAttribute("class", "device off");
    }
    deviceDiv.appendChild(deviceStatus);

    var deviceDescription = document.createElement("span");
    deviceDescription.innerHTML = "<b>Comments:</b> " + device.description;
    deviceDiv.appendChild(deviceDescription);

    var removeDevice = document.createElement("span");
    removeDevice.setAttribute("class", "removeDevice");
    removeDevice.innerHTML = "<a href=\"#\" OnClick=removeDevice(" + device.id + ")>Remove device</a>";
    deviceDiv.appendChild(removeDevice);
}

function showForm() {
    document.getElementById("addDeviceForm").style.display = '';
}

function hideForm() {
    document.getElementById("addDeviceForm").style.display = "none";
}

function formSubmit() {
    var form = document.getElementById("addDeviceForm");
    var name = form.elements["device_name"].value;
    var type = form.elements["device_type"].value;
    var description = form.elements["device_description"].value;
    hideForm();
    document.getElementById("addDeviceForm").reset();
    addDevice(name, type, description);
}
*/
function init() {
    hideForm();
}
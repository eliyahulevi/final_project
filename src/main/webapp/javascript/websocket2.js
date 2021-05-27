/**
 * 
 */


var webSocket = new WebSocket("ws://localhost:8080/final-project/websocket2");
    webSocket.binaryType = 'arraybuffer';
    webSocket.onopen = function(message)	{ wsOpen(message);};
    webSocket.onmessage = function(message)	{ wsGetMessage(message);};
    webSocket.onclose = function(message)	{ wsClose(message);};
    webSocket.onerror = function(message)	{ wsError(message);};

    function wsOpen(message){
		alert('web socket2: ' + message);
        echoText.value += "Connected ... \n";
    }
    function wsSendMessage(){
        webSocket.send(message.value);
        echoText.value += "Message sended to the server : " + message.value + "\n";
        message.value = "";
    }
    function wsCloseConnection(){
        webSocket.close();
    }
    function wsGetMessage(message){
        echoText.value += "Message received from to the server : " + message.data + "\n";
    }
    function wsClose(message){
        echoText.value += "Disconnect ... \n";
    }

    function wsError(message){
        echoText.value += "Error ..." + message.code +" \n";
    }


	function sendFile() {
		
	    var file = document.getElementById('file').files[0];
	    var reader = new FileReader();
	    var rawData = new ArrayBuffer(); 
		alert('send file: ' + file);
           
	    reader.loadend = function(e) {	
	    };
	
	    reader.onload = function(e) {
	        var rawData = e.target.result;
	        var byteArray = new Uint8Array(rawData);
	        var fileByteArray = [];
			
	        webSocket.send(byteArray.buffer);
			alert('file uploaded successfully');
	    };
	
	    reader.readAsArrayBuffer(file);
	}
package websocket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.JsonArray;

import java.io.InputStream;
import java.io.StringReader;
import java.sql.Blob;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.spi.JsonProvider;
import javax.sql.rowset.serial.SerialBlob;

import database.DB;
import model.message.Message;




@ApplicationScoped
@ServerEndpoint("/messages")
public class WebSocketServer 
{
	@Inject
	private DB db = new DB(); 
    @Inject
    private SessionHandler sessionHandler = new SessionHandler();
    
    @OnOpen
    public void open( Session session) 
    {   	
    	try  
        {
	    	sessionHandler.addSession(session);
        }
    	catch(Exception e)
    	{
    		System.out.println(e.toString());
    	}
    }
    	
	@OnClose
    public void close(Session session) 
	{
		sessionHandler.removeSession(session);
	}
	
	@OnError
    public void onError(Throwable error) 
	{
		Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
	}
	
	@OnMessage
    public void handleMessage(String stringMessage, Session session) 
	{
        try  
        {
        	JsonReader reader = Json.createReader(new StringReader(stringMessage));
            JsonObject jsonMessage = reader.readObject();
            String code 			= jsonMessage.getString("code");
            String user 			= jsonMessage.getString("user"); 
            String sender			= jsonMessage.getString("sender");
            String message			= jsonMessage.getString("message");
            String repliedTo		= jsonMessage.getString("repliedTo");
            String clicked			= jsonMessage.getString("clicked");
            
            
			JsonNumber dateString	= jsonMessage.getJsonNumber("date");
			JsonNumber offset		= jsonMessage.getJsonNumber("offset");
            
    		InputStream fileContent = null;
    		Blob blob 				= null;
    		byte[] data 			= null;
            
    		System.out.println("websocket >> code:" + code + " user:" + user + " sender: " + sender + " message: " + message + " date: " + dateString.longValue() + " offset: " + offset + " replied to: " + repliedTo);
            switch(code)
            {
            	//	link user to specific session
	            case "0":
	            {
	            	sessionHandler.linkUser2Session(jsonMessage.getString("sender"), session); 
	            	System.out.println("websocket >> link user: " + jsonMessage.getString("sender") + " to session: " + session.toString());
	            	break;
	            }
	            //	get all of the messages for a specific user 
	            case "1":
	            {
	            	List<String> messages 			= db.getUserMessages(sender);
	            	JsonProvider provider 			= JsonProvider.provider();
	            	JsonObjectBuilder job			= Json.createObjectBuilder();
	            	javax.json.JsonArray jArr		= Json.createArrayBuilder(messages).build(); 
	                JsonObject msg = (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jArr)
																				.build(); 
	            	sessionHandler.sendToSession(session, msg);
	            	break;
	            }
	            //	insert a new message into DB and send to user via session
	            case "2":
	            {
	                String image 	= jsonMessage.getString("image", ""); 
	                long date		= dateString.longValue();
	                int off	 		= offset.intValue();
	                
					if(image == null)
						db.insertMessage(new Message(sender, user, message, date, blob, off, repliedTo)); 
					
					else if(!image.equals(""))
					{
						System.out.println("websocket >> image source " + fileContent);		// TODO: erase if works
						data = image.getBytes();
						blob = new SerialBlob(data);
						db.insertMessage(new Message(sender, user, message, date, blob,  off, repliedTo));	
					}
					Session userSession = sessionHandler.getUserSession(user);
					System.out.println("websocket >> user session " + userSession);		// TODO: erase if works
					Message userMessage = new Message(sender, user, message, date, blob,  off, repliedTo);
					sessionHandler.sendToSession(userSession, userMessage); 
					
	            	break;
	            }
	            
	            case "3":
	            {
	            	break;
	            }
	            
	            default:
	            	break;
            }

            /*
            if ("add".equals(jsonMessage.getString("action"))) {
                Device device = new Device();
                device.setName(jsonMessage.getString("name"));
                device.setDescription(jsonMessage.getString("description"));
                device.setType(jsonMessage.getString("type"));
                device.setStatus("Off");
                sessionHandler.addDevice(device);
            }

            if ("remove".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.removeDevice(id);
            }

            if ("toggle".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.toggleDevice(id);
            }
            
            if ("addImage".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.toggleDevice(id);
            }
            */
        }
        catch(Exception e)
        {
        	System.out.println(e.toString());
        	e.printStackTrace();
        }
	}
	
}

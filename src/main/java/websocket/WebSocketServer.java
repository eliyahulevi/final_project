package websocket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.JsonArray;

import java.io.StringReader;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.spi.JsonProvider;

import database.DB;




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
    public void handleMessage(String message, Session session) 
	{
        try  
        {
        	JsonReader reader = Json.createReader(new StringReader(message));
            JsonObject jsonMessage = reader.readObject();
            String code = jsonMessage.getString("code");
            String user = jsonMessage.getString("sender"); 
            System.out.println("websocket >> code:" + code);
            
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
	            	List<String> messages 			= db.getUserMessages(user);
	            	JsonProvider provider 			= JsonProvider.provider();
	            	JsonObjectBuilder job			= Json.createObjectBuilder();
	            	javax.json.JsonArray jArr		= Json.createArrayBuilder(messages).build(); 
            		int i = 0;
	            	for(String str : messages)
	            	{
	            		JsonValue jmsg = (JsonValue)provider.createObjectBuilder().add("msg" + i, str).build();
	            		job.add("msg" + i, jmsg);
	            		//System.out.println("websocket >> " + jmsg);
	            		i++;
	            	}
	            	//System.out.println("websocket >> " + job);
	                JsonObject msg = (JsonObject) provider.createObjectBuilder().add("action", "messages")
																						 .add("src", jArr)
																						 .build(); 
	            	sessionHandler.sendToSession(session, msg);
	            	break;
	            }
	            //	insert a new message 
	            case "2":
	            {
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

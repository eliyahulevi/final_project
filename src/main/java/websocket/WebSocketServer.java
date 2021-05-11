package websocket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import model.device.*;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;



@ApplicationScoped
@ServerEndpoint("/messages")
public class WebSocketServer 
{
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
            String code =jsonMessage.getString("code"); 
            System.out.println("websocket >> code:" + code);
            
            switch(code)
            {
	            case "0":
	            {
	            	sessionHandler.linkUser2Session(jsonMessage.getString("sender"), session); 
	            	System.out.println("websocket >> link user: " + jsonMessage.getString("sender") + " to session: " + session.toString());
	            }
	            
	            case "1":
	            {
	            	
	            }
	            
	            case "2":
	            {
	            	
	            }
	            
	            case "3":
	            {
	            	
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

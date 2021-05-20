package websocket;


import javax.enterprise.context.ApplicationScoped;
import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.spi.JsonProvider;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
import javax.websocket.Session;

import org.apache.commons.io.FileUtils;

import model.device.*;
import model.message.Message;

import java.util.logging.Level;
import java.util.logging.Logger;




@ApplicationScoped
public class SessionHandler 
{
	int deviceId = 0;
    final Set<Session> sessions 		= new HashSet<>();
    final Set<Device> devices 			= new HashSet<>();
    static  Map<String, Session> map	= new HashMap<String, Session>();
    
    private JsonObject createAddMessage(Device device) 
    {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "add")
                .add("id", device.getId())
                .add("name", device.getName())
                .add("type", device.getType())
                .add("status", device.getStatus())
                .add("description", device.getDescription())
                .build();
        return addMessage;
    }
    
    public void addSession(Session session) 
    {
    	//session.getUserProperties().put("user", user);
        sessions.add(session);
        System.out.println("session handler >> number of sesions: " + sessions.size());
        System.out.println("session handler >> current session: " + session);
    	Blob blob;
		try 
		{
			String path = "C:\\Users\\shaha\\Documents\\github\\final_project\\src\\main\\java\\websocket\\mickey.png";
			String content = new String(Files.readAllBytes(Paths.get(path)));
			blob = new SerialBlob(content.getBytes());
			sendImage(session, blob);
		} 
		catch (SerialException e) 
		{
			e.printStackTrace();
		} catch (SQLException e) 
		{
			e.printStackTrace();
		} catch (IOException e) 
		{
			e.printStackTrace();
		}  
		
        //for (Device device : devices) {
            //JsonObject addMessage = createAddMessage(device);
            //sendToSession(session, addMessage);
        	
        //}
    }

    public void removeSession(Session session) 
    {
        sessions.remove(session);
    }
       
    public void sendImage(Session session, Blob img)
    {
        try 
        {
        	
        	//byte[] str = img.getBytes(1, (int)img.length()); 
			String path = "C:\\Users\\shaha\\Documents\\github\\final_project\\src\\main\\java\\websocket\\donald.png";
			//String content = new String(Files.readAllBytes(Paths.get(path)));
			
			byte[] fileContent = FileUtils.readFileToByteArray(new File(path));
			String encodedString = Base64.getEncoder().encodeToString(fileContent);
        	//String encodedString = Base64.getEncoder().encodeToString(str);
			
        	JsonProvider provider = JsonProvider.provider();
            //String base64Image = Base64.getEncoder().encodeToString(content.getBytes());
            JsonObject jimg = (JsonObject) provider.createObjectBuilder().add("action", "image")
																		 .add("src", encodedString)
																		 .build(); 
            //ByteBuffer buf = ByteBuffer.wrap(base64Image.getBytes());
            //sendToSession(session, jimg);
            System.out.println("websocket >> sending image..");
            session.getBasicRemote().sendText(jimg.toString());
            //session.getBasicRemote().sendBinary(buf); 
        } 
        catch (Exception e )
        {
            System.out.println("Error: "+e.getMessage());
        }
    }
    
    public void linkUser2Session(String name, Session session)
    {
    	map.put(name, session);
    	System.out.println("session handler >> user-sessions map: " + map);		// TODO: erase if works
    }
    
    private void sendToAllConnectedSessions(JsonObject message) 
    {
    	for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    public void sendToSession(Session session, JsonObject message) 
    {
    	try 
    	{
            session.getBasicRemote().sendText(message.toString());
            //session.getBasicRemote().sendBinary(message); 
        } 
    	catch (IOException ex) 
    	{
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    public void sendToSession(Session session, JsonArray message) 
    {
    	try 
    	{
            session.getBasicRemote().sendText(message.toString());
            //session.getBasicRemote().sendBinary(message); 
        } 
    	catch (IOException ex) 
    	{
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    public void sendToSession(Session session, Message message) 
    {
    	try 
    	{
    		String msgString = message.toJson();
    		System.out.println("SessionHandler >> sent message to session: " + msgString);
        	JsonProvider provider 	= JsonProvider.provider();
            JsonObject jsonMessage 	= (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				 .add("src", msgString)
																				 .build(); 
            session.getBasicRemote().sendText(jsonMessage.toString());
        } 
    	catch (IOException ex) 
    	{
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public Session getUserSession(String user)
    {
    	Session result = null;
    	
    	try
    	{
    		for (Session session : sessions) {
    			System.out.println("session handler >> session id: " + session.getId());	
            }
    		result = map.get(user);
    		System.out.println("session handler >> all sessions: " + sessions);						// TODO: erase if works
    		System.out.println("session handler >> session for user: " + user + " is " + result);	// TODO: erase if works
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    	}
    	
    	return result;
    }
}

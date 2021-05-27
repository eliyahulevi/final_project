package webapp.sockets;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.InstanceCreator;
import com.google.gson.JsonArray;

import java.io.InputStream;
import java.io.StringReader;
import java.lang.annotation.Repeatable;
import java.lang.reflect.Type;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
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
import javax.servlet.annotation.MultipartConfig;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import database.DB;
import model.message.Message;
import websocket.SessionHandler;
import websocket.WebSocketServer;




@ApplicationScoped
@ServerEndpoint("/messages2")
@MultipartConfig
public class WebSocket 
{
	private DB db = new DB(); 
    @Inject
    private SessionHandler  sh 			= new SessionHandler();
    private GsonBuilder		gsonBuilder	= new GsonBuilder();	
    
    private class MessageContext implements InstanceCreator<Message>
    {
    	Blob blob;
    	
    	public MessageContext(String b)
    	{
    		try 
    		{
				this.blob = new SerialBlob(b.getBytes());
			} 
    		catch (SQLException e) 
    		{
				e.printStackTrace();
			} 
    	}
    	
		@Override
		public Message createInstance(Type type) {
			Message message = new Message();
			return message;
		}
    	
    }
    
    @OnOpen
    public void open( Session session) 
    {   	
    	try  
        {
	    	sh.addSession(session);
        }
    	catch(Exception e)
    	{
    		System.out.println(e.toString());
    	}
    }
    	
	@OnClose
    public void close(Session session) 
	{
		sh.removeSession(session);
	}
	
	@OnError
    public void onError(Throwable error) 
	{
		Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
	}
	
	/*
	@OnMessage
    public void onTextMessage(Session session, String stringMessage) 
	{
		//gsonBuilder.registerTypeAdapter(Message.class, new MessageContext(stringMessage)); 
		Gson customGson				= gsonBuilder.create();
		Gson gson					= new Gson();
		Message m					= gson.fromJson(stringMessage, Message.class);
		m.print();
		
        try  
        {
        	System.out.println("websocket2 >> incomming message: " + stringMessage);
        	JSONObject obj 			= new JSONObject(stringMessage);
        	String code				= obj.getString("code");
        	String user 			= obj.getString("user");
        	String sender 			= obj.getString("sender");
        	String message 			= obj.getString("message");
        	String repliedTo 		= obj.optString("repliedTo", "");
        	String clicked 			= obj.getString("clicked");
        	String image 			= obj.getString("image");
        	long date 				= obj.getLong("date");
        	int offset 				= obj.getInt("offset");
        	//JSONObject bytes		= obj.getJSONObject("image");

            
    		InputStream fileContent = null;
    		byte[] data 			= null;
            
    		System.out.println("websocket2 >> incomming message: \ncode:" + code + "\nuser:" + user + "\nsender: " + sender + "\nmessage: " + message + "\nimage: " + image + "\ndate: " + date + "\noffset: " + offset + "\nreplied to: " + repliedTo + "\n\n");
            switch(code)
            {
            	//	link user to specific session
	            case "0":
	            {
	            	sh.linkUser2Session(obj.getString("sender"), session); 
	            	System.out.println("websocket2 >> link user: " + obj.getString("sender") + " to session: " + session.toString());
	            	break;
	            }
	            //	get all of the messages for a specific user 
	            case "1":
	            {
	            	List<String> messages 			= db.getUserMessages(sender);
	            	JsonProvider provider 			= JsonProvider.provider();
	            	javax.json.JsonArray jArr		= Json.createArrayBuilder(messages).build(); 
	                JsonObject msg = (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jArr)
																				.build(); 
	            	sh.sendToSession(session, msg.toString());
	            	break;
	            }
	            //	insert a new message into DB and send to user via session
	            case "2":
	            {
	            	// TODO: 	try to send blob to server, and then pull all messages to client
            		//			according to session
	            	
	                //String image 			= obj.getString("image"); 
	                //long date				= dateString.longValue();
	                //int off	 				= offset.intValue();
	            	Blob blob = null;//				= (Blob)jblob;				
	                JsonProvider provider 	= JsonProvider.provider();
	                List<String> messages	= new ArrayList<String>();
	                JSONArray array			= new JSONArray();
	                javax.json.JsonArray jArr;
	                if(repliedTo == "") 
	                	repliedTo = null;
	                /*
					if(image == null)
					{
						System.out.println("websocket2 >> no image source " + image);		// TODO: erase if works
						db.insertMessage(new Message(sender, user, message, date, blob, offset, repliedTo)); 
					}
					else if(image.equals(""))
					{
						System.out.println("websocket2 >> image empty " + image);			// TODO: erase if works
					}
					else if(!image.equals(""))
					{
						System.out.println("websocket2 >> image source " + fileContent);	// TODO: erase if works
						data = image.getBytes();
						blob = new SerialBlob(data);
						db.insertMessage(new Message(sender, user, message, date, blob,  offset, repliedTo));	
					}
					*
					Session userSession = sh.getUserSession(user);
					System.out.println("websocket2 >> user session " + userSession);		// TODO: erase if works
					Message userMessage = new Message(sender, user, message, date, blob,  offset, repliedTo);
					JSONObject msg		= new JSONObject();
					array.put(userMessage.toJson());
					msg.put("action", "messages");
					msg.put("src", array);
					
					sh.sendToSession(userSession, msg.toString()); 
					
	            	break;
	            }
	            
	            case "3":
	            {
	            	break;
	            }
	            
	            default:
	            	break;
            }
        }
        catch(Exception e)
        {
        	System.out.println(e.toString());
        	e.printStackTrace();
        }
	}
*/
	
	@OnMessage(maxMessageSize = 1024000)
	public void onBinaryMessage(Session session, byte[] rawMessage)
	{
		String msgString 		= new String(rawMessage, StandardCharsets.UTF_8);
    	JSONObject jsonMessage 	= new JSONObject(msgString);
    	String code				= jsonMessage.getString("code");
        String user 			= jsonMessage.getString("user"); 
        String sender			= jsonMessage.getString("sender");
        String message			= jsonMessage.getString("message");
        String repliedTo		= jsonMessage.getString("repliedTo");
        String clicked			= jsonMessage.getString("clicked");
        long date				= jsonMessage.getLong("date");
		int offset				= jsonMessage.getInt("offset");
		byte[] data				= null;
		Blob blob				= null;
    	
		try 
		{
			if("".equals(repliedTo)) repliedTo = null;
			System.out.println("websocket >> code:" 		+ code + 
											" user:" 		+ user + 
											" sender: " 	+ sender + 
											" message: " 	+ message + 
											" date: " 		+ date + 
											" offset: " 	+ offset + 
											" replied to: " + repliedTo);
		  	/*
			Blob blob	= new SerialBlob(image);
			*/
			
			switch(code)
            {
            	//	link user to specific session
	            case "0":
	            {
	            	sh.linkUser2Session(jsonMessage.getString("sender"), session); 
	            	System.out.println("websocket >> link user: " + jsonMessage.getString("sender") + " to session: " + session.toString());
	            	break;
	            }
	            //	get all of the messages for a specific user 
	            case "1":
	            {
	            	List<String> messages 			= db.getUserMessages(sender);
	            	JsonProvider provider 			= JsonProvider.provider();
	            	javax.json.JsonArray jArr		= Json.createArrayBuilder(messages).build(); 
	                JsonObject msg = (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jArr)
																				.build(); 
	            	//sh.sendToSession(session, msg);
	            	break;
	            }
	            //	insert a new message into DB and send to user via session
	            case "2":
	            {
	            	javax.json.JsonArray jArr;
	                JsonProvider provider 	= JsonProvider.provider();
	                List<String> messages	= new ArrayList<String>();
	                int imageIdxOffset		= "image\\':[\\'".length();
	                int imageIdx			= msgString.indexOf("image");
	                int offsetIdx			= msgString.indexOf("offset");
	                String image			= msgString.substring(imageIdx + imageIdxOffset, offsetIdx);
	                
					if(image == null)
					{
						System.out.println("websocket >> no image source " + image);		// TODO: erase if works
						db.insertMessage(new Message(sender, user, message, date, blob, offset, repliedTo)); 
					}
					else if(image.equals(""))
					{
						System.out.println("websocket >> image empty " + image);		// TODO: erase if works
						db.insertMessage(new Message(sender, user, message, date, blob, offset, repliedTo)); 
					}
					else if(!image.equals(""))
					{
						//System.out.println("websocket >> image source " + fileContent);		// TODO: erase if works
						data = image.getBytes();
						blob = new SerialBlob(data);
						db.insertMessage(new Message(sender, user, message, date, blob,  offset, repliedTo));	
					}
					Session userSession = sh.getUserSession(user);
					System.out.println("websocket >> user session " + userSession);		// TODO: erase if works
					Message userMessage = new Message(sender, user, message, date, blob,  offset, repliedTo);
					messages.add(userMessage.toJson());
	            	jArr = Json.createArrayBuilder(messages).build(); 
	                JsonObject msg = (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jArr)
																				.build(); 
					//sh.sendToSession(userSession, msg); 
					
	            	break;
	            }
	            
	            case "3":
	            {
	            	break;
	            }
	            
	            default:
	            	break;
            }
			
		} 
		catch (SerialException e) 
		{
			e.printStackTrace();
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		

		System.out.println("websocket2 >> binary message: blob created" );
		
		
	}
	
}

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
@MultipartConfig(maxRequestSize = 209715200)
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
        boolean clicked			= jsonMessage.getBoolean("clicked");
        String display			= jsonMessage.getString("display");
        long date				= jsonMessage.getLong("date");
		int offset				= jsonMessage.getInt("offset");
		byte[] data				= null;
		Blob blob				= null;
		Session userSession;
		List<String> messages;
		JsonProvider provider;
		javax.json.JsonArray jsonArray;
		JsonObject msg;
		
		try 
		{
			if("".equals(repliedTo)) repliedTo = null;
			
			
			System.out.printf("%n%-15s %s", "websocket>>", "incomming message:"); 
			System.out.printf("%n%-15s %s",	"", "code: " 		+ code); 
			System.out.printf("%n%-15s %s",	"", "user: " 		+ user); 
			System.out.printf("%n%-15s %s",	"", "sender: "		+ sender); 
			System.out.printf("%n%-15s %s",	"", "message: " 	+ message); 
			System.out.printf("%n%-15s %n",	"", "date: " 		+ date);
			System.out.printf("%n%-15s %n",	"", "clicked: " 	+ clicked); 
			System.out.printf("%n%-15s %s",	"", "offset: " 		+ offset);
			System.out.printf("%n%-15s %s",	"", "replied to: " 	+ repliedTo);
			System.out.printf("%n%-15s %s",	"", "display: " 	+ display);
			
			switch(code)
            {
            	
	            case "0":		//	link user to specific session
	            {
	            	sh.linkUser2Session(jsonMessage.getString("sender"), session); 
	            	System.out.printf("%n%-15s %s", "websocket>>", "link user: " + jsonMessage.getString("sender") + " to session: " + session.toString());
	            	break;
	            }
	            //	get all of the messages for a specific user 
	            case "1":
	            {
	            	messages 	= db.getUserMessages(sender);
	            	provider 	= JsonProvider.provider();
	            	jsonArray	= Json.createArrayBuilder(messages).build(); 
	            	msg 		= (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jsonArray)
																				.build(); 
	            	sh.sendToSession(session, msg);
	            	break;
	            }
	            
	            case "2":		//	insert a new message into DB and send to user via session
	            {
	            	
	                provider 			= JsonProvider.provider();
	                messages			= new ArrayList<String>();
	                int imageIdxOffset	= "image:[".length();
	                int imageIdx		= msgString.indexOf("image");
	                int offsetIdx		= msgString.indexOf("offset");
	                String image		= msgString.substring(imageIdx + imageIdxOffset, offsetIdx);
	                
					if(image == null)
					{
						System.out.printf("%n%-15s %s", "websocket>>", "no image source " + image);		// TODO: erase if works
						db.insertMessage(new Message(sender, user, message, date, blob, offset, repliedTo)); 
					}
					else if(image.equals(""))
					{
						System.out.printf("%n%-15s %s", "websocket>>", "image empty " + image);		// TODO: erase if works
						db.insertMessage(new Message(sender, user, message, date, blob, offset, repliedTo)); 
					}
					else if(!image.equals(""))
					{
						System.out.printf("%n%-15s %s", "websocket>>", "image source " + image);		// TODO: erase if works
						data = image.getBytes();
						blob = new SerialBlob(data);
						db.insertMessage(new Message(sender, user, message, date, blob,  offset, repliedTo, ""));	
					}
					userSession = sh.getUserSession(user);
					Session senderSession = sh.getUserSession(sender);
					System.out.printf("%n%-15s %s", "websocket>>", "user session " + userSession);		// TODO: erase if works
					Message userMessage = new Message(sender, user, message, date, blob,  offset, repliedTo, "");
					messages.add(userMessage.toJson());
					jsonArray = Json.createArrayBuilder(messages).build(); 
	                msg = (JsonObject) provider.createObjectBuilder().add("action", "message")
																				.add("src", jsonArray)
																				.build(); 
					sh.sendToSession(userSession, msg);
					sh.sendToSession(senderSession, msg); 
	            	break;
	            }
	            
	            case "3":		// hide message
	            {
	            	//System.out.printf("%n%-15s %s", "websocket>>", "delete message for user" + user + " and date: " + date);		// TODO: erase if works
	            	db.messageHide(user, sender, date);
	            	break;
	            }
	            
	            case "4":		// reset display field in all messages
	            {
	            	int result = -1;
	            	//System.out.printf("%n%-15s %s", "websocket>>", "delete message for user" + user + " and date: " + date);		// TODO: erase if works
	            	result		= db.messageReset(user);
	            	userSession	= sh.getUserSession(user);
	            	messages 	= db.getUserMessages1(sender);
	                provider 	= JsonProvider.provider();
	            	jsonArray	= Json.createArrayBuilder(messages).build(); 
	            	
			        msg 		= (JsonObject) provider.createObjectBuilder().add("action", "message")
									.add("src", jsonArray)
									.build(); 
			        if( result < 0 ) 
			        	System.out.printf("%n%-15s %s", "websocket>>", "no messages");		// TODO: erase if works
	            	sh.sendToSession(userSession, msg);
	            	break;
	            }
	            
	            case "5":		// user outgoing messages
	            {
	            	//System.out.printf("%n%-15s %s", "websocket>>", "delete message for user" + user + " and date: " + date);		// TODO: erase if works
	            	System.out.println("websocket >> outgoing messages for: " + user);		// TODO: erase if works
	            	messages 	= db.outgoingMessages(user);
	            	provider 	= JsonProvider.provider();
	            	jsonArray	= Json.createArrayBuilder(messages).build(); 
	                msg 		= (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jsonArray)
																				.build(); 
	            	sh.sendToSession(session, msg);
	            	break;
	            }
	            
	            case "6":		//	user incoming messages sorted by users
	            {
	            	//System.out.printf("%n%-15s %s", "websocket>>", "delete message for user" + user + " and date: " + date);		// TODO: erase if works
	            	System.out.println("websocket >> outgoing messages for: " + user);		// TODO: erase if works
	            	messages 	= db.incomingMessages(user, sender);
	            	provider 	= JsonProvider.provider();
	            	jsonArray	= Json.createArrayBuilder(messages).build(); 
	                msg 		= (JsonObject) provider.createObjectBuilder().add("action", "messages")
																				.add("src", jsonArray)
																				.build(); 
	            	sh.sendToSession(session, msg);
	            	break;
	            }
	            
	            default:
	            	break;
            }
			
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	
}

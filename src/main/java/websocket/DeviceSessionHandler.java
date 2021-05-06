package websocket;


import javax.enterprise.context.ApplicationScoped;
import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
import javax.websocket.Session;

import org.apache.commons.io.FileUtils;

import model.device.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationScoped
public class DeviceSessionHandler 
{
	private int deviceId = 0;
    private final Set<Session> sessions = new HashSet<>();
    private final Set<Device> devices = new HashSet<>();
    
    public void addSession(Session session) 
    {
        sessions.add(session);
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
    
    public List<Device> getDevices() 
    {
        return new ArrayList<>(devices);
    }

    public void sendImage(int id)
    {
    	Device device = getDeviceById(id);
        if (device != null) 
        {
        	/*
			byte[] fileContent = FileUtils.readFileToByteArray(new File(path));
			String encodedString = Base64.getEncoder().encodeToString(fileContent);
			
        	JsonProvider provider = JsonProvider.provider();
            //String base64Image = Base64.getEncoder().encodeToString(content.getBytes());
            JsonObject jimg = (JsonObject) provider.createObjectBuilder().add("action", "image")
																		 .add("src", encodedString)
																		 .build(); 
            //ByteBuffer buf = ByteBuffer.wrap(base64Image.getBytes());
            sendToSession(session, jimg); 
            */
        }
    }
    
    public void addDevice(Device device) 
    {
        device.setId(deviceId);
        devices.add(device);
        deviceId++;
        JsonObject addMessage = createAddMessage(device);
        sendToAllConnectedSessions(addMessage);
        
    }

    public void removeDevice(int id) 
    {
        Device device = getDeviceById(id);
        if (device != null) {
            devices.remove(device);
            JsonProvider provider = JsonProvider.provider();
            JsonObject removeMessage = provider.createObjectBuilder()
                    .add("action", "remove")
                    .add("id", id)
                    .build();
            sendToAllConnectedSessions(removeMessage);
        }
    }

    public void toggleDevice(int id) 
    {
        JsonProvider provider = JsonProvider.provider();
        Device device = getDeviceById(id);
        if (device != null) {
            if ("On".equals(device.getStatus())) {
                device.setStatus("Off");
            } else {
                device.setStatus("On");
            }
            JsonObject updateDevMessage = provider.createObjectBuilder()
                    .add("action", "toggle")
                    .add("id", device.getId())
                    .add("status", device.getStatus())
                    .build();
            sendToAllConnectedSessions(updateDevMessage);
        }
    }

    public void sendImage(Session session, Blob img)
    {
        try 
        {
        	
        	byte[] str = img.getBytes(1, (int)img.length()); 
			//String path = "C:\\Users\\shaha\\Documents\\github\\final_project\\src\\main\\java\\websocket\\donald.png";
			//String content = new String(Files.readAllBytes(Paths.get(path)));
			
			//byte[] fileContent = FileUtils.readFileToByteArray(new File(path));
			//String encodedString = Base64.getEncoder().encodeToString(fileContent);
        	String encodedString = Base64.getEncoder().encodeToString(str);
			
        	JsonProvider provider = JsonProvider.provider();
            //String base64Image = Base64.getEncoder().encodeToString(content.getBytes());
            JsonObject jimg = (JsonObject) provider.createObjectBuilder().add("action", "image")
																		 .add("src", encodedString)
																		 .build(); 
            //ByteBuffer buf = ByteBuffer.wrap(base64Image.getBytes());
            sendToSession(session, jimg); 
            //session.getBasicRemote().sendBinary(buf); 
        } 
        catch (Exception e )
        {
            System.out.println("Error: "+e.getMessage());
        }
    }
    
    private Device getDeviceById(int id) 
    {
    	for (Device device : devices) {
            if (device.getId() == id) {
                return device;
            }
        }
        return null;
    }

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

    private void sendToAllConnectedSessions(JsonObject message) 
    {
    	for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    private void sendToSession(Session session, JsonObject message) 
    {
    	try 
    	{
            session.getBasicRemote().sendText(message.toString());
            //session.getBasicRemote().sendBinary(message); 
        } 
    	catch (IOException ex) 
    	{
            sessions.remove(session);
            Logger.getLogger(DeviceSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}

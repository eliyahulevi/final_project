package model.message;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.sql.rowset.serial.SerialException;

import org.json.simple.JSONValue;




public class Message 
{
	int 		code;
	String 		user;
	String 		sender;
	String 		message;
	long 		date;
	Blob 		image;
	boolean 	clicked;
	int 		offset;
	String 		repliedTo;
	boolean 	display;
	public static String WELCOME = "Welcome to the LumberYard !! please feel free to ask any question @SUPPORT";
	
	public Message() {}
	public Message(String sender, String user, String msg, long date, Blob img, int offset, String repliedto)
	{
		this.sender 		= sender;
		this.user 			= user;
		this.message 		= msg;
		this.date 			= date;
		this.image 			= img;
		this.clicked 		= false;
		this.offset 		= offset;
		this.repliedTo 		= repliedto;
	}
	public Message(String sender, String user, String msg, long date, Blob img, int offset, String repliedto, boolean display)
	{
		this.sender 		= sender;
		this.user 			= user;
		this.message 		= msg;
		this.date 			= date;
		this.image 			= img;
		this.clicked 		= false;
		this.offset 		= offset;
		this.repliedTo 		= repliedto;
		this.display		= display;
	}
	public Message(String sender, String user, String msg, long date, String img, int offset, String repliedto, boolean display)
	{
		this.sender 		= sender;
		this.user 			= user;
		this.message 		= msg;
		this.date 			= date;
		this.clicked 		= false;
		this.offset 		= offset;
		this.repliedTo 		= repliedto;
		Blob blob 			= null;
		this.display 		= display;
		try {
			blob = new javax.sql.rowset.serial.SerialBlob(img.getBytes());
		} catch (SerialException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		this.image = blob;
	}
	public Message(String sender, String user, String msg, long date, String img, int offset, String repliedto)
	{
		this.sender 		= sender;
		this.user 			= user;
		this.message 		= msg;
		this.date 			= date;
		this.clicked 		= false;
		this.offset 		= offset;
		this.repliedTo 		= repliedto;
		
		Blob blob 			= null;
		try {
			blob = new javax.sql.rowset.serial.SerialBlob(img.getBytes());
		} catch (SerialException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		this.image = blob;
	}
	
	public void print()
	{
		System.out.printf("%-15s%n", "message details:");
		System.out.printf("%-15s %s%n", "\ncode: ", this.code);
		System.out.printf("%-15s %s%n", "\nuser: ", this.user);
		System.out.printf("%-15s %s%n", "\nsender: ", this.sender);
		System.out.printf("%-15s %s%n", "\nmessage:", this.message); 
		System.out.printf("%-15s %s%n", "\ndate: ", this.date); 
		System.out.printf("%-15s %s%n", "\nimage: ", this.image); 
		System.out.printf("%-15s %s%n", "\nclicked: ", this.clicked); 
		System.out.printf("%-15s %s%n", "\noffset: ", this.offset); 
		System.out.printf("%-15s %s%n", "\nrepliy to: ", this.repliedTo);
		System.out.printf("%-15s %s%n", "\ndisplayed: ", this.display);
		/*
		Field[] fields		= this.getClass().getDeclaredFields();
		System.out.println("Message >> print message:");
		try 
		{
			for( Field f : fields)
			{
				System.out.println(f.getName() + ": " + (f.get(Message.class)).toString());
			}
		} 
		catch (IllegalArgumentException e) {
			e.printStackTrace();
		} 
		catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		System.out.println("Message >> print message:");
		*/
	}
	public String toJson()
	{
		String result 		= "";
		StringBuilder sb 	= new StringBuilder();
		
		/*
        Field[] fields = this.getClass().getDeclaredFields();
        System.out.printf("%d fields:%n", fields.length);
        length = fields.length;
        */

		Blob blob = this.getImage();
		Map<String,String> map = new HashMap<String,String>();
		System.out.println("Message >> " + this.getUser());
		try
		{
			map.put("user", this.getUser());
			map.put("sender", this.getSender());
			map.put("date", Long.toString(this.getDate()));
			map.put("message", this.getMessage());	
			map.put("clicked", String.valueOf(this.getClicked()));
			map.put("offset", String.valueOf(this.getOffset()));
			map.put("repliedTo", String.valueOf(this.getRepliedTo()));
			if(blob == null)
				map.put("image", "");
			else 
				map.put("image", new String(blob.getBytes(1, (int)blob.length())));
		}
		catch(Exception e)
		{
			e.printStackTrace();
		} 
		
		result = JSONValue.toJSONString(map);
		return result;
        	/*
	        sb.append("{");
	        for (int i = 0; i < length - 1; i++) 
	        {
	        	String fieldValue = "";
	        	Object f = fields[i].get(this);
	        	if( f == null )
	            	fieldValue = "no data";
	        	else
	        		fieldValue = f.toString();
	        	sb.append(quotationMark + fields[i].getName() + quotationMark + " : " + quotationMark + fieldValue + quotationMark);
	        	if( i < length - 2)
	        		sb.append(", ");
	        }
	        sb.append("}");
	        result = sb.toString();
	        System.out.println("Message >> " + sb);
	        */

	}
	
	/*
	 *  getters-setter
	 */
	public void setMessage(String msg) { this.message = msg;}
	public void setSender(String s) { this.sender = s; }
	public void setDate(long d) { this.date = d; }
	public void setUser(String u) { this.user = u;}
	public void setCode(int i) { this.code = i; }
	public void setImage(Blob b) { this.image = b; }
	public void setClicked(boolean b) { this.clicked = b; }
	public void setOffset(int i) { this.offset = i; }
	public void setRepliedTo(String s) { this.repliedTo = s; }
	public void setDisplay(boolean b) { this.display = b; }

	public int getCode() { return this.code; }
	public String getUser() { return this.user;}
	public String getSender() { return this.sender;}
	public long getDate() { return this.date;}
	public String getMessage() { return this.message; }
	public Blob getImage() { return this.image; }
	public boolean getClicked() { return this.clicked; }
	public int getOffset() { return this.offset; } 
	public String getRepliedTo() { return this.repliedTo; }
	public boolean getDisplay() { return this.display; }

}

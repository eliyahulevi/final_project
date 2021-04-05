package model.message;

import java.sql.Blob;




public class Message 
{
	int code;
	String user;
	String sender;
	String message;
	String date;
	Blob image;
	boolean clicked;
	public static String WELCOME = "Welcome to the LumberYard !! please feel free to ask any question @SUPPORT";
	
	public Message() {}
	public Message(String sender, String user, String msg, String date, Blob img)
	{
		this.sender = sender;
		this.user = user;
		this.message = msg;
		this.date = date;
		this.image = img;
		this.clicked = false;
	}
	
	/*
	 *  getters-setter
	 */
	public void setMessage(String msg) { this.message = msg;}
	public void setSender(String s) { this.sender = s; }
	public void setDate(String d) { this.date = d; }
	public void setUser(String u) { this.user = u;}
	public void setCode(int i) { this.code = i; }
	public void setImage(Blob b) { this.image = b; }
	public void setClicked(boolean b) { this.clicked = b; }

	public int getCode() { return this.code; }
	public String getUser() { return this.user;}
	public String getSender() { return this.sender;}
	public String getDate() { return this.date;}
	public String getMessage() { return this.message; }
	public Blob getImage() { return this.image; }
	public boolean getClicked() { return this.clicked; } 


}

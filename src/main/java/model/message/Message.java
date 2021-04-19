package model.message;

import java.sql.Blob;




public class Message 
{
	int code;
	String user;
	String sender;
	String message;
	long date;
	Blob image;
	boolean clicked;
	int offset;
	String repliedTo;
	public static String WELCOME = "Welcome to the LumberYard !! please feel free to ask any question @SUPPORT";
	
	public Message() {}
	public Message(String sender, String user, String msg, long date, Blob img, int offset, String repliedto)
	{
		this.sender = sender;
		this.user = user;
		this.message = msg;
		this.date = date;
		this.image = img;
		this.clicked = false;
		this.offset = offset;
		this.repliedTo = repliedto;
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

	public int getCode() { return this.code; }
	public String getUser() { return this.user;}
	public String getSender() { return this.sender;}
	public long getDate() { return this.date;}
	public String getMessage() { return this.message; }
	public Blob getImage() { return this.image; }
	public boolean getClicked() { return this.clicked; }
	public int getOffset() { return this.offset; } 
	public String getRepliedTo() { return this.repliedTo; }

}

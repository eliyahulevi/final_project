package model.message;

import java.sql.Blob;

import org.json.simple.JSONObject;

public class Message 
{

	int code;
	String user;
	String message;
	Blob image;
	
	public Message() {}
	public Message(int code, String user, String msg, Blob img)
	{
		this.code = code;
		this.user = user;
		this.message = msg;
		this.image = img;
	}
	
	/*
	 *  getters-setter
	 */
	public void setMessage(String msg) { this.message = msg;}
	public void setUser(String u) { this.user = u;}
	public void setCode(int c) { this.code = c;}
	public String getUser() { return this.user;}
	public String getMessage() { return this.message; }
	public int getCode() { return this.code; }
	public Blob getImage() { return this.image; }

}

package model.message;

public class Message 
{

	int code;
	String user;
	String message;
	
	public Message() {}
	public Message(int code, String user, String msg)
	{
		this.code = code;
		this.user = user;
		this.message = msg;
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

}

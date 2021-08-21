package model.users;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.sql.rowset.serial.SerialException;

import org.json.simple.JSONValue;

public class User 
{
	private String name;
	private String nickName;
	private String email;
	private String phone;
	private String address;
	private String password; 
	private String description;
	private Blob photo;
	int Age;
	
	public User() {}
	
	public User(String name, String password, String nickName, String address, Blob photo, String email, String desc)
	{
		this.setName(name);
		this.setEmail(email);
		this.setAddress(address); 
		this.setPassword(password);
		this.setNickName(nickName);
		this.setAddress(address);
		this.setPhoto(photo);
	}
	
	public User(String name, String password, String nickName, String address, String photo, String email, String description, String phone)
	{
		this.setName(name);
		this.setEmail(email);
		this.setAddress(address); 
		this.setPassword(password);
		this.setNickName(nickName);
		this.setPhone(phone); 
		this.setDescription(description);
		Blob blob 			= null;
		try {
			blob = new javax.sql.rowset.serial.SerialBlob(photo.getBytes());
		} catch (SerialException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		this.photo = blob;
	}
	
	/**
	 * prints the User class fiels to console
	 * @return null
	 */
	public void print()
	{
		System.out.printf("%-15s %s%n", "\nuser class>>", "print");
		System.out.printf("%-15s %s%n", "user >>", "print");
		System.out.printf("%-15s %s%n", "user name: ", this.name);
		System.out.printf("%-15s %s%n", "nick name: ", this.nickName);
		System.out.printf("%-15s %s%n", "email: ", this.email);
		System.out.printf("%-15s %s%n", "phone: ", this.phone);
		System.out.printf("%-15s %s%n", "address: ", this.address);
		System.out.printf("%-15s %s%n", "password: ", this.password);
		System.out.printf("%-15s %s%n", "description: ", this.description);
	}
	
	/**
	 * convert the User class to Json string object
	 * @return	result, String, the json object built
	 */
	public String toJson()
	{
		String result = "";
		Blob blob = this.getPhoto();
		Map<String,String> map = new HashMap<String,String>();
		try
		{
			map.put("name", this.name);
			map.put("nickname", this.nickName);
			map.put("email", this.email);
			map.put("phone", this.phone);	
			map.put("address", this.address);
			map.put("password", this.password);
			map.put("description", this.description);
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
	}
	
	/*
	 * getters-setters *
	 */
	public String getName()						{ return name; }	
	public String getEmail() 					{ return email; }
	public String getPhone() 					{ return phone; }
	public String getAddress() 					{ return address; }
	public String getPassword() 				{ return password; }
	public String getNickName() 				{ return nickName; }
	public String getDescription() 				{ return description; }
	public Blob getPhoto() 						{ return this.photo; }
	
	public void setName(String name) 			{ this.name = name; }
	public void setEmail(String email) 			{ this.email = email; }
	public void setPhone(String phone) 			{ this.phone = phone; }
	public void setAddress(String address) 		{ this.address = address;	}
	public void setPassword(String password) 	{ this.password = password; }
	public void setNickName(String nickName) 	{ this.nickName = nickName; }
	public void setPhoto(Blob photo) 			{ this.photo = photo; }
	public void setDescription(String description) { this.description = description; }
	
}

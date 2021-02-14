package model.users;

import appConstants.AppConstants;

public class User 
{
	private String name;
	private String nickName;
	private String email;
	private String phone;
	private String address;
	private String password; 
	private String description = "";
	int Age;
	
	public User() {}
	public User(String name, String password, String nickName, String email, String address)
	{
		this.setName(name);
		this.setEmail(email);
		this.setAddress(address); 
		this.setPassword(password);
		this.setNickName(nickName);
	}
	public User(String name, String password, String nickName, String email, String address, String phone, String... description )
	{
		this.setName(name);
		this.setEmail(email);
		this.setAddress(address); 
		this.setPassword(password);
		this.setNickName(nickName);
		this.setPhone(phone); 
		this.setDescription(description[0]);
	}
	
	
	/*
	 * getters-setters *
	 */
	public String getName() 
	{
		return name;
	}
	public void setName(String name) 
	{
		this.name = name;
	}
	public String getEmail() 
	{
		return email;
	}
	public void setEmail(String email) 
	{
		this.email = email;
	}
	public String getPhone() 
	{
		return phone;
	}
	public void setPhone(String phone) 
	{
		this.phone = phone;
	}
	public String getAddress() 
	{
		return address;
	}
	public void setAddress(String address) 
	{
		this.address = address;
	}
	public String getPassword() 
	{
		return password;
	}
	public void setPassword(String password) 
	{
		this.password = password;
	}
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getPhoto() {
		// TODO figure this out
		return null;
	}
	
}

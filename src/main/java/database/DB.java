/**
 * 
 */
package database;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.users.*;

/**
 * @author shahar
 *
 */
public class DB 
{
	String dbURL;
	String[] TABLES_STR  = {"USERS","MESSAGES"};
	PreparedStatement prepStatement;
	Statement statement;
	Connection connection;
	ResultSet rs;
	User user = new User();
	
	//sql statements
	public final String CREATE_USERS_TABLE = "CREATE TABLE USERS(" 
			+ "USERNAME varchar(30),"
			+ "PASSWORD varchar(8),"
			+ "NICKNAME varchar(30),"
			+ "ADDRESS varchar(50),"
			+ "PHOTO varchar(100),"
			+ "PRIMARY KEY(USERNAME)"
			+ ")";
	public final String CREATE_MESSAGE_TABLE = "CREATE TABLE MESSAGE("
			+ "PHOTO varchar(100) PRIMARY KEY,"
			+ "NICKNAME varchar(20),"
			+ "TIME timestamp,"
			+ "CONTENT varchar(500),"
			+ "REPLYABLE char)"; 
	public final String CREATE_CHANNEL_TABLE = "CREATE TABLE CHANNEL("
			+ "NAME varchar(30),"
			+ "DESCRIPTION varchar(500)"
			+ ")";
	public String INSERT_USER = 		"INSERT INTO USERS VALUES (?, ?, ?, ?, ?)";
	public String SELECT_USER = 		"SELECT * FROM USERS";
	public String SELECT_USERS = 		"SELECT * FROM USERS WHERE USERNAME=?";
	
	/**
	 * constructor *
	 */
	// default 
	public DB() {}
	public DB(Connection conn)
	{
		this.connection = conn;
		this.createExampleUser(); 		// debug use only!!
		this.createTables();
		this.insertUser(user); 
	}
	
	private void  createExampleUser()
	{
		this.user.setName("israel israeli");
		this.user.setNickName("israelite");
		this.user.setAddress("1501 Yemmen road, Yemmen");
		this.user.setEmail("israel@gmail.com");
		this.user.setPassword("1234");
		this.user.setPhone("050-55555351");
	}
	private void createTables()
	{
		int result = 0;
		String[] tables_str = {"USERS", "MESSAGES", "CHANNELS" };
		String[] tables = {CREATE_USERS_TABLE, CREATE_MESSAGE_TABLE, CREATE_CHANNEL_TABLE };
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				this.statement = this.connection.createStatement();
				for (int index = 0; index < tables.length; index++)
				{
					result = this.statement.executeUpdate(tables[index]);  
					System.out.println("create table: " + tables_str[index]);
				}
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}

	/*
	 *  add a new user
	 */
	public void insertUser(User user) 
	{
		try 
		{
			PreparedStatement state = this.connection.prepareStatement(INSERT_USER);
			state.setString(1, user.getName());			//name
			state.setString(2, user.getPassword());		//email
			state.setString(3, user.getNickName());		//phone
			state.setString(4, user.getAddress());		//address
			state.setString(5, user.getAddress());		//photo
			//state.setString(6, user.getName());			//password
			state.executeUpdate();
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	
	
	/*
	 *  getters-=setters *
	 */
	public void setConnection(Connection con) { this.connection = con; }
	
	

}

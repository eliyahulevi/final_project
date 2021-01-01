/**
 * 
 */
package database;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

enum TABLES {users, messages};



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
	
	//sql statements
	public final String CREATE_USERS_TABLE = "CREATE TABLE USERS(" 
			+ "USERNAME varchar(10),"
			+ "PASSWORD varchar(8),"
			+ "NICKNAME varchar(20),"
			+ "DESCRIPTION varchar(50),"
			+ "PHOTO varchar(100),"
			+ "PRIMARY KEY(USERNAME))";
	public final String CREATE_MESSAGE_TABLE = "CREATE TABLE MESSAGE("
			+ "PHOTO varchar(100) PRIMARY KEY,"
			+ "NICKNAME varchar(20),"
			+ "TIME timestamp,"
			+ "CONTENT varchar(500),"
			+ "REPLYABLE char)"; 
	public final String CREATE_CHANNEL_TABLE = "CREATE TABLE CHANNEL("
			+ "NAME varchar(30),"
			+ "DESCRIPTION(500)"
			+ ")";
	public String insertUser = 		"INSERT INTO USERS VALUES (?, ?, ?, ?, ?)";
	public String selectaLLUser = 	"SELECT * FROM USERS";
	public String selectUser = 		"SELECT * FROM USERS WHERE USERNAME=?";
	
	/**
	 * constructor *
	 */
	// default 
	public DB() {}
	public DB(Connection conn)
	{
		this.connection = conn;
		this.createTables();
	}
	
	private void createTables()
	{
		int result;
		String[] tables = {CREATE_USERS_TABLE, CREATE_MESSAGE_TABLE, CREATE_CHANNEL_TABLE };
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				this.statement = this.connection.createStatement();
				for (int index = 0; index < tables.length; index++)
				{
					result = this.statement.executeUpdate(tables[index]);  
					if (result == 0)
					{
						System.out.println("could not create table: " + tables[index]);
					}
				}

			}
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

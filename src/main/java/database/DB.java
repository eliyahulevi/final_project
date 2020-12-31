/**
 * 
 */
package database;

import java.sql.Statement;
import java.sql.Connection;


/**
 * @author shahar
 *
 */
public class DB 
{
	String dbURL;
	Statement statement;
	Connection connection;
	
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
	/*public final String CREATE_CHANNEL_TABLE = "CREATE TABEL CHANNEL("
			+ "NAME varchar(30),"
			+ "DESCRIPTION(500)"
			+ ""
			+ ")";*/
	public String insertUser = 		"INSERT INTO USERS VALUES (?, ?, ?, ?, ?)";
	public String selectaLLUser = 	"SELECT * FROM USERS";
	public String selectUser = 		"SELECT * FROM USERS WHERE USERNAME=?";
	
	/**
	 * 
	 */
	public DB() 
	{
		
	}

}

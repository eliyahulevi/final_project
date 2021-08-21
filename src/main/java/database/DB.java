/**
 *  sources:
 	statements :  		https://docs.oracle.com/javase/tutorial/jdbc/basics/processingsqlstatements.html 
	SQL error codes:  	https://db.apache.org/derby/docs/10.4/ref/rrefexcept71493.html 
 */
package database;

import java.sql.Statement;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.io.File;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.product.AlternativeProduct;
import model.product.Product;
import model.users.*;
import model.message.*;
import model.order.Order;
import org.json.simple.JSONValue;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import javax.sql.rowset.serial.SerialBlob;
import utilities.Utils;

/**
 * @author shahar *
 *
 */
public class DB 
{
	//did you mean this?
	//AppConstansImp const_names = new AppConstansImp();
	//AppConstansImp const_names = new AppConstansImp();
	//String dbName = const_names.Get_dbName();
	//String driverURL = const_names.Get_driverURL();
	//String dbURL = const_names.Get_dbURL();
	
	enum tables { USERS(0), MESSAGES(1), CHANNELS(2), PRODUCTS(3), ORDERS(4), ORDERED_PRODUCT(5), IMAGES(6), USER_IMAGES(7);

		private final int value;
		tables(int i) 
		{
			this.value = i;
		}
		
	    public int getValue() {
	        return value;
	    }
	};
	
	boolean firstTime = true;
	static String dbURL = "";
	static String dbPath = "";
	static String dbName = "";
	static String driverURL = "";
	
	
	static User user;
	//static Product p = new Product("5X15",(float) 13.8,null);
	String[] tables_str = {"USERS", "MESSAGES", "CHANNELS", "PRODUCTS", "ORDERS", "ORDERED_PRODUCT" ,"IMAGES", "USER_IMAGES"};
	
	PreparedStatement prepStatement;
	Statement statement;
	Connection connection;
	ResultSet rs;
	Map<String, String> map;
	
	/************************************************************************
	 *	 					create query strings	
	 ***********************************************************************/
	//private final String CREATE_TABLE = "CREATE TABLE ";				// MAYBE FOR FUTURE USE
	/*private final String CHECK_TABLE_EXIST = "IF (EXISTS (SELECT * "
			+ "FROM INFORMATION_SCHEMA.TABLES "
			+ "WHERE TABLE_SCHEMA = 'TheSchema' "
			+ "AND  TABLE_NAME = 'TheTable'))"
			+ "BEGIN "
			+ "    --Do Stuff\r\n"
			+ "END";
			*/
	private final String CREATE_USERS_TABLE = "CREATE TABLE " + tables_str[tables.USERS.value] + "("  
			+ "USERNAME varchar(40) not null PRIMARY KEY,"
			+ "PASSWORD varchar(8),"
			+ "NICKNAME varchar(30),"
			+ "ADDRESS varchar(50),"
			+ "PHOTO blob,"
			+ "EMAIL varchar(100),"
			+ "DESCRIPTION varchar(200)"
			+ ")";
	private final String CREATE_MESSAGE_TABLE = "CREATE TABLE " + tables_str[tables.MESSAGES.value] + "("
			+ "USERDATE varchar(100) PRIMARY KEY,"
			+ "SENDER varchar(20),"
			+ "USERNAME varchar(20),"
			+ "CONTENT varchar(500),"
			+ "DATE bigint,"
			+ "IMAGE BLOB,"
			+ "CLICKED boolean,"
			+ "OFFSET int,"
			+ "REPLIEDTO varchar(100), "
			+ "FOREIGN KEY (REPLIEDTO) REFERENCES MESSAGES(USERDATE),"
			+ "DISPLAY varchar(20)"
			+ ")";
	private final String CREATE_CHANNEL_TABLE = "CREATE TABLE " + tables_str[tables.CHANNELS.value] + "("
			+ "NAME varchar(30),"
			+ "DESCRIPTION varchar(500)"
			+ ")";
	private final String CREATE_PRODUCT_TABLE = "CREATE TABLE " + tables_str[tables.PRODUCTS.value] + "("
			+ "PRODUCT_ID int PRIMARY KEY,"
			+ "TYPE varchar(30),"
			+ "PRICE float(10),"
			+ "LENGTH float(10),"
			+ "COLOR varchar(30),"
			+ "CROSSSECTION varchar(20),"
			+ "IMAGE BLOB"
			+ ")"; 
	private final String CREATE_ORDER_TABLE = "CREATE TABLE " + tables_str[tables.ORDERS.value] + "("
			+ "ORDER_ID int PRIMARY KEY,"
			+ "DATE bigint,"
			+ "USERNAME varchar(40),"
			+ "SHIPADDRESS varchar(100),"
			+ "STATUS boolean," 
			+ "TOTAL float," 
			+ "COMMENT varchar(200),"
			+ "PRODUCTS varchar(500),"
			+ "FOREIGN KEY (USERNAME) REFERENCES USERS(USERNAME)" 
			+ ")"; 
	private final String CREATE_ORDERED_PRODUCT_TABLE = "CREATE TABLE " + tables_str[tables.ORDERED_PRODUCT.value] + "("
			+ "ORDERED_PRODUCT varchar (30) NOT NULL PRIMARY KEY, "
			+ "PRODUCT_ID int NOT NULL,"
			+ "QTY int NOT NULL,"
			+ "COLOR varchar(20),"
			+ "FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)" 
			+ ")"; 
	private final String CREATE_IMAGES_TABLE = "CREATE TABLE " + tables_str[tables.IMAGES.value] + "("
			+ "IMAGE_ID int PRIMARY KEY,"
			+ "IMG BLOB"
			//+ "FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)," 
		    //+ "FOREIGN KEY (IMAGE_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 
	private final String CREATE_USER_IMAGES_TABLE = "CREATE TABLE " + tables_str[tables.USER_IMAGES.value] + "("
			+ "IMAGE_NAME varchar(100) PRIMARY KEY,"
			+ "IMG BLOB,"
			+ "USERNAME varchar(40),"
			+ "FOREIGN KEY (USERNAME) REFERENCES USERS(USERNAME)" 
		    //+ "FOREIGN KEY (IMAGE_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 


	/************************************************************************
	 *	 					order	
	 ***********************************************************************/
	private String INSERT_ORDER 		= 	"INSERT INTO " 	 + tables_str[tables.ORDERS.value] + " VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	private String SELECT_ORDER 		= 	"SELECT * FROM " + tables_str[tables.ORDERS.value] + " WHERE ORDER_ID=?";
	private String SELECT_USERS_ORDERS 	=	"SELECT * FROM " + tables_str[tables.ORDERS.value] + " WHERE USERNAME=?";
	private String EDIT_USERS_ORDERS 	=	"UPDATE "	 	 + tables_str[tables.ORDERS.value] + " SET "
																							   + " SHIPADDRESS=?, "
																							   + " STATUS=?, "
																							   + " TOTAL=?, "
																							   + " COMMENT=?, "
																							   + " PRODUCTS=? "
																							   + " WHERE ORDER_ID=?";
	
	/************************************************************************
	 *	 					user	
	 ***********************************************************************/
	private String INSERT_USER 			= 	"INSERT INTO "   + tables_str[tables.USERS.value] + " VALUES (?, ?, ?, ?, ?, ?, ?)";
	private String SELECT_USER 			= 	"SELECT * FROM " + tables_str[tables.USERS.value] + " WHERE USERNAME=? AND PASSWORD=?";
	private String SELECT_USERS_NAMES 	= 	"SELECT USERNAME FROM " + tables_str[tables.USERS.value];
	private String EDIT_USER			=	"UPDATE " 		 + tables_str[tables.USERS.value] 	+ " SET " 
																								+ " PASSWORD= ? ,"
																								+ " NICKNAME= ? ,"
																								+ " ADDRESS= ? ,"
																								+ " PHOTO= ? ,"
																								+ " EMAIL= ? ,"
																								+ " DESCRIPTION= ? "
																								+ " WHERE USERNAME= ? ";
	
	/************************************************************************
	 *	 					message
	 ***********************************************************************/
	private String SELECT_USER_MESSAGE	=	"SELECT * FROM " + tables_str[tables.MESSAGES.value] + " WHERE NOT DISPLAY=? AND SENDER=? OR "
															 + "	NOT DISPLAY=? AND USERNAME=? ORDER BY DATE ASC";
	private String SELECT_USERS_MESSAGE	=	"SELECT * FROM " +  tables_str[tables.MESSAGES.value] + " WHERE USERNAME=? AND NOT DISPLAY LIKE ? ORDER BY DATE ASC";
	//private String SELECT_SENDER_MESSAGE=	"SELECT * FROM " +  tables_str[tables.MESSAGES.value] + " WHERE SENDER=? AND NOT DISPLAY LIKE ? ORDER BY DATE ASC";
	private String INSERT_USER_MESSAGE 	= 	"INSERT INTO "   +  tables_str[tables.MESSAGES.value] + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	//private String SELECT_MESSAGES = 		"SELECT * FROM " +  tables_str[tables.MESSAGES.value];
	private String HIDE_MESSAGE 		= 	"UPDATE " 		 + tables_str[tables.MESSAGES.value] + " SET DISPLAY=? WHERE USERDATE=?";
	private String INCOMING_MESSAGES 	=	"SELECT * FROM " +  tables_str[tables.MESSAGES.value] + " WHERE SENDER=? AND USERNAME=? ORDER BY DATE ASC";
	private String OUTGOING_MESSAGES 	=	"SELECT * FROM " +  tables_str[tables.MESSAGES.value] + " WHERE SENDER=? ORDER BY DATE ASC";
	
	/************************************************************************
	 *	 					image
	 ***********************************************************************/
	private String SELECT_IMAGE 		= 	"SELECT IMAGE FROM IMAGES WHERE";
	private String INSERT_USER_IMAGE 	= 	"INSERT INTO USER_IMAGES VALUES (?, ?, ?)";
	
	/************************************************************************
	 *	 					product
	 ***********************************************************************/
	private String INSERT_ORDERED_PRODUCT 	= "INSERT INTO " + tables_str[tables.ORDERED_PRODUCT.value] + " VALUES (?, ?, ?, ?)";
	private String SELECT_ORDERED_PRODUCT 	= "SELECT PRODUCT_ID FROM " + tables_str[tables.ORDERED_PRODUCT.value] + " WHERE ORDERED_PRODUCT=?";
	private String INSERT_PRODUCT 			= "INSERT INTO " + tables_str[tables.PRODUCTS.value] + " VALUES (?, ?, ?, ?, ?, ?, ?)";
	private String SELECT_PRODUCT 			= "SELECT * FROM " + tables_str[tables.PRODUCTS.value] + " WHERE PRODUCT_ID=?";
	private String SELECT_ALL_PRODUCTS 		= "SELECT * FROM " + tables_str[tables.PRODUCTS.value];
	private String REMOVE_PRODUCT			= "DELETE FROM " + tables_str[tables.PRODUCTS.value] + " WHERE PRODUCT_ID=?";
	
	/************************************************************************
	 *	 					general app queries
	 ***********************************************************************/
	private String UPDATE_TABLE_CLICKED = 	"UPDATE MESSAGES SET CLICKED = ? WHERE USERDATE = ?";
	private String SELECT_MAX_ORDER_IDX =	"SELECT MAX(ORDER_ID) FROM ORDERS";
	private String ABORT_CONNECTION 	= 	"NO CONNECTION.. ABORTING";
	private String REGISTER_REPLACE_FUNC=	"CREATE FUNCTION REPLACE(SRC VARCHAR(8000), SEARCH VARCHAR(8000), REP VARCHAR(8000) ) " + 
											"RETURNS VARCHAR(8000) " + 
											"LANGUAGE JAVA " +
											"PARAMETER STYLE JAVA " + 
											"NO SQL " + 
											"EXTERNAL NAME 'database.DerbyExtensions.replace'";
	
	String[] createQueryString = {	CREATE_USERS_TABLE, 
									CREATE_MESSAGE_TABLE, 
									CREATE_CHANNEL_TABLE, 
									CREATE_PRODUCT_TABLE, 
									CREATE_ORDER_TABLE, 
									CREATE_ORDERED_PRODUCT_TABLE,
									CREATE_IMAGES_TABLE,
									CREATE_USER_IMAGES_TABLE};

	
	
	/**
	 * constructors *
	 */
	public DB() 
	{

	}
	public DB(Connection conn)
	{
		this.connection = conn;
		try 
		{
			init();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
	}
	public DB(Connection conn, String path)
	{
		DB.dbPath = path;
		init(); 
	}
	public DB(String driverURL, String path)
	{
		DB.driverURL = driverURL;
		DB.dbPath = path;
		init();
	}
	
	
	
	/************************************************************************
	 *	 					private class methods	
	 ***********************************************************************/
	private void init() 
	{
		int count = 0;
		this.map = new HashMap<String, String>();
		DB.dbURL = "jdbc:derby:" + DB.dbPath + ";create=true";
		DB.user = new User();
		for(String s: this.tables_str)
		{
			this.map.put(s, createQueryString[count]); 
			//System.out.printf("%-15s %s%n", "DB >> ", "tabel: " + s + " has query "+ createQueryString[count]);
			count++;
		}
		try 
		{
			//Class.forName(driverURL);

			this.createFunctions();
			this.createAdmin(); 		
			this.createTables();
			if (this.isEmpty("USERS"))
				this.insertUser(DB.user, true);

		} 
		catch 
		(Exception e) 
		{
			e.printStackTrace();
		}
		finally
		{
			this.firstTime = false;	
		}
		
	}	
	private void createFunctions()
	{
		PreparedStatement ps = null;
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "create db functions");
			
			this.connection.setAutoCommit(false); 
			//this.connection.createStatement().execute("DROP FUNCTION REPLACE");
			ps = this.connection.prepareStatement(REGISTER_REPLACE_FUNC); 
			ps.execute();
			this.connection.commit();
		}
		catch (SQLException e1) 
		{
			if(e1.getSQLState().equals("X0Y68") )
			{
				String DROP_REPLACE_FUNCTION = "DROP FUNCTION REPLACE";
				if(this.connect() < 0)
				{
					System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
					System.exit(-1);
				}
				try 
				{
					this.connection.createStatement().execute(DROP_REPLACE_FUNCTION);
					this.connection.createStatement().execute(REGISTER_REPLACE_FUNC);
				} 
				catch (SQLException e) 
				{
					e.printStackTrace();
				}
				this.disconnect();
			}
			//	System.out.printf("\n%-15s %s%n", "DB>>", "sql error: " + e1.getSQLState());
			
			else//if(e1.getSQLState().equals("X0Y68") )
			{
				String DROP_REPLACE_FUNCTION = "DROP FUNCTION REPLACE";
				if(this.connect() < 0)
				{
					System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
					System.exit(-1);
				}
				try 
				{
					this.connection.createStatement().execute(DROP_REPLACE_FUNCTION);
					this.connection.createStatement().execute(REGISTER_REPLACE_FUNC);
				} 
				catch (SQLException e) 
				{
					e.printStackTrace();
				}
				this.disconnect();
			}
			
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null && !ps.isClosed())
					ps.close();
			} 
			catch(Exception e2)
			{
				
			}
		}
	}
 	private void createAdmin()
	{
		DB.user.setName("admin");
		DB.user.setNickName("administrator");
		DB.user.setAddress("1501 Yemmen road, Yemmen");
		DB.user.setEmail("israel@gmail.com");
		DB.user.setPassword("1234");
		DB.user.setPhone("050-55555351");
		DB.user.setDescription("Joey doesn't share food!!");
	}
	private void createTables()
	{
		Statement stat = null;
		ResultSet rs = null;

		try 
		{
			if (this.connect() == 0)
			{
				stat = this.connection.createStatement();
				DatabaseMetaData dbmd = this.connection.getMetaData();
				
				for (int index = 0; index < createQueryString.length; index++)
				{
					rs = dbmd.getTables(null, null, tables_str[index], null);
					if (!rs.next())
					{
						stat.executeUpdate(createQueryString[index]);
						System.out.printf("%-15s %s%n", "DB >>", "table: " + tables_str[index] + " created");
					}
					else
						System.out.printf("%-15s %s%n", "DB >>",  "table: " + tables_str[index] + " exists");
				}
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(rs != null)
					rs.close();
				if(stat != null)
					stat.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.disconnect();
		}
	}
	private void createTable(String createTableQuery)
	{
		Statement stat = null;
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				stat = this.connection.createStatement();
				stat.executeUpdate(createTableQuery);
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				stat.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	@SuppressWarnings("deprecation")
	private synchronized int connect()
	{
		int result = -1;
        try 
        {
        	Class.forName(DB.driverURL).newInstance();
			System.out.printf("%-15s %s%n", "DB >>", "database url: " + DB.dbURL);	
			if (this.connection == null)
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else if (this.connection.isClosed())
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else
				System.out.printf("%-15s %s%n", "DB >>", "already connected to database: " + DB.dbName);	
			result = 0;
			
        }
        catch(SQLException | ClassNotFoundException | InstantiationException | IllegalAccessException e)
        {
        	System.out.printf("%-15s %s%n", "DB >>", "error: " + e.getMessage());
        	if(((SQLException) e).getSQLState().equals("XJ040"))
        	{
        		System.out.printf("%-15s %s%n", "DB >>", "db exist already");
        		try 
        		{
        			Class.forName("org.apache.derby.jdbc.ClientDriver").newInstance();
    				DB.dbURL = "jdbc:derby:" + "C:/final_project/ClientsDB";//DB.dbPath + ";";
    				System.out.printf("%-15s %s%n", "DB >>", "dbURL: " + DB.dbURL);
 
				} 
        		catch (InstantiationException | IllegalAccessException | ClassNotFoundException e1) 
        		{
					e1.printStackTrace();
				}
        	} 
        	
        }
        
        return result;
	}
	private synchronized int disconnect() 
	{
		int result = -1;
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				try 
				{
					this.connection.commit();
					this.connection.close();
					System.out.printf("%-15s %s%n", "DB >>", "disconnect from database: " + dbName);
				} 
				catch (SQLException e) 
				{
					e.printStackTrace();
				}
				result = 0;
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		return result;
	}
	private boolean isEmpty(String tabelName)
	{
		int count = 0;
		boolean result = true;
		String queryString = "SELECT * FROM " + tabelName;
		ResultSet rs = null;
		
		this.connect();
		try 
		{
			if(this.connection != null)
			{
				PreparedStatement state = this.connection.prepareStatement(queryString);
				rs = state.executeQuery();
				while ( rs.next() ) 
					count++;
				result = count > 0 ? false : true;
			}
			else
			{
				System.out.printf("%-15s %s%n", "DB >>", "no connection to DB");
			}
			
		} 
		catch (SQLException e) 
		{
			if(e.getSQLState() == "42X05")
			{ 
				String query = (String)this.map.get(tabelName);
				this.createTable(query); 
			}
			e.printStackTrace();
		}
		finally
		{
			if(rs != null)
				try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			this.disconnect();
			System.out.printf("%-15s %s%n", "DB >>", "tabel " + tabelName + " has " + count + " records");
		}

		return result;
	}

	
	
	/************************************************************************
	*	USER related code here: (insert, update, get all, etc. )
	*************************************************************************/		
	
	/**
	 *	converts User instance to string in JSON format
	 *	@param	user	instance of User class
	 *	return	String	the user object fields in a JSON format 
	 */
	private String user2JSON(User user)
	{
		String result = "";
		Blob photo = user.getPhoto();
		
		Map<String,String> map = new HashMap<String,String>();
		map.put("username", user.getName());
		map.put("password", user.getPassword());
		map.put("nickname", user.getNickName());
		map.put("address", user.getAddress());
		map.put("email", user.getEmail());
		map.put("description", user.getDescription());
		
		if( photo != null )
			map.put("photo", user.getPhoto().toString());
		
		result = JSONValue.toJSONString(map);
		return result;
	}
	
	/**
	 *  get all users names from the database, this function uses
	 *  prepared statement and class connection. 
	 *  On failure function print the stack trace.
	 *  @param	null
	 *  return	List<string>	a list of strings of registered users names only
	 */
	public List<String> getUsersNames()
	{
		List<String> result = new ArrayList<String>();
		ResultSet rs = null;
		
		try
		{
			this.connect();
			PreparedStatement statement =  this.connection.prepareStatement(SELECT_USERS_NAMES);
			rs = statement.executeQuery();
			while(rs.next())
			{
				
				String name = rs.getString(1); 
				System.out.println(name);
				result.add(name);
			}
		}
		catch( Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(statement != null)
					statement.close();
				if(rs != null)
					rs.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
			this.disconnect();
		}
		
		return result;
	}
	
	/*
	 *  insert a new user to DB
	 *  @param	user	an instance of the user to be inserted into DB
	 *  @param	first	a boolean indicating initial DB instantiation (obsolete)
	 *  return 	null
	 */
 	public void insertUser(User user, boolean first) 
	{
 		int rs = -1;
 		long time = System.currentTimeMillis();
 		PreparedStatement state = null;
 		Message message = new Message("admin", user.getName(), Message.WELCOME, time, (Blob)null, 0, null);
 		System.out.printf("%-15s %s%n", "DB >>", "initial message user:" + user.getName() + " at: " + time);			
		try 
		{
			// connect to db
			if (this.connect() < 0 )
			{
				System.out.printf("%-15s %s%n", "DB >>", "cannot connect to database.. aborting");
				return;
			}
			// insert user			
			state = this.connection.prepareStatement(INSERT_USER);
			state.setString(1, user.getName());			// name	
			state.setString(2, user.getPassword());		// password
			state.setString(3, user.getNickName());		// nickname
			state.setString(4, user.getAddress());		// address
			state.setBlob(5, user.getPhoto());			// photo
			state.setString(6, user.getEmail());		// e-mail
			state.setString(7, user.getDescription());	// description
			rs = state.executeUpdate();
			
			if (rs > 0)
			{
				this.insertMessage(message);
				System.out.printf("%-15s %s%n", "DB >>", "user " + user.getName() + " added");	
			}
						
		} 
		catch (SQLException e) 
		{
			if (e.getSQLState().equals("42X05"))
			{
				System.out.printf("%-15s %s%n", "DB >>", "error >> need to update table");
				this.createTable(CREATE_USERS_TABLE);
				this.insertUser(user, first);
			}
			else if(e.getSQLState() == "23505")
				System.out.printf("%-15s %s%n", "DB >>", "warning >> user alerady exist");
			else
				e.printStackTrace();
		}
		finally
		{
			if(state != null)
				try {
					state.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			disconnect();
		}
	}	
	
 	/*
	 *  find IF a user with a specific password exist in DB
	 *  @param	String name, the name of the requested user
	 *  @param	String password, the password of the user
	 *  return 	boolean, true/false if user name exist with the given password
	 */
	public boolean findUser(String name, String password)
	{
		boolean result = false;
		ResultSet res = null;
		PreparedStatement state = null;
				
		try 
		{
			System.out.printf("%-15s %s%n", "DB >>", "searching for user " + name + " with password " + password);
			this.connect();
			state = this.connection.prepareStatement(SELECT_USER);
			state.setString(1, name);			//name
			state.setString(2, password);		//password
			res = state.executeQuery();
			
			if (res.next())
			{
				// TODO: erase after debug!!
				if(res.getString(1).equals(name) && res.getString(2).equals(password)) 
				{
					System.out.printf("%-15s %s%n", "DB >>", "user " + name + "  found"); 
					result = true;
				}
			}
			else
				result = false;
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if(state != null)
					state.close();
				if(rs != null)
					rs.close();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
			this.disconnect();
		}
				
		return result;
	}
	
	/*
	 * 	find USER DETAILS of a specific user
	 * 	@param	String name, the name of the requested user
	 *  @param	String password, the password of the user
	 *  return	String, the user details in JSON format
	 */
	public String findUser1(String name, String password)
	{
		String result = "";
		ResultSet res = null;
		PreparedStatement state = null;
				
		try 
		{
			System.out.printf("%-15s %s%n", "DB >>", "searching for user " + name + " with password " + password);
			if (this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB >>", "cannot connect to database.. aborting");
				return result;
			}
			state = this.connection.prepareStatement(SELECT_USER);
			state.setString(1, name);			//name
			state.setString(2, password);		//password
			res = state.executeQuery();
			
			if (res.next())
			{
				if(res.getString(1).equals(name) && res.getString(2).equals(password)) 
				{
					User user = new User(	res.getString(1),  	// name
											res.getString(2), 	// password
											res.getString(3),	// nickname 
											res.getString(4),	// address 
											res.getBlob(5),		// photo
											res.getString(6),	// email
											res.getString(7)	// description
										);
					user.print();
					return user2JSON(user);
				}
			}
			else
				result = "";
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if(state != null)
					state.close();
				if(res != null)
					res.close();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
			this.disconnect();
		}
				
		return result;
	}
	
	/**
	 * updating users details, all but username, including password
	 * @param 	user
	 * @return 	result, non negative integer on success, negative, else
	 */
	public int updateUser(User user)
	{
		int result = -1;		
		PreparedStatement state = null;
			
		try 
		{
			// connect to db
			if (this.connect() < 0 )
			{
				System.out.printf("%-15s %s%n", "DB >>", "cannot connect to database.. aborting");
				return result;
			}
			
			user.print();
			
			System.out.printf("%-15s %s%n", "\nregister servlet >> " ,"incomming user:");
			System.out.printf("%-15s %s%n", "name " 	,user.getName());
			System.out.printf("%-15s %s%n", "nickname " ,user.getNickName());
			System.out.printf("%-15s %s%n", "password " ,user.getPassword());
			System.out.printf("%-15s %s%n", "email " 	,user.getEmail());
			System.out.printf("%-15s %s%n", "address " 	,user.getAddress());
			System.out.printf("%-15s %s%n", "image " 	,user.getPhoto());
			System.out.printf("%-15s %s%n", "description " 	,user.getDescription());
			System.out.printf("%-15s %s%n", "phone " 	,user.getPhone());
			
			// insert user			
			state = this.connection.prepareStatement(EDIT_USER);
			//state.setString(1, user.getName());			// name	
			state.setString(1, user.getPassword());		// password
			state.setString(2, user.getNickName());		// nickname
			state.setString(3, user.getAddress());		// address
			state.setBlob(4, user.getPhoto());			// photo
			state.setString(5, user.getEmail());		// e-mail
			state.setString(6, user.getDescription());	// description
			state.setString(7, user.getName());			// where user name is
			result = state.executeUpdate();
			
			if (result > 0)
			{
				System.out.printf("%-15s %s%n", "DB >>", "user " + user.getName() + " added");	
			}
						
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			if(state != null)
				try {
					state.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			disconnect();
		}
		
		return result;
	}
	
	/************************************************************************
	*	MESSAGE related code here:  (insert, update, get all, etc. )
	*************************************************************************/	
	
	/**
	 *  convert message to JSON format
	 *  @param	Message message, a Message instance
	 *	return String, the message details in a JSON format  	
	 */
	private String message2JSON(Message message)
	{
		String result = "";
		Blob blob = message.getImage();
		Map<String,String> map = new HashMap<String,String>();
		//System.out.printf("%-15s %s%n","DB>>", message.getUser());
		try
		{
			
			map.put("user", message.getUser());
			map.put("sender", message.getSender());
			map.put("date", Long.toString(message.getDate()));
			map.put("message", message.getMessage());	
			map.put("clicked", String.valueOf(message.getClicked()));
			map.put("offset", String.valueOf(message.getOffset()));
			map.put("repliedTo", String.valueOf(message.getRepliedTo()));
			map.put("display", String.valueOf(message.getDisplay()));
			if(blob == null)
				map.put("image", "");
			else 
				map.put("image", new String(blob.getBytes(1, (int)blob.length())));
			
			// TODO: try map.put("image", new String(blob.getBytes(0, (int)blob.length() - 1 )));
			// and correct client side
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		result = JSONValue.toJSONString(map);
		return result;
	}
	
	/**
	 *  get messages (of a given user)
	 *  @param	String	user, the user name
	 *  return	List<String>	a list of strings that holds all of the user
	 *  						messages in a JSON format array
	 */
	public List<String> getUserMessages(String user)
	{
		List<String> result = new ArrayList<String>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Message message = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "getting messages for: " + user);
			message = new Message();
			//String statement = this.SELECT_USERS_MESSAGE + "'" + user + "'";
			
			this.connection.setAutoCommit(false); 
			ps = this.connection.prepareStatement(SELECT_USERS_MESSAGE); 
			ps.setString(1, user);
			ps.setBoolean(2, true);
			rs = ps.executeQuery();
			
			 
			while(rs.next())
			{
				message.setSender(rs.getString(2));				// sender
				message.setUser(rs.getString(3));				// user
				message.setMessage(rs.getString(4));			// message content
				message.setDate(rs.getLong(5));					// date
				message.setImage(rs.getBlob(6));				// image source
				message.setClicked(rs.getBoolean(7));			// clicked
				message.setOffset(rs.getInt(8));	 			// offset
				message.setRepliedTo(rs.getString(9));			// replied to
				message.setDisplay(rs.getString(10));			// display
				String s = this.message2JSON(message);
				// TODO: erase later
				System.out.printf("%-15s %s%n", "DB>>", "msgs: " + s);
				result.add(s);
			}
			this.connection.commit();
		}
		catch(SQLException e)
		{
			if("08003".equals(e.getSQLState())) 
				System.out.printf("%-15s %s%n", "DB>>", "no connection..");
			else if("XCL16".equals(e.getSQLState()))
				System.out.printf("%-15s %s%n", "DB>>", "operation next not permitted..");
				
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null && !ps.isClosed())
					ps.close();
				if(rs != null && !rs.isClosed())
					rs.close();
			} 
			catch (SQLException e1) 
			{
				if(e1.getSQLState().equals("XCL16"))
					System.out.printf("%-15s %s%n", "DB >>", "result set is closed");
				e1.printStackTrace();
			}
		}
		
		return result;
	}
	public List<String> getUserMessages1(String user)
	{
		List<String> result = new ArrayList<String>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Message message = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "getting messages for: " + user);
			message = new Message();
			//String statement = this.SELECT_USERS_MESSAGE + "'" + user + "'";
			
			this.connection.setAutoCommit(false); 
			ps = this.connection.prepareStatement(SELECT_USER_MESSAGE); 
			ps.setString(1, user);		// not to display for sender
			ps.setString(2, user);		// sender
			ps.setString(3, user);		// not to display for this user
			ps.setString(4, user);		// user
			rs = ps.executeQuery();
			
			 
			while(rs.next())
			{
				message.setSender(rs.getString(2));				// sender
				message.setUser(rs.getString(3));				// user
				message.setMessage(rs.getString(4));			// message content
				message.setDate(rs.getLong(5));					// date
				message.setImage(rs.getBlob(6));				// image source
				message.setClicked(rs.getBoolean(7));			// clicked
				message.setOffset(rs.getInt(8));	 			// offset
				message.setRepliedTo(rs.getString(9));			// replied to
				message.setDisplay(rs.getString(10));			// display
				String s = this.message2JSON(message);
				result.add(s);
			}
			this.connection.commit();
		}
		catch(SQLException e)
		{
			if("08003".equals(e.getSQLState())) 
				System.out.printf("%-15s %s%n", "DB>>", "no connection..");
			else if("XCL16".equals(e.getSQLState()))
				System.out.printf("%-15s %s%n", "DB>>", "operation next not permitted..");
				
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(!ps.isClosed())
					ps.close();
				if(!rs.isClosed())
					rs.close();
			} 
			catch (SQLException e1) 
			{
				if(e1.getSQLState().equals("XCL16"))
					System.out.printf("%-15s %s%n", "DB >>", "result set is closed");
				e1.printStackTrace();
			}
		}
		
		return result;
	}
	
	/**
	 *  insert a new message into MESSAGES table. primary key
	 *  of each message is the 'sender' name concatenated with 'date'
	 *  @param	Message	message, a message instance to be inserted
	 *  return	int	non negative integer in case of success, -1 on failure
	 */
	public int insertMessage(Message message)
	{
		int result = -1;
		PreparedStatement ps = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println(this.ABORT_CONNECTION);
				System.exit(-1);
			}
			message.print();
			ps = this.connection.prepareStatement(this.INSERT_USER_MESSAGE);
			ps.setString(1, message.getSender() + message.getDate());
			ps.setString(2, message.getSender());
			ps.setString(3, message.getUser());
			ps.setString(4, message.getMessage());
			ps.setLong(5, message.getDate());
			ps.setBlob(6, message.getImage());
			ps.setBoolean(7, message.getClicked());
			ps.setInt(8, message.getOffset()); 
			ps.setString(9,  message.getRepliedTo());
			ps.setString(10, message.getDisplay());
			ps.execute();
			result = 0;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try
			{
				if(!ps.isClosed())
					ps.close();
			} catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
		return result;
	}

	/**
	 * 	update 'message' clicked field of a specific user. function finds
	 * 	the message with the signature string 'user''date' (concatenated) 
	 * 	@param	String	user, user name
	 * 	@param	long	date, the message date in miliseconds
	 * 	return	int		non negative upon success, negative else
	 */
	public int messageClicked(String user, long date)
	{
		int result = -1;
		PreparedStatement ps = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println(ABORT_CONNECTION);
				System.exit(-1);
			}
			ps = this.connection.prepareStatement(UPDATE_TABLE_CLICKED);
			ps.setBoolean(1, true);
			ps.setString(2, user + date);
			ps.executeUpdate();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null)
					ps.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
		return result;
	}

	/**
	 * 	hides specific message, identified by the user-date string,
	 *  from displaying mode in the user page. this function
	 *  actually updates the message 'display' field to 'false'.
	 *  @param	String	the user name, to hide the message from
	 *  @param	String	sender, the user that sent the message
	 *  @param	long	date, the time stamp, unique identifier
	 *  return	int		non negative upon success, negative else
	 */
	public int messageHide(String user, String sender, long date)
	{
		int result = -1;
		PreparedStatement ps = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println(ABORT_CONNECTION);
				System.exit(-1);
			}
			System.out.printf("%n%-15s %s", "DB >>", "delete message: " + user + date);		// TODO: erase if works
			ps = this.connection.prepareStatement(HIDE_MESSAGE);
			ps.setString(1, user);				// user to hide from
			ps.setString(2, sender + date);		// message to hide
			result = ps.executeUpdate();
			if(result == 0) throw new Exception();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(ps != null)
					ps.close();
				disconnect();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
	/**
	 *  resets the display field for specific user, in ALL messages
	 *  @param:	user,	String that represent the user to which the
	 *  				query applies
	 *  return: int,	non-negative upon success 
	 */
	public int messageReset(String user)
	{
		int result = -1;
		PreparedStatement ps = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println(ABORT_CONNECTION);
				System.exit(-1);
			}
			System.out.printf("%n%-15s %s", "DB >>", "reset message display for " + user);	//TODO: erase if works
			//RESET_MESSAGE_4USER1.replace("?", user);
			//ps = this.connection.prepareStatement(RESET_MESSAGE_4USER1);
			//ps.setString(1, user);
			//ps.setString(2, user);
			//result = ps.executeUpdate();
			this.connection.createStatement().execute(	"UPDATE " + tables_str[tables.MESSAGES.value] + " SET DISPLAY=" +
															" REPLACE(DISPLAY, '" + user + "', '') " +
														"WHERE DISPLAY LIKE '%" + user + "%'");
			if(result == 0) throw new Exception();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(ps != null)
					ps.close();
				disconnect();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		
		return result;
	}

	/**
	 *  get outgoing messages only: messages sent by user
	 *  @param:		String, user: the name of the user
	 *  return 		void
	 */
	public List<String> outgoingMessages(String user)
	{
		List<String> result = new ArrayList<String>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Message message = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "getting outgoing messages from: " + user);
			message = new Message();
			//String statement = this.SELECT_USERS_MESSAGE + "'" + user + "'";
			
			this.connection.setAutoCommit(false); 
			ps = this.connection.prepareStatement(OUTGOING_MESSAGES); 
			ps.setString(1, user);		// user
			rs = ps.executeQuery();
			
			 
			while(rs.next())
			{
				message.setSender(rs.getString(2));				// sender
				message.setUser(rs.getString(3));				// user
				message.setMessage(rs.getString(4));			// message content
				message.setDate(rs.getLong(5));					// date
				message.setImage(rs.getBlob(6));				// image source
				message.setClicked(rs.getBoolean(7));			// clicked
				message.setOffset(rs.getInt(8));	 			// offset
				message.setRepliedTo(rs.getString(9));			// replied to
				message.setDisplay(rs.getString(10));			// display
				String s = this.message2JSON(message);
				result.add(s);
			}
			this.connection.commit();
		}
		catch(SQLException e)
		{
			if("08003".equals(e.getSQLState())) 
				System.out.printf("%-15s %s%n", "DB>>", "no connection..");
			else if("XCL16".equals(e.getSQLState()))
				System.out.printf("%-15s %s%n", "DB>>", "operation next not permitted..");
				
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null && !ps.isClosed())
					ps.close();
				if(rs != null && !rs.isClosed())
					rs.close();
			} 
			catch (SQLException e1) 
			{
				if(e1.getSQLState().equals("XCL16"))
					System.out.printf("%-15s %s%n", "DB >>", "result set is closed");
				e1.printStackTrace();
			}
		}
		
		return result;
	}
	
	/**
	 *  get outgoing messages only: messages sent by user
	 *  @param:		String, user: the name of the user
	 *  return 		void
	 */
	public List<String> incomingMessages(String user, String sender)
	{
		List<String> result = new ArrayList<String>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Message message = null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "getting outgoing messages from: " + user);
			message = new Message();
			//String statement = this.SELECT_USERS_MESSAGE + "'" + user + "'";
			
			this.connection.setAutoCommit(false); 
			ps = this.connection.prepareStatement(INCOMING_MESSAGES); 
			ps.setString(1, sender);	// sender
			ps.setString(2, user);		// user
			rs = ps.executeQuery();
			
			 
			while(rs.next())
			{
				message.setSender(rs.getString(2));				// sender
				message.setUser(rs.getString(3));				// user
				message.setMessage(rs.getString(4));			// message content
				message.setDate(rs.getLong(5));					// date
				message.setImage(rs.getBlob(6));				// image source
				message.setClicked(rs.getBoolean(7));			// clicked
				message.setOffset(rs.getInt(8));	 			// offset
				message.setRepliedTo(rs.getString(9));			// replied to
				message.setDisplay(rs.getString(10));			// display
				String s = this.message2JSON(message);
				result.add(s);
			}
			this.connection.commit();
		}
		catch(SQLException e)
		{
			if("08003".equals(e.getSQLState())) 
				System.out.printf("%-15s %s%n", "DB>>", "no connection..");
			else if("XCL16".equals(e.getSQLState()))
				System.out.printf("%-15s %s%n", "DB>>", "operation next not permitted..");
				
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null && !ps.isClosed())
					ps.close();
				if(rs != null && !rs.isClosed())
					rs.close();
			} 
			catch (SQLException e1) 
			{
				if(e1.getSQLState().equals("XCL16"))
					System.out.printf("%-15s %s%n", "DB >>", "result set is closed");
				e1.printStackTrace();
			}
		}
		
		return result;
	}
	
	
	
	/************************************************************************
	*	IMAGE related code here:  (insert, update, get all, etc. ), this 
	*	section might by unified with MESSAGE section
	*************************************************************************/	
 	
	/**
 	 * 	inserting an image with name, by specific user and source
 	 * 	@param	imgName String	file name
 	 * 	@param	user	String	the name of the user that uploaded
 	 * 	@param	image	Blob	the image source
 	 * 	return	int		non-negative on success, negative else
 	 */
	public int insertImage(String imgName, String user, Blob image)
	{
		int result = -1;
		//int index = 0;
		PreparedStatement insert = null;
		PreparedStatement max = null;
		ResultSet rs = null;
		try
		{
			System.out.printf("%-15s %s%n", "DB >>", "upload image");
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB >>", "cannot connect to database.. aborting");
				return result;
			}


			insert = this.connection.prepareStatement(this.INSERT_USER_IMAGE);
			insert.setString(1, imgName);
			insert.setBlob(2, image);
			insert.setString(3, user);
			insert.execute();
		}
		catch(Exception e)
		{
			if(((SQLException) e).getSQLState().equals(""))
			{
				//TODO: handle same image name exception
			}
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(rs != null)
					rs.close();
				if(max != null)
					max.close();
				if(insert != null)
					insert.close();
			} 
			catch (SQLException e) 
			{
				System.out.printf("%-15s %s%n", "DB >> ", "result set failed to close");
			}
			this.disconnect();	
		}
		
		
		return result;
	}
	
	/**
	 * 	extract an image from the DB, in form of array of bytes
	 * 	@param	name	String	the name of the image
	 * 	return			Byte[]	the image source
	 */
	public byte[] getImage(String name)
	{
		int length = 10;
		byte[] result = new byte[length];
		Statement statement;
		ResultSet rs = null;
		try 
		{
			if(this.connect() < 0)
			{
				
			}
			statement = (Statement)this.connection.createStatement();
			rs = statement.executeQuery(SELECT_IMAGE);
			
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(rs != null)
					rs.close();
			} 
			catch (SQLException e) {
				e.printStackTrace();
			}
			this.disconnect();
		}
		
		
		
		return result;
	}
	
	
		
	/************************************************************************
	*	ORDER related code here:  (insert, update, get all, etc. )
	*************************************************************************/			
	public AlternativeProduct getOrder(int orderID) {
		AlternativeProduct result = new AlternativeProduct();
		ResultSet res = null;
		try 
		{
			System.out.printf("%-15s %s%n", "DB >>", "searching for order id " + orderID);
			this.connect();
			PreparedStatement state = this.connection.prepareStatement(SELECT_ORDER);
			state.setInt(1, orderID);
			res = state.executeQuery();
			
			List<ArrayList<Integer>> list_of_order = new ArrayList<ArrayList<Integer>>();
			while (res.next())
			{
				ArrayList<Integer> temp = new ArrayList<Integer>();
				temp.add(res.getInt(4));//length
				temp.add(rs.getInt(5));//quantity
				list_of_order.add(temp);
			}
			
			result.setList_of_order(list_of_order);
			//maybe need to do it before the while loop
			result.setCustomerName(rs.getString(2));
			result.setOrderID(rs.getInt(1));
			result.setType_of_lumber(rs.getString(3));
			
			
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
		}

		return result;
		
	}
	public String getOrder1(int orderId)
	{
		String result = "";
		PreparedStatement ps = null;
		ResultSet rs = null;
		Order order = new Order();
		try
		{
			// 0. connect
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
				return null;
			}	
			
			// 1. create the orders list
			ps = this.connection.prepareStatement(SELECT_ORDER);
			ps.setInt(1, orderId);
			System.out.printf("%n%-15s %s%n", "DB >>", "get order with id: " + orderId);
			rs = ps.executeQuery();
			while(rs.next()) {
				order.setIndex(rs.getInt(1));				// index
				order.setDate(rs.getLong(2));				// date
				order.setCustomer(rs.getString(3));			// customer
				order.setAddress(rs.getString(4));			// ship address
				order.setIsSupplied(rs.getBoolean(5));		// supplied
				order.setTotal(rs.getFloat(6));				// total
				order.setComment(rs.getString(7));			// comment
				//String[] products = rs.getString(8).split(";", 0);
				//List<String> prods	= Arrays.asList(products);
				order.setProducts(rs.getString(8));			// products
				order.print();
				result = this.order2String(order);
			}
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}	
		
		return result;
	}
	
	
 	/**
 	 * 	get all the orders related to specific user
 	 * 	@param	user	a string represent user name
 	 * 	@return			a list of orders objects
 	 */
	public List<Order> getOrders(String user) 
	{
		List<Order> result = new ArrayList<Order>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Order order = new Order();
		try
		{
			// 0. connect
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
				return result;
			}	
			
			// 1. create the orders list
			ps = this.connection.prepareStatement(SELECT_USERS_ORDERS);
			ps.setString(1, user);
			System.out.printf("%n%-15s %s%n", "DB >>", "get order for: " + user);
			rs = ps.executeQuery();
			while(rs.next()) {
				order.setIndex(rs.getInt(1));				// index
				order.setDate(rs.getLong(2));				// date
				order.setCustomer(rs.getString(3));			// customer
				order.setAddress(rs.getString(4));			// ship address
				order.setIsSupplied(rs.getBoolean(5));		// supplied
				order.setTotal(rs.getFloat(6));				// total
				order.setComment(rs.getString(7));			// comment
				//String[] products = rs.getString(8).split(";", 0);
				//List<String> prods	= Arrays.asList(products);
				order.setProducts(rs.getString(8));			// products
				//String s = this.order2JSON(order);
				// TODO: erase later
				//System.out.println("DB >> msgs: " + s);
				result.add(order);
			}
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}		
		return result;
	}
	
	/**
	 * get orders for a specific user
	 * @param:	customer, String that represent the customer name
	 * @return:	result, List of Strings	
	 */
	public List<String> getOrders1(String customer) 
	{
		List<String> result = new ArrayList<String>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		Order order = new Order();
		try
		{
			// 0. connect
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
				return result;
			}	
			
			// 1. create the orders list
			ps = this.connection.prepareStatement(SELECT_USERS_ORDERS);
			ps.setString(1, customer);
			System.out.printf("%n%-15s %s%n", "DB >>", "get order for: " + user);
			rs = ps.executeQuery();
			while(rs.next()) {
				order.setIndex(rs.getInt(1));				// index
				order.setDate(rs.getLong(2));				// date
				order.setCustomer(rs.getString(3));			// customer
				order.setAddress(rs.getString(4));			// ship address
				order.setIsSupplied(rs.getBoolean(5));		// supplied
				order.setTotal(rs.getFloat(6));				// total
				order.setComment(rs.getString(7));			// comment
				//String[] products = rs.getString(8).split(";", 0);
				//List<String> prods	= Arrays.asList(products);
				order.setProducts(rs.getString(8));			// products
				result.add(order2String(order));
			}
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}
		return result; 
	}
 	
	/**
	 * 	inserts a new order instance to DB
	 * 	@param	Order	order that holds all the info
	 * 	@return			null	
	 */
 	public int insertOrder(Order order)
 	{
 		int result = -1;
 		int index = 0;
 	 	PreparedStatement ps = null, ps1 = null;
		ResultSet rs = null, rs1 = null;
		String productsList = String.join(";", order.getProducts()); 
		//int length = order.getProducts().size();
		

	 	try
	 	{
	 		// 0. open connection
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
				return result;
			}
			
	 		// 1. get the max order index
			ps1 = this.connection.prepareStatement(SELECT_MAX_ORDER_IDX);
			rs1 = ps1.executeQuery();
			while(rs1.next())
				index = rs1.getInt(1);
	 		
	 		// 2. create the ordered products string "product1qty1, product2qty2,..."
			/*
			list.add(order.getProducts().get(0).getType() + Float.toString(order.getProducts().get(0).getPrice()));
			for(int i = 1; i < length; i++)
			{
				Product p = order.getProducts().get(i);
				String productQty = "," + p.getType() + Float.toString(p.getPrice());
				System.out.println(productQty);
				/*
				String productQty = "," + p.getCatalog() + Float.toString(p.getLength());
				System.out.printf("%-15s %s%n", "DB >> ", productQty);
				*
			}
	 		*/
			
	 		// 3. fire up the insert query
			ps = this.connection.prepareStatement(INSERT_ORDER);
			ps.setInt(1, ++index);									// index
			ps.setLong(2, order.getDate());							// date
			ps.setString(3, order.getCustomerName());				// customer
			ps.setString(4, order.getShipAddess());					// address
			ps.setBoolean(5, order.getIsSupplied());				// supplied
			ps.setFloat(6, order.getTotal());						// total
			ps.setString(7, order.getComment());					// comment
			ps.setString(8, productsList);							// products
			ps.execute();
			result = 0;
	 	}
	 	catch(Exception e)
	 	{
	 		e.printStackTrace();
	 	}
	 	finally
	 	{
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}
	 	return result;
 	}
	
 	/**
 	 * convert an order to a string
 	 */
 	private String order2String(Order order)
  	{
 		String result			= "";
 		String products			= "";
 		//List<String> prods		= order.getProducts();
 		//String prodStr			= new Gson().toJson(prods);
		Map<String,String> map 	= new HashMap<String,String>();
		
		try
		{
			/*
			for( int i = 0; i < prods.size(); i++)
			{
				String prodJson =  JSONValue.toJSONString(map);
				prodStr.concat(prodJson);
			}
			*/
			map.put("index", 	String.valueOf(order.getIndex()));
			map.put("customer", order.getCustomerName());
			map.put("address", 	order.getShipAddess());
			map.put("date", 	Long.toString(order.getDate()));
			map.put("supplied", Boolean.toString(order.getIsSupplied()));	
			map.put("comment", 	String.valueOf(order.getComment()));
			map.put("products", String.valueOf(order.getProducts()));
			map.put("total", 	String.valueOf(order.getTotal()));
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		result = JSONValue.toJSONString(map);
		System.out.printf("\n%-15s %s%n ", "DB >> ", "order products string: " + result);
 		
 		return result;
 	}
 	
 	/**
 	 * this function edits the order given to the function. 
 	 * @param 	order an Order object that holds the details of the updated order
 	 * @return	result non-negative int if successful, negative int else 
 	 */
 	public int editOrder(Order order) 
 	{
 		int result = -1;		
 		PreparedStatement ps = null;
		String productsList = String.join(";", order.getProducts()); 

	 	try
	 	{
	 		// 0. open connection
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
				return result;
			}
						
	 		// 3. fire up the insert query
			ps = this.connection.prepareStatement(EDIT_USERS_ORDERS);
			ps.setString(1, order.getShipAddess());					// address
			ps.setBoolean(2, order.getIsSupplied());				// supplied
			ps.setFloat(3, order.getTotal());						// total
			ps.setString(4, order.getComment());					// comment
			ps.setString(5, productsList);							// products
			ps.setInt(6, order.getIndex());							// products
			result = ps.executeUpdate();
			this.connection.commit();
			System.out.printf("%-15s %s%n", "DB >>", ps.getParameterMetaData());
	 	}
	 	catch(Exception e)
	 	{
	 		e.printStackTrace();
	 	}
	 	finally
	 	{
			try
			{
				if(ps != null) ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}
 		
 		return result;
 	}
 	
	
 	/************************************************************************
	*	PRODUCT related code here:  (insert, update, get all, etc. )
	*************************************************************************/
 	
 	/**
 	 *  loadProducts create Product records out of all the entries in the path,
 	 *  each entry is an image (picture) file that holds the product details in
 	 *  the file name. The file name has the following format: 
 	 *  'catalog'(string);'type'(string);price(float);length(float);
 	 *  'color'(string);'cross-section'(string). Note: the delimiter ';' must be
 	 *  used!! for example: "10;pine;10.5;20.2;light_grey;5X5type.jpg"
 	 *  @param:		String path, the directory where the files exist
 	 *  @return:		int, non-negative on success, negative otherwise
 	 */
 	public int loadProducts(String path)
 	{
 		Blob blob;
 		int result 				= -1;
 		File file				= null;
 		File[] paths			= null;
 		PreparedStatement ps 	= null;
 		String imageString		= "";
 		String coded_prefx		= "data:image/";
 		String coded_suffx		= ";base64,";
 		
 		
	 	try
	 	{
	 		
	 		System.out.printf("%-15s %s%n", "DB >>", "products from: " + path);	
	 		file = new File(path);
	 		paths = file.listFiles();
	 		
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return result;
			}
			
			for( File filePath : paths)
			{
				int lastIndex			= (filePath.toString()).lastIndexOf('\\');
				int lastDotIndex		= (filePath.toString()).lastIndexOf('.');
				String f				= (filePath.toString()).substring(lastIndex + 1, lastDotIndex); 
				String[] productDetails = (f.toString()).split(";");
				Path p					= Paths.get(filePath.toString());
				
				
				
				Optional<String> extn	= Utils.getExtensionByStringHandling(f);
				String codedPrefix		= coded_prefx + extn.get() + coded_suffx;
				byte[] codedPrefxBytes	= codedPrefix.getBytes();
				byte[] fileBytes 		= Files.readAllBytes(p); 
				byte[] allBytes			= new byte[codedPrefxBytes.length + fileBytes.length];
				
				System.arraycopy(fileBytes, 0, allBytes, 0, fileBytes.length);
				System.arraycopy(codedPrefxBytes, 0, allBytes, fileBytes.length, codedPrefxBytes.length); 
				
				imageString				= Base64.getEncoder().encodeToString(allBytes);
				blob					= new SerialBlob((codedPrefix + imageString).getBytes());
				
				System.out.printf("%-15s %s%n", "DB >>", "image source type: " + coded_prefx + extn.get() + coded_suffx);	
				
				ps = this.connection.prepareStatement(INSERT_PRODUCT);
				ps.setInt(1, Integer.valueOf(productDetails[0]));		// catalog
				ps.setString(2, productDetails[1]);						// type 
				ps.setFloat(3, Float.valueOf(productDetails[2]));		// price
				ps.setFloat(4, Float.valueOf(productDetails[3]));		// length
				ps.setString(5, productDetails[4]);						// color
				ps.setString(6, productDetails[5]);						// cross section
				ps.setBlob(7, blob);									// image 
				result = ps.executeUpdate();
				
				//if (result > 0)
				//	System.out.println("DB >> product " + product.getType() + " added");
				ps.close();
				
			}
			

			
	 	}
	 	catch(Exception e)
	 	{
	 		int line = e.getCause().getStackTrace()[0].getLineNumber();
	 		System.out.printf("%-15s %s%n", "DB >>", "exception line: " + line);
	 		
	 		if(((SQLException)e).getSQLState().equals("23505"))
	 		{
	 			System.out.printf("%-15s %s%n", "DB >>", "product already exist: ");
	 		}
	 		else
	 			e.printStackTrace();
	 	}

	 	finally
	 	{
			try
			{
				if(ps != null)
					ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}
 		
 		return result;
 	}
 	
 	/**
 	 * 	insert a new product to DB
 	 * 	@param	product	Product	a product object
 	 * 	@return			int		non negative upon success, negative else	
 	 */
 	public int insertProduct(Product product)
 	{
 		int result = -1;
 		PreparedStatement ps = null;
	 	try
	 	{
	 		Blob blob;
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return result;
			}
			ps = this.connection.prepareStatement(INSERT_PRODUCT);
			
			ps.setInt(1, product.getCatalog());
			ps.setString(2, product.getType());
			ps.setFloat(3, product.getPrice());
			ps.setFloat(4, product.getLength());
			ps.setString(5, product.getColor());
			ps.setBlob(6, product.getImage()); 
			result = ps.executeUpdate();
			
			if (result > 0)
				System.out.println("DB >> product " + product.getType() + " added");	

				// augment message branch
				// System.out.printf("%-15s %s%n", "DB >> ", "product " + product.getCatalog() + " added");	

			
			
	 	}
	 	catch(Exception e)
	 	{
	 		e.printStackTrace();
	 	}
	 	finally
	 	{
			try
			{
				if(ps != null)
					ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}		
 		return result;
 	}
 	
 	
 	/**
 	 *  delete a product from the products list
 	 *  @param:		catalog, int the product unique identifier
 	 *  @return		int, non-negative upon success, negative, else
 	 */
 	public int deleteProduct(int catalog)
 	{
 		int result = -1;
 		PreparedStatement ps = null;
	 	try
	 	{
	 		//Blob blob;
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return result;
			}
			ps = this.connection.prepareStatement(REMOVE_PRODUCT);
			
			ps.setInt(1, catalog);
			result = ps.executeUpdate();
	 	}
	 	catch(Exception e)
	 	{
	 		e.printStackTrace();
	 	}
	 	finally
	 	{
			try
			{
				if(ps != null)
					ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}	
 		
 		
 		return result;
 	}
 	
 	/**
 	 * 	insert ordered product. ordered product is a table that binds a product
 	 * 	to a specific ordered length. 
 	 * 	@param	product		Product object that holds the product info
 	 * 	@return				null
 	 */
 	public void insertOrderedProduct(Product product)
 	{
 		PreparedStatement ps = null;
	 	try
	 	{
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return;
			}
			ps = this.connection.prepareStatement(INSERT_ORDERED_PRODUCT);
			
//			ps.setString(1, Integer.toString(product.getCatalog()) + Float.toString(product.getLength()));
			ps.setString(1, product.getType());
			ps.setFloat(2, product.getPrice());
			ps.setBlob(3,product.getImage());
//			ps.setInt(2, product.getCatalog());
//			ps.setInt(3, (int)product.getLength());
//			ps.setString(4, product.getColor());
			ps.execute();
	 	}
	 	catch(Exception e)
	 	{
	 		e.printStackTrace();
	 	}
	 	finally
	 	{
			try
			{
				if(ps != null)
					ps.close();
				this.disconnect();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
	 	}
 	}
 	
 	/**
 	 * 	gets a string like: "product1qty1, product2qty2,..." parse it into
 	 * 	product1qty1, product2qty2,.. extracts the product key for each
 	 * 	product-quantity key and creates the appropriate product object 
 	 * 	@param	list	a string of the form "product1qty1,product2qty2,.."
 	 * 	@return			a list of products according to product1, product2,..
 	 */
 	private List<Product> productsFromList(String list)
 	{
 		List<Product> result = new ArrayList<Product>();
 		String[] products = list.split(",");
 		PreparedStatement ps = null, ps1 = null;
 		ResultSet rs = null, rs1 = null;
 		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return null;
			}
					
	 		for(String s: products)
	 		{
	 			long id = 0;
	 			Product product = new Product();
	 			
	 			// get the product id from ordered products table
	 			ps = this.connection.prepareStatement(SELECT_ORDERED_PRODUCT);	
	 			ps.setLong(1, Long.parseLong(s));
	 			rs = ps.executeQuery();
	 			rs.next();
	 			
	 			// get product from products table and create Product object
	 			ps1 = this.connection.prepareStatement(SELECT_PRODUCT);
	 			id = rs.getLong(1);
	 			rs1 = ps1.executeQuery();
	 			while(rs1.next())
	 			{
//	 				product.setCatalog(rs1.getInt(1));
	 				product.setType(rs1.getString(1));
	 				product.setPrice(rs1.getFloat(2));
//	 				product.setLength(rs1.getFloat(4));
//	 				product.setColor(rs1.getString(5));
	 			}
	 			result.add(product);
	 		}
		}
 		catch(Exception e)
		{
 			
		}
		finally
		{
			this.disconnect();
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				if(rs1 != null) rs1.close();
				if(ps1 != null) ps1.close();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}
 		
 		return result;
 	}

 		
 	/**
 	 * 	get ALL the products from the DB
 	 * 	@parameter		null
 	 * 	@return 		a list of Product objects
 	 */
 	public List<Product> getProducts()
 	{
 		List<Product> result = new ArrayList<Product>();
 		PreparedStatement ps = null;
 		ResultSet rs = null;
 		
		try
		{
			if(this.connect() < 0)
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return null;
			}
			ps = this.connection.prepareStatement(SELECT_ALL_PRODUCTS);	
 			rs = ps.executeQuery();
 			
	 		while(rs.next())
	 		{
 				Product product = new Product();
// 				product.setCatalog(rs.getInt(1));
 				product.setType(rs.getString(1));
 				product.setPrice(rs.getFloat(2));
// 				product.setLength(rs.getFloat(4));
// 				product.setColor(rs.getString(5));
 				System.out.println("reading the blob...");
 				//product.setImage(rs.getBytes(3));
 				result.add(product); 
	 		}
		}
 		catch(Exception e)
		{
 			
		}
		finally
		{
			this.disconnect();
			try
			{
				if(rs != null) rs.close();
				if(ps != null) ps.close();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}
 		
 		
 		return result;
 	}
 	public List<String> getProducts1()
 	{
 		List<String> result 	= new ArrayList<String>();
 		PreparedStatement ps 	= null;
		ResultSet rs 			= null;
		Product product 		= null;
		
		try
		{
			if(this.connect() < 0)
			{
				System.out.printf("%-15s %s%n", "DB>>", "cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.printf("%-15s %s%n", "DB>>", "getting all products");
			product = new Product();
			
			this.connection.setAutoCommit(false); 
			ps = this.connection.prepareStatement(SELECT_ALL_PRODUCTS); 
			rs = ps.executeQuery();
			
			 
			while(rs.next())
			{
				product.setCatalog(rs.getInt(1));				// catalog
				product.setType(rs.getString(2));				// type
				product.setPrice(rs.getFloat(3));				// price
				product.setLength(rs.getFloat(4));				// length
				product.setColor(rs.getString(5));				// color
				product.setCS(rs.getString(6));					// cross section
				product.setImage(rs.getBlob(7));				// image
				String s = product2JSON(product);
				result.add(s);
			}
			this.connection.commit();
		}
		catch(SQLException e)
		{
			if("08003".equals(e.getSQLState())) 
				System.out.printf("%-15s %s%n", "DB>>", "no connection..");
			else if("XCL16".equals(e.getSQLState()))
				System.out.printf("%-15s %s%n", "DB>>", "operation next not permitted..");
				
			e.printStackTrace();
		}
		finally
		{
			this.disconnect();
			try 
			{
				if(ps != null && !ps.isClosed())
					ps.close();
				if(rs != null && !rs.isClosed())
					rs.close();
			} 
			catch (SQLException e1) 
			{
				if(e1.getSQLState().equals("XCL16"))
					System.out.printf("%-15s %s%n", "DB >>", "result set is closed");
				e1.printStackTrace();
			}
		}
 		
 		return result;
 	}
 	
 	
 	private String product2JSON(Product product) 
 	{
 		String result = "";
 		
 		Blob blob = product.getImage();
		Map<String,String> map = new HashMap<String,String>();
		try
		{
			map.put("catalog", String.valueOf(product.getCatalog()));
			map.put("type", product.getType());
			map.put("price", String.valueOf(product.getPrice()));	
			map.put("length", String.valueOf(product.getLength()));
			map.put("color", product.getColor());
			map.put("crossSection", product.getCS());

			if(blob == null)
				map.put("image", "");
			else 
				map.put("image", new String(blob.getBytes(1, (int)blob.length())));
			
			// TODO: try map.put("image", new String(blob.getBytes(0, (int)blob.length() - 1 )));
			// and correct client side
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		result = JSONValue.toJSONString(map);
 		
 		return result;
 	}
 	
 	/**************************************************************************
	*	general methods
	***************************************************************************/ 
	
	/**
	 * shut down the database
	 * @param	null
	 * @return	non-negative integer if successful, negative else
	 */
	public int shutDown()
	{
		int result = -1;
		
		try
		{
        	Class.forName(DB.driverURL);
        	DB.dbURL = "jdbc:derby:;shutdown=true";
			System.out.printf("%-15s %s%n", "DB >> ", "database url: " + DB.dbURL);	
			if (this.connection == null)
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else if (this.connection.isClosed())
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else
				System.out.printf("%-15s %s%n", "DB >> ", "connected to database: " + DB.dbName);	
			result = 0;
		}
		catch(Exception e)
		{
			if(((SQLException) e).getSQLState().equals("XJ015")) {
				System.out.printf("%-15s %s%n", "DB >> ", "shutting down..");
	        }
		}
		
		return result;
	}

	/*
	 *  getters-=setters *
	 */
	public void setConnection(Connection con) { this.connection = con; }
	
	
	/*
	 *  class 2 JSON
	 */
	static <T> String class2JSON(T clas)
	{
		String result = "";
		Map<String,String> map = new HashMap<String,String>();
		
        Field[] fields = ((Class<?>)clas).getDeclaredFields();
        System.out.printf("%d fields:%n", fields.length);
        try 
    	{
	        for (Field field : fields) 
	        {
	        	System.out.println("field: " + field.getName() + " has value: " + field.get(clas) );
            	map.put(field.getName(), user.getName());
	        }
    	}
    	catch (IllegalArgumentException e) 
    	{
			e.printStackTrace();
		} 
    	catch (IllegalAccessException e) 
    	{
			e.printStackTrace();
		}
        
        return result;
	}
	

}

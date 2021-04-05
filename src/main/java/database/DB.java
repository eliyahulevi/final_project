/**
 *  sources:
 	statements :  		https://docs.oracle.com/javase/tutorial/jdbc/basics/processingsqlstatements.html 
	SQL error codes:  	https://db.apache.org/derby/docs/10.4/ref/rrefexcept71493.html 
 */
package database;

import java.sql.Statement;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.product.AlternativeProduct;
import model.users.*;
import model.message.*;

import appConstants.*;
import jdk.internal.jshell.tool.StopDetectingInputStream.State;

import org.json.simple.JSONValue;
import java.util.HashMap;
import java.util.Map;

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

	boolean firstTime = true;
	
	static String dbURL = "";
	static String dbPath = "";
	static String dbName = "";
	static String driverURL = "";
	
	
	static User user;
	String[] tables_str = {"USERS", "MESSAGES", "CHANNELS", "PRODUCTS", "ORDERS", "ORDER_PRODUCT" ,"IMAGES", "USER_IMAGES"};
	
	PreparedStatement prepStatement;
	Statement statement;
	Connection connection;
	ResultSet rs;
	Map<String, String> map;
	
	//sql statements
	private final String CREATE_TABLE = "CREATE TABLE ";				// MAYBE FOR FUTURE USE
	private final String CHECK_TABLE_EXIST = "IF (EXISTS (SELECT * "
			+ "FROM INFORMATION_SCHEMA.TABLES "
			+ "WHERE TABLE_SCHEMA = 'TheSchema' "
			+ "AND  TABLE_NAME = 'TheTable'))"
			+ "BEGIN "
			+ "    --Do Stuff\r\n"
			+ "END";
	private final String CREATE_USERS_TABLE = "CREATE TABLE " + tables_str[0] + "("  
			+ "USERNAME varchar(40),"
			+ "PASSWORD varchar(8),"
			+ "NICKNAME varchar(30),"
			+ "ADDRESS varchar(50),"
			+ "PHOTO varchar(100),"
			+ "DESCRIPTION varchar(200),"
			+ "PRIMARY KEY(USERNAME)"
			+ ")";
	private final String CREATE_MESSAGE_TABLE = "CREATE TABLE " + tables_str[1] + "("
			+ "USERDATE varchar(100) PRIMARY KEY,"
			+ "SENDER varchar(20),"
			+ "USERNAME varchar(20),"
			+ "CONTENT varchar(500),"
			+ "DATE varchar(20),"
			+ "IMAGE BLOB,"
			+ "CLICKED boolean"
			+ ")";

	private final String CREATE_CHANNEL_TABLE = "CREATE TABLE " + tables_str[2] + "("
			+ "NAME varchar(30),"
			+ "DESCRIPTION varchar(500)"
			+ ")";
	private final String CREATE_PRODUCT_TABLE = "CREATE TABLE " + tables_str[3] + "("
			+ "PRODUCT_ID int PRIMARY KEY,"
			+ "TYPE int,"
			+ "PRICE float(10),"
			+ "LENGTH float(10),"
			+ "COLOR varchar(10))"; 
	private final String CREATE_ORDER_TABLE = "CREATE TABLE " + tables_str[4] + "("
			+ "ORDER_ID int PRIMARY KEY,"
			+ "DATE varchar(20),"
			+ "SHIPADDREDD varchar(100),"
			+ "STATUS int," 
			+ "CUSTOMERNAME varchar(100),"
			+ "COLOR varchar(10))"; 
	private final String CREATE_ORDER_PRODUCT_TABLE = "CREATE TABLE " + tables_str[5] + "("
			+ "ORDER_ID int,"
			+ "PRODUCT_ID int,"
			+ "FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)," 
		    + "FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 
	private final String CREATE_IMAGES_TABLE = "CREATE TABLE " + tables_str[6] + "("
			+ "IMAGE_ID int PRIMARY KEY,"
			+ "IMG BLOB"
			//+ "FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)," 
		    //+ "FOREIGN KEY (IMAGE_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 
	private final String CREATE_USER_IMAGES_TABLE = "CREATE TABLE " + tables_str[7] + "("
			+ "IMAGE_NAME varchar(100) PRIMARY KEY,"
			+ "IMG BLOB,"
			+ "USERNAME varchar(40),"
			+ "FOREIGN KEY (USERNAME) REFERENCES USERS(USERNAME)" 
		    //+ "FOREIGN KEY (IMAGE_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 
	

	private String ABORT_CONNECTION = 		"NO CONNECTION.. ABORTING";
	private String SELECT_IMAGE = 			"SELECT IMAGE FROM IMAGES WHERE";
	private String INSERT_USER = 			"INSERT INTO USERS VALUES (?, ?, ?, ?, ?, ?)";
	private String INSERT_USER_MESSAGE = 	"INSERT INTO MESSAGES VALUES (?, ?, ?, ?, ?, ?, ?)";
	private String INSERT_USER_IMAGE = 		"INSERT INTO USER_IMAGES VALUES (?, ?, ?)";
	private String SELECT_USERS_MESSAGE=	"SELECT * FROM MESSAGES WHERE USERNAME=?";
	private String SELECT_USERS = 			"SELECT * FROM USERS";
	private String SELECT_MESSAGES = 		"SELECT * FROM MESSAGES";
	private String SELECT_USERS_NAMES = 	"SELECT USERNAME FROM USERS";
	private String SELECT_USER		=		"SELECT * FROM USERS WHERE USERNAME=? AND PASSWORD=?";
	private String INSERT_PRODUCT = 		"INSERT INTO PRODUCTS VALUES (?, ?, ?, ?, ?)";
	private String SELECT_ORDER = 			"SELECT * FROM PRODUCTS WHERE PRODUCT_ID=?";
	private String UPDATE_TABLE_CLICKED = 	"UPDATE MESSAGES SET CLICKED = ? WHERE USERDATE = ?";
	//private String SELECT_MAX_IMAGE_IDX="SELECT MAX(IMAGE_ID) FROM USER_IMAGES";
	
	String[] createQueryString = {	CREATE_USERS_TABLE, 
									CREATE_MESSAGE_TABLE, 
									CREATE_CHANNEL_TABLE, 
									CREATE_PRODUCT_TABLE, 
									CREATE_ORDER_TABLE, 
									CREATE_ORDER_PRODUCT_TABLE,
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
		this.user = new User();
		for(String s: this.tables_str)
		{
			this.map.put(s, createQueryString[count]); 
			System.out.println("tabel: " + s + " has query "+ createQueryString[count]);
			count++;
		}
		try 
		{
			//Class.forName(driverURL);
			this.createAdmin(); 		
			this.createTables();
			if (this.isEmpty("USERS"))
				this.insertUser(this.user, true);
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
	private void createAdmin()
	{
		this.user.setName("admin");
		this.user.setNickName("administrator");
		this.user.setAddress("1501 Yemmen road, Yemmen");
		this.user.setEmail("israel@gmail.com");
		this.user.setPassword("1234");
		this.user.setPhone("050-55555351");
		this.user.setDescription("Joey doesn't share food!!");
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
						System.out.println("table: " + tables_str[index] + " created");
					}
					else
						System.out.println("table: " + tables_str[index] + " exists");
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
	private int connect()
	{
		int result = -1;
        try 
        {
        	Class.forName(DB.driverURL).newInstance();
			System.out.println("DB >> database url: " + DB.dbURL);	
			if (this.connection == null)
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else if (this.connection.isClosed())
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else
				System.out.println("DB >> connected to database: " + DB.dbName);	
			result = 0;
			
        }
        catch(SQLException | ClassNotFoundException | InstantiationException | IllegalAccessException e)
        {
        	System.out.println("\n>>DB >>  error: " + e.getMessage());
        	if(((SQLException) e).getSQLState().equals("XJ040"))
        	{
        		System.out.println("DB >> db exist already");
        		try 
        		{
        			Class.forName("org.apache.derby.jdbc.ClientDriver").newInstance();
    				DB.dbURL = "jdbc:derby:" + "C:/final_project/ClientsDB";//DB.dbPath + ";";
    				System.out.println("DB >> dbURL: " + DB.dbURL);
					this.connection = DriverManager.getConnection(DB.dbURL);
				} 
        		catch (SQLException | InstantiationException | IllegalAccessException | ClassNotFoundException e1) 
        		{
					e1.printStackTrace();
				}
        	}
        	
        }
        
        return result;
	}
	private int disconnect() 
	{
		int result = -1;
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				try 
				{
					this.connection.close();
					System.out.println("DB >> disconnect from database: " + dbName);
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
				System.out.println("no connection to DB");
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
			System.out.println("tabel " + tabelName + " has " + count + " records");
		}

		return result;
	}
	
	/************************************************************************
	*	USER related code here: (insert, update, get all, etc. )
	*************************************************************************/		
	/*
	 *	user to JSON format 
	 */
	private String user2JSON(User user)
	{
		String result = "";
		
		Map<String,String> map = new HashMap<String,String>();
		map.put("username", user.getName());
		map.put("password", user.getPassword());
		map.put("nickname", user.getNickName());
		map.put("email", user.getEmail());
		map.put("phone", user.getPhone());
		map.put("address", user.getAddress());
		
		result = JSONValue.toJSONString(map);
		return result;
	}
	/*
	 *  get all users 
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
				System.out.println(rs.getString(1));
				String name = rs.getString(1); 
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
	 *  insert a new user 
	 */
 	public void insertUser(User user, boolean first) 
	{
 		PreparedStatement state = null;
		String dateString = "";
		LocalTime date = LocalTime.now();
		if (!first)
			dateString = date.toString(); 
				
		try 
		{
			// connect to db
			if (this.connect() < 0 )
			{
				System.out.println("DB >> cannot connect to database.. aborting");
				return;
			}
			// insert user			
			state = this.connection.prepareStatement(INSERT_USER);
			state.setString(1, user.getName());	
			state.setString(2, user.getPassword());		//email
			state.setString(3, user.getNickName());		//phone
			state.setString(4, user.getAddress());		//address
			state.setString(5, user.getPhoto());		//photo
			state.setString(6, user.getDescription());	//password
			state.executeUpdate();
			System.out.println("DB >> user " + user.getName() + " added");				
		} 
		catch (SQLException e) 
		{
			if (e.getSQLState().equals("42X05"))
			{
				System.out.println("DB >> error >> need to update table");
				this.createTable(CREATE_USERS_TABLE);
				this.insertUser(user, first);
			}
			else if(e.getSQLState() == "23505")
				System.out.println("DB >> warning >> user alerady exist");
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
	 *  find user 
	 */
	public boolean findUser(String name, String password)
	{
		boolean result = false;
		ResultSet res = null;
		PreparedStatement state = null;
				
		try 
		{
			System.out.println("in db searching for user " + name + " with password " + password);
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
					System.out.println("user " + name + "  found"); 
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
	public String findUser1(String name, String password)
	{
		String result = "";
		ResultSet res = null;
		PreparedStatement state = null;
				
		try 
		{
			System.out.println("in db searching for user " + name + " with password " + password);
			if (this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
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
					User user = new User(res.getString(1), res.getString(2), res.getString(3), res.getString(4), res.getString(5) );
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
	
	
	/************************************************************************
	*	MESSAGE related code here:  (insert, update, get all, etc. )
	*************************************************************************/	
	/*
	 *  convert message to JSON format
	 */
	private String message2JSON(Message message)
	{
		String result = "";
		Blob blob = message.getImage();
		Map<String,String> map = new HashMap<String,String>();
		System.out.println("DB >> " + message.getUser());
		try
		{
			
			map.put("user", message.getUser());
			map.put("sender", message.getSender());
			map.put("date", message.getDate());
			map.put("message", message.getMessage());	
			map.put("clicked", String.valueOf(message.getClicked()));
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
	 *  get messages (for  a given user)
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
				System.out.println("DB >> cannot connect to database.. aborting");
				System.exit(-1);
			}
			System.out.println("DB >> getting messages for: " + user);
			message = new Message();
			//String statement = this.SELECT_USERS_MESSAGE + "'" + user + "'";
			
			ps = this.connection.prepareStatement(SELECT_USERS_MESSAGE); 
			ps.setString(1, user);
			rs = ps.executeQuery();
			
			while(rs.next())
			{
				message.setSender(rs.getString(2));				// sender
				message.setUser(rs.getString(3));				// user
				message.setMessage(rs.getString(4));			// message content
				message.setDate(rs.getString(5));				// date
				message.setImage(rs.getBlob(6));				// image source
				message.setClicked(rs.getBoolean(7));			// clicked
				
				String s = this.message2JSON(message);
				// TODO: erase later
				System.out.println("DB >> msgs: " + s);
				result.add(s);
			}
		}
		catch(Exception e)
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
				e1.printStackTrace();
			}
		}
		
		return result;
	}
	
	/*
	 *  insert user message
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
			
			ps = this.connection.prepareStatement(this.INSERT_USER_MESSAGE);
			ps.setString(1, message.getUser() + message.getDate());
			ps.setString(2, message.getSender());
			ps.setString(3, message.getUser());
			ps.setString(4, message.getMessage());
			ps.setString(5, message.getDate());
			ps.setBlob(6, message.getImage());
			ps.setBoolean(7, message.getClicked());
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

	/*
	 * 	update 'message' clicked field
	 */
	public int messageClicked(String user, String date)
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
			ps.execute();
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

	
	
	/************************************************************************
	*	IMAGE related code here:  (insert, update, get all, etc. ), this 
	*	section might by unified with MESSAGE section
	*************************************************************************/	
 	public int insertImage(String imgName, String user, Blob image)
	{
		int result = -1;
		int index = 0;
		PreparedStatement insert = null;
		PreparedStatement max = null;
		ResultSet rs = null;
		try
		{
			System.out.println("DB >> upload image");
			if(this.connect() < 0)
			{
				System.out.println("cannot connect to database.. aborting");
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
				System.out.println("result set failed to close");
			}
			this.disconnect();	
		}
		
		
		return result;
	}
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
			System.out.println("in db searching for order id " + orderID);
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
	
	
	
	
	
	
	/**************************************************************************
	*								general methods
	***************************************************************************/ 
	
	/*
	 * shut down the database
	*/
	public int shutDown()
	{
		int result = -1;
		
		try
		{
        	Class.forName(DB.driverURL);
        	DB.dbURL = "jdbc:derby:;shutdown=true";
			System.out.println("DB >> database url: " + DB.dbURL);	
			if (this.connection == null)
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else if (this.connection.isClosed())
				this.connection = DriverManager.getConnection(DB.dbURL);		
			else
				System.out.println("DB >> connected to database: " + DB.dbName);	
			result = 0;
		}
		catch(Exception e)
		{
			if(((SQLException) e).getSQLState().equals("XJ015")) {
				System.out.println("DB >> shutting down..");
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
		
        Field[] fields = ((Class)clas).getDeclaredFields();
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

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
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.product.AlternativeProduct;
import model.users.*;

import appConstants.*;
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
	
	private static String dbPath = "";
	String dbName = "ClientsDB";
	//String dbPath = "C:\\\\databases\\\\";
	String driverURL = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbURL = "";
	String[] TABLES_STR  = {"USERS","MESSAGES"};
	User user = new User();
	String[] tables_str = {"USERS", "MESSAGES", "CHANNELS", "PRODUCTS", "ORDERS", "ORDER_PRODUCT" };
	
	PreparedStatement prepStatement;
	Statement statement;
	Connection connection;
	ResultSet rs;
	Map<String, String> map;
	
	//sql statements
	public final String CREATE_TABLE = "CREATE TABLE ";				// MAYBE FOR FUTURE USE
	public final String CHECK_TABLE_EXIST = "IF (EXISTS (SELECT * "
			+ "FROM INFORMATION_SCHEMA.TABLES "
			+ "WHERE TABLE_SCHEMA = 'TheSchema' "
			+ "AND  TABLE_NAME = 'TheTable'))"
			+ "BEGIN "
			+ "    --Do Stuff\r\n"
			+ "END";
	public final String CREATE_USERS_TABLE = "CREATE TABLE " + tables_str[0] + "("  
			+ "USERNAME varchar(40),"
			+ "PASSWORD varchar(8),"
			+ "NICKNAME varchar(30),"
			+ "ADDRESS varchar(50),"
			+ "PHOTO varchar(100),"
			+ "DESCRIPTION varchar(200),"
			+ "PRIMARY KEY(USERNAME)"
			+ ")";
	public final String CREATE_MESSAGE_TABLE = "CREATE TABLE " + tables_str[1] + "("
			+ "PHOTO varchar(100) PRIMARY KEY,"
			+ "NICKNAME varchar(20),"
			+ "TIME timestamp,"
			+ "CONTENT varchar(500),"
			+ "REPLYABLE char)";

	public final String CREATE_CHANNEL_TABLE = "CREATE TABLE " + tables_str[2] + "("
			+ "NAME varchar(30),"
			+ "DESCRIPTION varchar(500)"
			+ ")";
	public final String CREATE_PRODUCT_TABLE = "CREATE TABLE " + tables_str[3] + "("
			+ "PRODUCT_ID int PRIMARY KEY,"
			+ "TYPE int,"
			+ "PRICE float(10),"
			+ "LENGTH float(10),"
			+ "COLOR varchar(10))"; 
	public final String CREATE_ORDER_TABLE = "CREATE TABLE " + tables_str[4] + "("
			+ "ORDER_ID int PRIMARY KEY,"
			+ "DATE varchar(20),"
			+ "SHIPADDREDD varchar(100),"
			+ "STATUS int," 
			+ "CUSTOMERNAME varchar(100),"
			+ "COLOR varchar(10))"; 
	public final String CREATE_ORDER_PRODUCT_TABLE = "CREATE TABLE " + tables_str[5] + "("
			+ "ORDER_ID int,"
			+ "PRODUCT_ID int,"
			+ "FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)," 
		    + "FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID)"
		    //+ "UNIQUE (PRODUCT_ID, ORDER_ID)"
			+ ")"; 
	
	//public final String CREATE_ALT_ORDER_TABLE = "CREATE TABLE " + tables_str[4] + "("
	//		+ "ORDER_ID int PRIMARY KEY,"
	//		+ "USERNAME varchar(50)" //?
	//		+ "TYPE varchar(10)
	//		+ "LENGTH int"
	//		+ "QUANTITY int";
	
	public String INSERT_USER = 		"INSERT INTO USERS VALUES (?, ?, ?, ?, ?, ?)";
	public String SELECT_USERS = 		"SELECT * FROM USERS";
	public String SELECT_USERS_NAMES = 	"SELECT USERNAME FROM USERS";
	public String SELECT_USER		=	"SELECT * FROM USERS WHERE USERNAME=? AND PASSWORD=?";
	public String INSERT_PRODUCT = 		"INSERT INTO PRODUCTS VALUES (?, ?, ?, ?, ?)";
	public String SELECT_ORDER = 		"SELECT * FROM PRODUCTS WHERE PRODUCT_ID=?"; 
	
	String[] queryString = {CREATE_USERS_TABLE, CREATE_MESSAGE_TABLE, CREATE_CHANNEL_TABLE, CREATE_PRODUCT_TABLE, CREATE_ORDER_TABLE, CREATE_ORDER_PRODUCT_TABLE };
	
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
	
	/*
	 *	 private methods	
	 */
	private void init() 
	{
		int count = 0;
		this.map = new HashMap<String, String>();
		this.dbURL = "jdbc:derby:" + DB.dbPath + ";create=true";
		for(String s: this.tables_str)
		{
			this.map.put(s, queryString[count]); 
			System.out.println("tabel: " + s + " has query "+ queryString[count]);
			count++;
		}
		this.createExampleUser(); 		// debug use only!!
		this.createTables();
		if (this.isEmpty("USERS"))
			this.insertUser(this.user, true);
		this.firstTime = false;
	}	
	private void createExampleUser()
	{
		this.user.setName("israel");
		this.user.setNickName("israelite");
		this.user.setAddress("1501 Yemmen road, Yemmen");
		this.user.setEmail("israel@gmail.com");
		this.user.setPassword("1234");
		this.user.setPhone("050-55555351");
		this.user.setDescription("Joey doesn't share food!!");
	}
	private void createTables()
	{
		ResultSet rs;
		
		String[] createTables = {	CREATE_USERS_TABLE, 
									CREATE_MESSAGE_TABLE, 
									CREATE_CHANNEL_TABLE, 
									CREATE_PRODUCT_TABLE,
									CREATE_ORDER_TABLE,
									CREATE_ORDER_PRODUCT_TABLE };
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				this.statement = this.connection.createStatement();
				DatabaseMetaData dbmd = this.connection.getMetaData();
				
				for (int index = 0; index < createTables.length; index++)
				{
					rs = dbmd.getTables(null, null, tables_str[index], null);
					if (!rs.next())
					{
						this.statement.executeUpdate(createTables[index]);
						System.out.println("create table: " + tables_str[index]);
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
	}
	private void createTable(String createTableQuery)
	{
		try 
		{
			if (this.connection != null && !this.connection.isClosed())
			{
				this.statement = this.connection.createStatement();
				this.statement.executeUpdate(createTableQuery);
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	private void connect()
	{
        try 
        {
			Class.forName(driverURL);
			this.dbURL = "jdbc:derby:" + DB.dbPath + ";create=true";
			System.out.println("database url: " + dbURL);	
			connection = DriverManager.getConnection(dbURL);		
			
			if (!connection.isClosed())
			{
				System.out.println("connected to database: " + dbName);	
			}
        }
        catch(SQLException | ClassNotFoundException e)
        {
        	e.printStackTrace();
        }
	}
	private void disconnect() 
	{
		try 
		{
			if (!this.connection.isClosed())
			{
				try 
				{
					this.connection.close();
					System.out.println("disconnect from database: " + dbName);
				} 
				catch (SQLException e) 
				{
					e.printStackTrace();
				}
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	private boolean isEmpty(String tabelName)
	{
		int count = 0;
		boolean result = true;
		String queryString = "SELECT * FROM " + tabelName;
		ResultSet rs;
		
		this.connect();
		try 
		{
			PreparedStatement state = this.connection.prepareStatement(queryString);
			rs = state.executeQuery();
			while ( rs.next() ) 
				count++;
			result = count > 0 ? false : true;
			
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
		
		this.disconnect();
		
		System.out.println("tabel " + tabelName + " has " + count + " records");
		return result;
	}
	
	
	/*
	 *  get all users 
	 */
	public List<String> getUsersNames()
	{
		List<String> result = new ArrayList<String>();
		ResultSet rs;
		
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
			this.disconnect();
		}
		
		return result;
	}
	
	/*
	 *  insert a new user 
	 */
 	public void insertUser(User user, boolean first) 
	{
		String dateString = "";
		LocalTime date = LocalTime.now();
		if (!first)
			dateString = date.toString(); 
				
		try 
		{
			// connect to db
			connect();
			// insert user			
			PreparedStatement state = this.connection.prepareStatement(INSERT_USER);
			state.setString(1, user.getName() + dateString);	
			state.setString(2, user.getPassword());		//email
			state.setString(3, user.getNickName());		//phone
			state.setString(4, user.getAddress());		//address
			state.setString(5, user.getPhoto());		//photo
			state.setString(6, user.getDescription());	//password
			state.executeUpdate();
			System.out.println("user " + user.getName() + " added");				
		} 
		catch (SQLException e) 
		{
			if (e.getSQLState() == "42X05")
			{
				System.out.println("error >> need to update table");
				this.createTable(CREATE_USERS_TABLE);
				this.insertUser(user, first);
			}
			else if(e.getSQLState() == "23505")
				System.out.println("warning >> user alerady exist");
			else
				e.printStackTrace();
		}
		finally
		{
			//disconnect
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
				
		try 
		{
			System.out.println("in db searching for user " + name + " with password " + password);
			this.connect();
			PreparedStatement state = this.connection.prepareStatement(SELECT_USER);
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
			this.disconnect();
		}
				
		return result;
	}
	public String findUser1(String name, String password)
	{
		String result = "";
		ResultSet res = null;
				
		try 
		{
			System.out.println("in db searching for user " + name + " with password " + password);
			this.connect();
			PreparedStatement state = this.connection.prepareStatement(SELECT_USER);
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
			this.disconnect();
		}
				
		return result;
	}
	
	/*
	/ user to JSON format 
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
	
	/*
	 *  getters-=setters *
	 */
	public void setConnection(Connection con) { this.connection = con; }
	
	

}

package appConstants;

public interface AppConstants 
{
	final String userName = "USERNAME";
	final String password = "PASSWORD";
	final String dbName = "ClientsDB";
	final String driverURL = "org.apache.derby.jdbc.EmbeddedDriver";
	final String dbURL = "jdbc:derby:" + dbName + ";create=true";
	
	public String Get_userName();
	public String Get_password();
	public String Get_dbName();
	public String Get_driverURL();
	public String Get_dbURL();
	
}

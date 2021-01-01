package webapp.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import database.DB;

/**
 * Application Lifecycle Listener implementation class Listener
 *
 */
@WebListener
public class Listener implements ServletContextListener, HttpSessionListener 
{
	String dbName = "ClientsDB";
	String driverURL = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbURL = "jdbc:derby:" + dbName + ";create=true";
	Connection conn;
	DB db;

    /**
     * Default constructor. 
     */
    public Listener() {}
    
	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent sce)  
    { 
    	
        System.out.println("context initialized..");
        try 
        {
			Class.forName(driverURL);
			conn = DriverManager.getConnection(dbURL);		
			if (!conn.isClosed())
			{
				this.db = new DB(conn);
				System.out.println("data base created: " + dbName);	
			}
			
		} 
        catch (Exception e) 
        {
			e.printStackTrace();
		}
        finally
        {
        	try 
        	{
				this.conn.close();
			} 
        	catch (SQLException e) 
        	{
				e.printStackTrace();
			}
        }
    }
	/**
     * @see HttpSessionListener#sessionCreated(HttpSessionEvent)
     */
    public void sessionCreated(HttpSessionEvent se)  { 
         
    }

	/**
     * @see HttpSessionListener#sessionDestroyed(HttpSessionEvent)
     */
    public void sessionDestroyed(HttpSessionEvent se)  { 
       
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent sce)  { 
         
    }
	
}

package webapp.listeners;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import database.DB;

//import org.apache.tomcat.dbcp.dbcp.BasicDataSource;


/**
 * Application Lifecycle Listener implementation class Listener
 *
 */
@WebListener
public class Listener implements ServletContextListener, HttpSessionListener 
{

	String driverURL = "org.apache.derby.jdbc.EmbeddedDriver";
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
    	
        System.out.printf("%-15s %s%n", "listener >> " ,"context initialized..");

        try 
        {

			Context context = new InitialContext();
			Context env = (Context) context.lookup("java:comp/env");
			String dbPath = (String)env.lookup("DB-PATH");
			String dbName = (String)env.lookup("DB-NAME");
			System.out.printf("%-15s %s%n", "listener >>", "database full path: " +  dbPath + dbName );		// TODO: erase after debug
			this.db = new DB(driverURL, dbPath + dbName);
			System.out.printf("%-15s %s%n", "listener >>", "data base created: " + dbName);					// TODO: erase after debug
			
		} 
        catch (Exception e) 
        {
			e.printStackTrace();
			System.exit(1);
		}
        finally
        {
        /*
        	try 
        	{
				this.conn.close();
			} 
        	catch (SQLException e) 
        	{
				e.printStackTrace();
			}
		*/
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
         db.shutDown();
    }
	
}

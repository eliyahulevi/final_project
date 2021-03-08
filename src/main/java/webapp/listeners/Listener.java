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
	String dbName = "ClientsDB";
	String dbPath = "C:\\databases\\";
	String driverURL = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbURL = "";
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
	        //ServletContext cntx = sce.getServletContext();
			Context context = new InitialContext();
			Context env = (Context) context.lookup("java:comp/env");
			String dbPath = (String)env.lookup("DB-NAME");
			//BasicDataSource ds = (BasicDataSource)context.lookup(
			//		cntx.getInitParameter("DB_DATASOURCE") /*+ AppConstants.OPEN*/);

			System.out.println("parameter value: " + dbPath);
			Class.forName(driverURL);
			dbURL = "jdbc:derby:" + dbPath + ";create=true";
			conn = DriverManager.getConnection(dbURL);		
			if (!conn.isClosed())
			{
				this.db = new DB(conn, dbPath);
				System.out.println("data base created: " + dbName);	
			}
			
		} 
        catch (Exception e) 
        {
			e.printStackTrace();
			System.exit(1);
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

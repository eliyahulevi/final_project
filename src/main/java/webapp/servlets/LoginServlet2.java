/*
 *  https://www.codota.com/code/java/classes/javax.servlet.http.HttpServletResponse *
 */

package webapp.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import database.DB;
import org.json.simple.JSONValue;

/**
 * Servlet implementation class LoginServlet2
 */
@WebServlet("/LoginServlet2")
public class LoginServlet2 extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet2() 
    {
        super();
        db = new DB();
        
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request, response);
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		 StringBuffer jb = new StringBuffer();
		 String line = null;
		 String[] values = null;
		 Map<String,String> map = new HashMap<String,String>();
		 
		 try 
		 {
			 BufferedReader reader = request.getReader();
			 while ((line = reader.readLine()) != null)
			 {
				 values  = getValues(line, 2);
			 }
			 
			boolean bool = false;
			String name = values[0];
			String password = values[1];
		
			System.out.println("in servlet: name " + name + " password " + password);
			String user = db.findUser1(name, password); 
			response.getWriter().write(user);			
		 } 
		 
		 catch (Exception e) 
		 { 
			 e.printStackTrace(); 
		 }
		 finally 
		 {
			 // return to main page
			 //this.getServletContext().getRequestDispatcher("/index.html").forward(request, response);
		 }


	}
	

	public static String[] getValues(String line, int numberOfValues)
	{
		String[] results = new String[numberOfValues];
		
		String[] pairs = line.split(",");
		for(int i = 0; i < pairs.length; i++)
		{
			results[i] = pairs[i].split("=")[1];
			System.out.println("value=" + results[i]);
		}
		
		return results;
	}

}

package webapp.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import database.DB;
import model.users.*;

/**
 * Servlet implementation class RegisterServlet
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() 
    {
        super();
        this.db = new DB();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		//response.sendRedirect("/index.html");
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		
		 String line = null;
		 String[] values = null;
		 try 
		 {
			 BufferedReader reader = request.getReader();
			 while ((line = reader.readLine()) != null)
			 {
				 values  = getValues(line, 5);
			 }
			 
			boolean bool = false;
			String name = values[0];
			String password = values[1];
			String nickName = values[2];
			String email = values[3];
			String address = values[4];
		
			User user = new User(name, password, nickName, email, address);
			db.insertUser(user);
			if (bool)
				response.getWriter().write("1");
			else
				response.getWriter().write("0");
		 } 
		 
		 catch (Exception e) 
		 { 
			 e.printStackTrace(); 
		 }
		
	 	finally
	 	{
	 		this.getServletContext().getRequestDispatcher("/index.html").forward(request, response);	
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

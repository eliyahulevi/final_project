package webapp.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import database.DB;
import com.google.gson.Gson;
import com.google.gson.JsonElement; 

/**
 * Servlet implementation class UserServlet
 */
@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	DB db;
	
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserServlet() 
    {
        super();
        db = new DB();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		 StringBuffer jb = new StringBuffer();
		 String line = null;
		 
		 try 
		 {
			 BufferedReader reader = request.getReader();
			 if ((line = reader.readLine()) != null)
			 {
				 System.out.println(line);
				 if (line.startsWith ("1"))
				 {
					 System.out.println("got the msg " + line);
				 }
				 else
					 System.out.println("no request");
			 }
			 			
		 }
		 catch(Exception e)
		 {
			 e.printStackTrace();
		 }
		 /*
		List<String> list = db.getUsersNames();
		try
		{
			String json = "";
			if( list.size() > 0)
			{
				json = new Gson().toJson(list);
				System.out.println(list);
			}
			
			response.getWriter().write(json);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			
		}
		*/
	}

}

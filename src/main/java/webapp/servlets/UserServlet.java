package webapp.servlets;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader; 

import database.DB;
import model.message.*;

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
		JsonReader jreader;
		BufferedReader reader = request.getReader();
		Gson gson = new Gson();
		String line = null;
		int code;
		 
		 /* we read the message from the request, and the code that the message
		  * starts with, and return the appropriate response.  
		  */
		 try 
		 {
			 if ((line = reader.readLine()) != null)
			 {
				 Message jobj = gson.fromJson(line, Message.class);  
				 code = jobj.getCode();
				 switch(code)
				 {
				 	case 0:
				 	{
				 		List<String> list = db.getUsersNames();
						 String json = "";
						 if( list.size() > 0)
						 {
							 json = new Gson().toJson(list);
							 System.out.println(list);
						 } 
						
						 response.getWriter().write(json);
						 break;
				 	}
					
						 
					 case 1:
					 {
						 System.out.println("message: " + jobj.getMessage());
						 break;
					 }
						
					 case 2:
					 {
						 System.out.println("message: " + jobj.getCode());
						 System.out.println("user: " + jobj.getUser());
						 System.out.println("message: " + jobj.getMessage());
						 System.out.println("image: " + jobj.getImage());
						 break;
					 }
					 
					 default:
						break;
				 }
				 
				 /* return all users
				 if (line.startsWith ("0"))
				 {
					 List<String> list = db.getUsersNames();
					 String json = "";
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 }
					
					 response.getWriter().write(json);
				 }
				 // send message to *specific* user
				 else if(line.startsWith ("1"))
				 {
					 JsonParser parser = new JsonParser();
					 JsonElement element = parser.parse(line); 
					 JsonObject jsonObject = element.getAsJsonObject();
					 System.out.println(jsonObject);
					 
				 }
				 else
					 System.out.println("no request");
					 */
					 
			 }
			 			
		 }
		 catch(Exception e)
		 {
			 e.printStackTrace();
		 }
		 /*
		
		try
		{

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

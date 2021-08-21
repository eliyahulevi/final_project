package webapp.servlets;


import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.sql.rowset.serial.SerialBlob;
import database.DB;
import model.users.*;

/**
 * Servlet implementation class RegisterServlet
 */
@WebServlet("/RegisterServlet")
@MultipartConfig
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

		
		String code 			= request.getParameter("code");
		String userName 		= request.getParameter("user");
		String nickname 		= request.getParameter("nickname");
		String password 		= request.getParameter("password");
		String email 			= request.getParameter("nickname");
		String address	 		= request.getParameter("address");
		String image	 		= request.getParameter("image");
		String description	 	= request.getParameter("description");
		String phone	 		= request.getParameter("phone");

		try 
		{
			
			System.out.printf("%-15s %s%n", "register servlet >> " ,"incomming user:");
			System.out.printf("%-15s %s%n", "name " 	,userName);
			System.out.printf("%-15s %s%n", "nickname " ,nickname);
			System.out.printf("%-15s %s%n", "password " ,password);
			System.out.printf("%-15s %s%n", "email " 	,email);
			System.out.printf("%-15s %s%n", "address " 	,address);
			System.out.printf("%-15s %s%n", "image " 	,image);
			System.out.printf("%-15s %s%n", "description " 	,description);
			System.out.printf("%-15s %s%n", "phone " 	,phone);

			
			switch(code)
			{
				case "0":		// get all users
			 	{
					Part img 				= request.getPart("image");
					InputStream fileContent = img.getInputStream();
					byte[] data 			= fileContent.readAllBytes();
					Blob blob 				= new SerialBlob(data);
					
			 		User user = new User(userName, password, nickname, address, blob, email, description);
			 		db.insertUser(user, false);
					break;
			 	}
				case "1":		// edit user details
			 	{
			 		int result;
			 		User user = new User(userName, password, nickname, address, image, email, description, phone);
			 		result = db.updateUser(user);
			 		response.getWriter().write(result);
					break;
			 	}
			}
			
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

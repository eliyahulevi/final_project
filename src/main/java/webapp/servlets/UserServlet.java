package webapp.servlets;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;


import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
//import javax.swing.JOptionPane;

import com.google.gson.Gson;
/*import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader; 
*/

import database.DB;
import model.message.*;
import model.order.Order;

/**
 * Servlet implementation class UserServlet
 */
@WebServlet("/UserServlet")
@MultipartConfig
public class UserServlet extends HttpServlet 
{
	static final long serialVersionUID = 1L;
	Set<HttpSession> sessions = new LinkedHashSet<HttpSession>();
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
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		InputStream fileContent = null;
		Blob blob 				= null;
		byte[] data 			= null;
		
		
		String code 			= request.getParameter("code");
		String user 			= request.getParameter("user");
		String sender 			= request.getParameter("sender");
		String msg 				= request.getParameter("message");
		String dateString 		= request.getParameter("date"); 
		String offset 			= request.getParameter("offset");
		String repliedTo		= request.getParameter("repliedTo");
		
		try 
		{
			
			System.out.printf("%-15s %s%n", "user servlet >> ", "imcoming message:");
			System.out.printf("%-15s %s%n", "\ncode: ", code); 
			System.out.printf("%-15s %s%n", "\nuser: ", user); 
			System.out.printf("%-15s %s%n", "\nsender: ", sender); 
			System.out.printf("%-15s %s%n", "\nmessage: ", msg); 
			System.out.printf("%-15s %s%n", "\ndate: ", dateString); 
			System.out.printf("%-15s %s%n", "\noffset: ", offset); 
			System.out.printf("%-15s %s%n", "\nreplied to: ", repliedTo);
			switch(code)
			 {
			 	case "0":		// get all users
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
				
					 
				 case "1":		// insert image
				 {
					Part image 	= request.getPart("image");
					int off	 	= Integer.parseInt(offset);
					long date 	= Long.parseLong(dateString);
					
					if(image == null)
						db.insertMessage(new Message(sender, user, msg, date, blob, off, repliedTo)); 
					
					else if(!image.equals(""))
					{
						fileContent = image.getInputStream();
						if(fileContent.read() < 0)
							System.out.printf("%-15s %s%n", "User servlet>> " ,"unable to read image");
						else
						{
							System.out.printf("%-15s %s%n", "user servlet>> ", "image source " + fileContent);		// TODO: erase if works
							data = fileContent.readAllBytes();
							blob = new SerialBlob(data);
							db.insertMessage(new Message(sender, user, msg, date, blob,  off, repliedTo));
						}
					}
					else
						System.out.printf("%-15s %s%n", "image servlet>> ", "no image file");
					break;
				 }
				 
				 case "2":		// get user messages
				 {
					 String json = "";
					 System.out.printf("%-15s %s%n", "user servlet>> ", "code:" + code + " message: " + msg);
					 List<String> list = db.getUserMessages(user);
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
					 }
					 response.getWriter().write(json);
					 break;
				 }
				 
				 case "3":		// message clicked
				 {
					 long date = Long.parseLong(dateString);
					 db.messageClicked(user, date);
					 break;
				 }
				 
				 case "4":		// user past orders
				 {
					 String json = "";
					 System.out.printf("%-15s %s%n", "user servlet >> ", "code:" + code);
					 List<Order> list = db.getOrders(user);
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 }
					 response.getWriter().write(json);
					 break;
				 }
				 /*
				 case "5":		// insert new message
				 {
					 System.out.println("user servlet >> code:" + code);
					 db.insertMessage(message); 
					 break;
				 }
				 */
				 default:
					 break;
			}

		}
		// no image was supplied to message
		catch(IllegalStateException e) 
		{
			try 
			{
				long date = Long.parseLong(dateString);
				int off = Integer.parseInt(offset);
				
				db.insertMessage(new Message(sender, user, msg, date, blob, off, repliedTo)); 
			} 
			catch (Exception e1) 
			{
				e1.printStackTrace();
			}
			
		}
		catch (IOException e) 
		{
			e.printStackTrace();
		} 
		catch (ServletException e) 
		{
			e.printStackTrace();
		} 
		catch (SerialException e) 
		{
			e.printStackTrace();
		} 
		 catch (SQLException e) 
		{
			e.printStackTrace();
		}
		
	
	}		

}

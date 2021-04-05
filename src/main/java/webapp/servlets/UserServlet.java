package webapp.servlets;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
import javax.swing.JOptionPane;

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
@MultipartConfig
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
		/*JsonReader jreader;
		BufferedReader reader = request.getReader();
		Gson gson = new Gson();
		String line = null;
		String user;
		int code;*/
		 
		 /* we read the message from the request, and the code that the message
		  * starts with, and return the appropriate response.  
		 */
		
		doPost2(request, response);
		/*
		 try 
		 {
			 
			 if (( line = reader.readLine()) != null)
			 {
				 Message jobj = gson.fromJson(line, Message.class);  
				 code = jobj.getCode();
				 user = jobj.getUser();
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
						 JsonArray jsonArray = new JsonArray();
						 List<Message> msgs = db.getUserMessages(user);
						 for( int i = 0; i < msgs.size(); i++)
						 {
							 String msgJson = gson.toJson(msgs.get(i));
							 jsonArray.add(msgJson);
						 }
						 response.getWriter().write(jsonArray.toString());
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

	private void doPost2(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException 
	{
		
		InputStream fileContent = null;
		Blob blob = null;
		//Part code = request.getPart("code");
		String code = request.getParameter("code");
		String user = request.getParameter("user");
		String sender = request.getParameter("sender");
		String msg = request.getParameter("message");
		String date = request.getParameter("date");
		byte[] data = null;
		try 
		{
			System.out.println("code:" + code + " user:" + user + " sender: " + sender + " message: " + msg);
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
					Part image = request.getPart("image");
					
					if(image == null)
						db.insertMessage(new Message(sender, user, msg, date, blob)); 
					
					else if(!image.equals(""))
					{
						fileContent = image.getInputStream();
						if(fileContent.read() < 0)
							System.out.println(">> image servlet: no data to read");
						else
						{
							//System.out.println("image servlet >> user name " + name + " image name: " + imgName);		// TODO: erase if works
							data = fileContent.readAllBytes();
							blob = new SerialBlob(data);
							db.insertMessage(new Message(sender, user, msg, date, blob));
						}
					}
					else
						System.out.println("image servlet >>" + "no image file");
					 break;
				 }
				 
				 case "2":		// get user messages
				 {
					 String json = "";
					 System.out.println("image servlet >> code:" + code + " message: " + msg);
					 List<String> list = db.getUserMessages(user);
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 }
					 response.getWriter().write(json);
					 break;
				 }
				 
				 case "3":		// message clicked
				 {
					 db.messageClicked(user, date);
					 break;
				 }
				 
				 default:
					 break;
			}

		}
		// no image was supplied to message
		catch(IllegalStateException e) 
		{
			try 
			{
				db.insertMessage(new Message(sender, user, msg, date, blob)); 
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

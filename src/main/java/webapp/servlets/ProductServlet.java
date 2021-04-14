package webapp.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import com.google.gson.Gson;

import database.DB;
import model.message.Message;
import model.order.Order;
import model.product.Product;

/**
 * Servlet implementation class ProductServlet
 */
@WebServlet("/ProductServlet")
@MultipartConfig
public class ProductServlet extends HttpServlet {
	
	DB db;
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProductServlet() {
        super();
        db = new DB();
    }


	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		InputStream fileContent = null;
		Blob blob 				= null;
		byte[] data 			= null;
		
		String code 			= request.getParameter("code");
		String user 			= request.getParameter("user");
		String sender 			= request.getParameter("sender");
		String msg 				= request.getParameter("message");
		//long date 				= Long.parseLong(request.getParameter("date")); 
		String date 			= request.getParameter("date");
		System.out.println("code:" + code + " user:" + user + " sender: " + sender + " message: " + msg);
		
		try 
		{
			
			switch(code)
			 {
			 	case "0":		// get all products
			 	{
			 		List<Product> list = db.getProducts();
					 String json = "";
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 } 
					
					 response.getWriter().write(json);
					 break;
			 	}
				
					 
				 case "1":		// TBD
				 {
					
					 break;
				 }
				 
				 case "2":		// TBD
				 {
					 
					 break;
				 }
				 
				 case "3":		// TBD
				 {
					
					 break;
				 }
				 
				 case "4":
				 {
					 String json = "";
					 System.out.println("user servlet >> code:" + code);
					 List<Order> list = db.getOrders(user);
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 }
					 response.getWriter().write(json);
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
				//db.insertMessage(new Message(sender, user, msg, date, blob)); 
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
	}
	

}

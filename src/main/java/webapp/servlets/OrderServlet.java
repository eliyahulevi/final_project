package webapp.servlets;

import java.io.IOException;
import java.io.PrintWriter;
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
import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import com.google.gson.Gson;

import database.DB;
import model.product.Product;


/**
 * Servlet implementation class OrderServlet
 */
@WebServlet("/OrderServlet")
@MultipartConfig
public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OrderServlet() 
    {
        super();
        this.db = new DB();
    }

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException 
	{
		
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		
		String code 			= request.getParameter("code");
		String catalog 			= request.getParameter("index");
		String type 			= request.getParameter("date");
		String priceString 		= request.getParameter("customer");
		String lengthString 	= request.getParameter("shipAddress"); 
		String color 			= request.getParameter("supplied");
		String image			= request.getParameter("Comment");
		String products			= request.getParameter("products");
		
		try 
		{
			
			switch(code)
			{
				case "0":		// get all orders
				{
					List<String> list = db.getProducts1();
					String json = "";
					if( list.size() > 0)
					{
						json = new Gson().toJson(list);
						System.out.printf("%n%-15s %s","product servlet >> ", "");
					}
				 
					System.out.printf("%n%-15s %s", "product servlet >>", "product: ");
					response.getWriter().write(json);
					break;
				}
				
					 
				case "1":		// add new order
				{
					Blob img 		= new SerialBlob(image.getBytes());
					int cat			= Integer.valueOf(catalog);
					float price 	= Float.valueOf(priceString);
					float length 	= Float.valueOf(lengthString);
					Product product = new Product(cat, type, price, length, color, img);
					db.insertProduct(product);
					System.out.println("product servlet >> add product");
					product.print();
					break;
				}
				 
				case "2":		// remove an order
				{
					System.out.printf("%n%-15s %s", "product servlet >>", "delete product: " + catalog); 
					PrintWriter writer = response.getWriter();
					int result = db.deleteProduct(Integer.valueOf(catalog));
					writer.println(result);
					break;
				}
				 
				case "3":		// TBD
				{
					
					break;
				}
				 
				case "4":		// get all user orders
				{
					//String json = "";
					System.out.println("user servlet >> code:" + code);
					 /*
					 List<Order> list = db.getOrders(user);
					 if( list.size() > 0)
					 {
						 json = new Gson().toJson(list);
						 System.out.println(list);
					 }
					 response.getWriter().write(json);
					 */
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

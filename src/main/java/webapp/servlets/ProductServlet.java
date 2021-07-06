package webapp.servlets;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
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
import model.message.Message;
import model.order.Order;
import model.product.Product;

import utilities.Utils;

/**
 * Servlet implementation class ProductServlet
 */
@WebServlet("/ProductServlet")
@MultipartConfig
public class ProductServlet extends HttpServlet 
{
	
	DB db;
	File noDataFile;
	Context context;
	Context env;
	String productsPath;
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProductServlet() 
    {
        super();        

		try 
		{
			db 					= new DB();
			context 			= new InitialContext();
			env					= (Context) context.lookup("java:comp/env");
			productsPath		= (String)env.lookup("PRODUCTS-PATH");
			noDataFile			= new File(productsPath + "/no_data.png");
			Optional<String> ext= Utils.getExtensionByStringHandling(productsPath);
			
			System.out.printf("%n%-15s %s","product servlet >> ", "no data" + noDataFile);
		} 
		catch (NamingException e) 
		{
			e.printStackTrace();
		}

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
		
		String code 			= request.getParameter("code");
		String catalog 			= request.getParameter("catalog");
		String type 			= request.getParameter("type");
		String priceString 		= request.getParameter("price");
		String lengthString 	= request.getParameter("length"); 
		String color 			= request.getParameter("color");
		String image			= request.getParameter("image");
		
		
		if(image == "" || image == null)
		{
			image = noDataFile.toString();
		}

		try 
		{
			
			switch(code)
			{
				case "0":		// get all products
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
				
					 
				case "1":		// add new product
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
				 
				case "2":		// remove a product
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
				 
				case "4":		// get all user products
				{
					String json = "";
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

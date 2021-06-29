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
public class ProductServlet extends HttpServlet 
{
	
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
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		System.out.println("trying to get product from products servlet");
		InputStream fileContent = null;
		Blob blob 				= null;
		byte[] data 			= null;
		
		
		String code 			= request.getParameter("code");
		String catalog 			= request.getParameter("catalog");
		String type 			= request.getParameter("type");
		String priceString 		= request.getParameter("price");
		String length 			= request.getParameter("length"); 
		String color 			= request.getParameter("color");
		String image			= request.getParameter("image");
		
		/*
		String code 			= request.getParameter("code");
//		int id = 0;
		String type = "";
		float price = 0;
//		float length = 0;
//		String color = null;
//		InputStream image = null;
		byte[] image = null;
		
		if (code=="1") {
			System.out.println("this is code string: " + code);
//			id	 				= Integer.parseInt(request.getParameter("catalog"));
//			System.out.println("this is id int: " + id);
			type 				= request.getParameter("type");
			price 			= Float.parseFloat(request.getParameter("price"));
//			length 			= Float.parseFloat(request.getParameter("length"));
//			color 			= request.getParameter("color");
//			image 			= request.getInputStream();
			System.out.println("what!???");
			System.out.println("product servlet >> "
								+ " type:" + type 
								+ " price: " + price );
		}
		*/
		try 
		{
			
			switch(code)
			{
				case "0":		// get all products
				{
					//List<Product> list = db.getProducts();
					List<String> list = db.getProducts1();
					String json = "";
					if( list.size() > 0)
					{
						/*
						for (int i = 0; i < list.size(); i++ )  
							System.out.println("well well well... if it ain't the invisible cunt." + list.get(i).getImage());
						*/
						json = new Gson().toJson(list);
						System.out.println("product servlet >> " + list);
					} 
				
				 
				 	System.out.println("heresssss json!!: " + json);
					response.getWriter().write(json);
					break;
				}
				
					 
				case "1":		// add new product
				{
					Blob img = new SerialBlob(image.getBytes());
					float price = Float.valueOf(priceString);
					Product product = new Product(type, price, img);
					db.insertProduct(product);
					System.out.println("product servlet >> add product");
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
		} catch (SerialException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}
	

}

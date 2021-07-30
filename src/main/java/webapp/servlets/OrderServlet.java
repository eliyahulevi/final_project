package webapp.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import database.DB;
import model.order.Order;



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
		String index			= request.getParameter("index");
		String dateStr	 		= request.getParameter("date");
		String customer 		= request.getParameter("customer");
		String address 			= request.getParameter("address");
		String supplyStr	 	= request.getParameter("supplied"); 
		String totalStr 		= request.getParameter("total");
		String comment			= request.getParameter("comment");
		String productsStr		= request.getParameter("products");
		
		System.out.printf("%n%-15s %s%n","order servlet >> ", "total: " + totalStr);
		
		try 
		{
			PrintWriter writer = response.getWriter();
			switch(code)
			{
				case "0":		// get all orders
				{
					List<String> list = db.getProducts1();
					String json = "";
					if( list.size() > 0)
					{
						json = new Gson().toJson(list);
						System.out.printf("%n%-15s %s%n","order servlet >> ", "");
					}
				 
					System.out.printf("%n%-15s %s%n", "order servlet >>", "product: ");
					response.getWriter().write(json);
					break;
				}
				
					 
				case "1":		// insert new order
				{
					long date			= Long.valueOf(dateStr);
					boolean supplied 	= Boolean.valueOf(supplyStr);
					float total 		= Float.valueOf(totalStr);
					//String[] products	= productsStr.split(";", 0); 
					//List<String> prods	= Arrays.asList(products);
					System.out.printf("%n%-15s %s%n","order servlet >> ", "order total: " + total);
					Order order 	= new Order(customer, date, address, supplied, total, comment, productsStr);
					db.insertOrder(order);
					System.out.println("order servlet >> add order ");
					order.print();
					writer.println(1);
					break;
				}
				 
				case "2":		// remove an order
				{
					int idx = 0;
					System.out.printf("%n%-15s %s%n", "order servlet >>", "delete order: " + idx); 
					
					//int result = db.deleteOrder(index);
					writer.println(-1);
					break;
				}
				 
				case "3":		// get order by id
				{
					String json = "";
					String order = "";
					
					 
					order 		= db.getOrder1(Integer.valueOf(index));
					json 		= new Gson().toJson(order);
					response.getWriter().write(json);
					
					System.out.printf("%n%-15s %s%n", "order servlet >>", "get order with id: " + index);
					break;
				}
				 
				case "4":		// get (all) of user orders
				{
					String json = "";
					System.out.printf("%n%-15s %s%n", "order servlet >>", "get order for: " + customer);
					 
					//List<Order> list = db.getOrders(customer);
					List<String> list = db.getOrders1(customer);
					if( list.size() > 0)
					{
						json = new Gson().toJson(list);
						System.out.println(list );
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

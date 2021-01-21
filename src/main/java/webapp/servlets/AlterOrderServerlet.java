package webapp.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import database.DB;
import model.product.AlternativeProduct;


/**
 * Fulfills request of listing the users
 */
@WebServlet(
        name = "AlterOrderServerlet",
        urlPatterns = {
                "/order",
        })


public class AlterOrderServerlet extends HttpServlet {
    /**
     * Fulfills HTTP request to display order and how to cut it
     * @param request The HTTP request
     * @param response The HTTP response
     * @throws ServletException a ServletException
     * @throws IOException An IO exception
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AlterOrderServerlet() 
    {
        super();
        db = new DB();
    }

	
	 protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
	        OrderList(request,response);
	    }
	 
	 	/**
	     * Processes the HTTP request and lists all users
	     * @param request The HTTP Request
	     * @param response The HTTP response
	     * @throws IOException an IO Exception
	 	 * @throws ServletException 
	     */
	 protected void OrderList(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		 AlternativeProduct order = db.getOrder(0);
		 
		 try 
		 {
			 List<ArrayList<Integer>> listOfLists = order.getList_of_order();
			 listOfLists.forEach((list)  -> 
		        {
		            list.forEach((item)->System.out.println(item));
		        }
		                );
			
			
		 } 
		 
		 catch (Exception e) 
		 { 
			 e.printStackTrace(); 
		 }
		 finally 
		 {
			 // return to main page
			 this.getServletContext().getRequestDispatcher("/index.html").forward(request, response);
		 }


	}
	
}
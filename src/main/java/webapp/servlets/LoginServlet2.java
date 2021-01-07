/*
 *  https://www.codota.com/code/java/classes/javax.servlet.http.HttpServletResponse *
 */

package webapp.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import database.DB;
import model.users.*;

/**
 * Servlet implementation class LoginServlet2
 */
@WebServlet("/LoginServlet2")
public class LoginServlet2 extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet2() 
    {
        super();
        db = new DB();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request, response);
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		int res = 0;
		boolean bool = false;
		String name = request.getParameter("name");
		String password = request.getParameter("password");
		bool = db.userExist(name, password); 
		res = (bool == true) ? 1 : 0;
		System.out.println("user found in servlet:" + res);		
		response.getWriter().write(res);
	}

}

package webapp.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.sql.Blob;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.springframework.http.codec.multipart.FilePart;
import database.DB;


/**
 * Servlet implementation class ImageServlet
 */
@WebServlet("/ImageServlet")
@MultipartConfig
public class ImageServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	DB db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ImageServlet() 
    {
        super();
        db = new DB();
    }

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
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
		try
		{
			InputStream fileContent = null;
			Blob blob = null;
			Part filePart = request.getPart("image");
			//String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
			if(!filePart.equals(""))
			{
				fileContent = filePart.getInputStream();
				//Blob _blob = new Blob();
				//loadDataFromInputStream(fileContent, blob);
			}
			else
				System.out.println(">> image servlet:" + "no file image");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.out.println(">> image servlet:" + e.getMessage());
		}
	}

}

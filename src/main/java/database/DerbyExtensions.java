package database;

import java.sql.ResultSet;
import java.sql.SQLException;

public final class DerbyExtensions 
{
	public static String replace(String src, String searchString, String replaceString)
	{
		String result = "";
		
		try 
		{
			/*
			while(rs.next())
			{
				rs.getString(1).replace(searchString, replaceString);
			}
			*/
			result = src.replace(searchString, replaceString);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		
		return result;
	}
}

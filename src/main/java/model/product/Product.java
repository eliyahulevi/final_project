/**
 * 
 */
package model.product;

import java.io.InputStream;
import java.sql.Blob;

// types of lumber cross sections
enum types { t_2x4, t_2x6, t_2x8,
			 t_4x6, t4x8, t4x10,
			 t_6x8, t_6x10, t_6x12 };

/**
 * @author shahar
 *
 */
public class Product 
{
	int 	catalog;
	int 	type;
	float 	price;
	float 	length;
	String 	color;
//	InputStream    image;
	byte[] image;
	
	/**
	 * constructor *
	 */
	public Product() 
	{
		
	}

	public Product(int id, int type, float price, float length, String color,byte[] image)// InputStream image) 
	{
		this.catalog = id;
		this.type = type;
		this.price = price;
		this.length = length;
		this.color = color;
		this.image = image;
	}

	public void setCatalog(int c) 	{ this.catalog = c; }
 	public void setType(int t) 		{ this.type = t; }
	public void setPrice(float p) 	{ this.price = p; }
	public void setLength(float l) 	{ this.length = l; }
	public void setColor(String c) 	{ this.color = c; }
//	public void setImage(InputStream image) { this.image = image;}
	public void setImage(byte[] image) { this.image = image;}

	public int getCatalog() 		{ return this.catalog; }
	public int getType() 			{ return this.type; }
	public float getPrice() 		{ return this.price; }
	public float getLength()		{ return this.length; }
	public String getColor()		{ return this.color; }
//	public InputStream getImage()          { return this.image;}
	public byte[] getImage()          { return this.image;}
}

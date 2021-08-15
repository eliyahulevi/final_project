/**
 * 
 */
package model.product;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Blob;
import java.util.Base64;

// types of lumber cross sections
//enum types { t_2x4, t_2x6, t_2x8,
//			 t_4x6, t4x8, t4x10,
//			 t_6x8, t_6x10, t_6x12 };

/**
 * @author shahar
 *
 */
public class Product 
{
	int 	catalog;
	String 	type;
	float 	price;
	float 	length;
	String 	color;
	String 	crossSection;
	Blob 	image;
	
	/**
	 * constructor *
	 */
	public Product() 
	{
		
	}
	public Product(String type, float price, byte[] image)// InputStream image) 
	{
		this.catalog 		= 0;
		this.type 			= type;
		this.price 			= price;
		this.length 		= 0;
		this.color 			= "";
		
	}
	public Product(String type, float price, Blob image)// InputStream image) 
	{
		this.catalog 		= 0;
		this.type 			= type;
		this.price 			= price;
		this.length 		= 0;
		this.color 			= "";
		this.image 			= image;
	}
	public Product(int catalog, String type, float price, float length, String color, String crosssection, Blob image)// InputStream image) 
	{
		this.catalog 		= catalog;
		this.type 			= type;
		this.price 			= price;
		this.length 		= length;
		this.color 			= color;
		this.crossSection 	= crosssection;
		this.image 			= image;
	}
	
	public void print()
	{
		System.out.printf("%n%-15s %s", "product >>", "");
		System.out.printf("%n%-15s %d", "", this.catalog);		// cat number
		System.out.printf("%n%-15s %s", "", this.type);			// type
		System.out.printf("%n%-15s %f", "", this.price);		// price
		System.out.printf("%n%-15s %f", "", this.length);		// length
		System.out.printf("%n%-15s %s", "", this.color);		// color
		System.out.printf("%n%-15s %s", "", this.crossSection);	// color
		System.out.printf("%n%-15s %s", "", this.image);		// image
	}
	
	public void setCatalog(int c) 		{ this.catalog = c; }
 	public void setType(String t) 		{ this.type = t; }
	public void setPrice(float p) 		{ this.price = p; }
	public void setLength(float l) 		{ this.length = l; }
	public void setColor(String c) 		{ this.color = c; }
	public void setCS(String c) 		{ this.crossSection = c; }
	public void setImage(Blob image) 	{ this.image = image;}

	public int getCatalog() 			{ return this.catalog; }
	public String getType() 			{ return this.type; }
	public float getPrice() 			{ return this.price; }
	public float getLength()			{ return this.length; }
	public String getColor()			{ return this.color; }
	public String getCS()				{ return this.crossSection; }
	public Blob getImage()         		{ return this.image;}
}

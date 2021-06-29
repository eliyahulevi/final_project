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
//	InputStream    image;
	byte[] 	image;
	Blob img;
	
	/**
	 * constructor *
	 */
	public Product() 
	{
		
	}

	public Product(String type, float price, byte[] image)// InputStream image) 
	{
		this.catalog = 0;
		this.type = type;
		this.price = price;
		this.length = 0;
		this.color = "";
		this.image = image;
	}
	public Product(String type, float price, Blob image)// InputStream image) 
	{
		this.catalog = 0;
		this.type = type;
		this.price = price;
		this.length = 0;
		this.color = "";
		this.img = image;
	}
	
	public void setCatalog(int c) 		{ this.catalog = c; }
 	public void setType(String t) 		{ this.type = t; }
	public void setPrice(float p) 		{ this.price = p; }
	public void setLength(float l) 		{ this.length = l; }
	public void setColor(String c) 		{ this.color = c; }
	public void setImage(Blob image) 	{ this.img = image;}
	public void setImage(byte[] image) throws IOException {
		this.image = image;

		/*
		Base64.Encoder encoder = Base64.getEncoder();
		byte[] arrEncode = encoder.encode(image);
		System.out.println("Encoded image byte array: "+arrEncode);
		this.image = image;
		FileOutputStream fos = new FileOutputStream("try.jpg");
		try {
		fos.write(this.image);
		System.out.println(arrEncode);
		}
		finally {
			fos.close();	
		}
		*/
	}

	public int getCatalog() 		{ return this.catalog; }
	public String getType() 		{ return this.type; }
	public float getPrice() 		{ return this.price; }
	public float getLength()		{ return this.length; }
	public String getColor()		{ return this.color; }
//	public InputStream getImage()   { return this.image;}
	public byte[] getImage()        { return this.image;}
	public Blob getImg()         	{ return this.img;}
}

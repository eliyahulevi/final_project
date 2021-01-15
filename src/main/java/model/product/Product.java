/**
 * 
 */
package model.product;

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
	int catalog;
	int type;
	float price;
	float length;
	String color;
	
	/**
	 * constructor *
	 */
	public Product() 
	{
		
	}

	public void setCatalog(int c)
	{
		this.catalog = c;
	}
 	public void setType(int t)
	{
		this.type = t;
	}
	public void setPrice(float p)
	{
		this.price = p;
	}
	public void setLength(float l)
	{
		this.length = l;
	}
	public void setColor(String c)
	{
		this.color = c;
	}

	
}

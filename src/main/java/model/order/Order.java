package model.order;


import java.util.List;
import model.product.*;

public class Order 
{	
	int 			index;
	long 			date;
	String 			customer;
	String 			shipAddress;
	boolean 		supplied;
	float			total;
	String 			Comment;
	List<Product>	products;
	
	/*
	 *  constructors *
	 */
	public Order()
	{
		
	}
	public Order(int index, String user, long date, String shipAddress, boolean supplied, List<Product> products)
	{
		this.index = index;
		this.customer = user;
		this.date = date;
		this.shipAddress = shipAddress;
		this.supplied = supplied;
		this.products = products;
	}

	/*
	 * 	setters
	 */
	public void setIndex(int n)				{ this.index = n; }
	public void setDate(long d) 			{ this.date = d; }
	public void setCustomer(String c)		{ this.customer = c; }
	public void setAddress(String a)		{ this.shipAddress = a; }
	public void setIsSupplied(boolean b)	{ this.supplied = b;	}
	public void setTotal(float f)			{ this.total = f;	}
	public void addProduct(Product p) 		{ this.products.add(p); }
	public void setComment(String s) 		{ this.Comment = s; }
	public void setProducts(List<Product> p) { this.products = p; }
	
	public int 				getIndex() { return this.index; }
	public long 			getDate() { return this.date; }
	public String 			getCustomerName() { return this.customer; }
	public String 			getShipAddess() { return this.shipAddress; }
	public float 			getTotal()	{ return this.total; }	
	public boolean 			getIsSupplied() { return this.supplied; }
	public String 			getComment() { return this.Comment; }
	public List<Product> 	 getProducts() { return this.products; }
}

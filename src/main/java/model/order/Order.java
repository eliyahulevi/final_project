package model.order;

import model.users.*;

import java.util.List;

import model.product.*;

public class Order 
{
	int number;
	String date;
	String shipAddress;
	boolean supplied;
	User customer;
	List<Product> products;
	
	/*
	 *  constructor *
	 */
	public Order()
	{
		
	}
	
	public void setNumber(int n)
	{
		this.number = n;
	}
	public void setDate(String d)
	{
		this.date = d;
	}
	public void setAddress(String a)
	{
		this.shipAddress = a;
	}
	public void setIsSupplied(boolean b)
	{
		this.supplied = b;
	}
	public void setCustomer(User c)
	{
		this.customer = c;
	}
	public void addProduct(Product p)
	{
		this.products.add(p);
	}

}

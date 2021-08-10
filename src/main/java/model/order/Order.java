package model.order;


public class Order 
{	
	int 			index;
	long 			date;
	String 			customer;
	String 			shipAddress;
	boolean 		supplied;
	float			total;
	String 			comment;
	String	products;
	
	/*
	 *  constructors *
	 */
	public Order()
	{
		
	}
	public Order(String user, long date, String shipAddress, boolean supplied, float total, String comment, String products)
	{
		this.customer 		= user;
		this.date 			= date;
		this.shipAddress 	= shipAddress;
		this.supplied 		= supplied;
		this.comment 		= comment;
		this.products 		= products;
		this.total 			= total;
	}
	public Order(int index, String user, long date, String shipAddress, boolean supplied, float total, String comment, String products)
	{
		this.index			= index;
		this.customer 		= user;
		this.date 			= date;
		this.shipAddress 	= shipAddress;
		this.supplied 		= supplied;
		this.comment 		= comment;
		this.products 		= products;
		this.total 			= total;
	}
	public Order(int index, String user, long date, String shipAddress, boolean supplied, String products)
	{
		this.index = index;
		this.customer = user;
		this.date = date;
		this.shipAddress = shipAddress;
		this.supplied = supplied;
		this.products = products;
	}

	/*
	 * print order field to console
	 */
	public void print()
	{
		System.out.printf("%n%-15s %s", "order >>", "print order: ");
		System.out.printf("%n%-15s %s", "index: ", this.index);
		System.out.printf("%n%-15s %s", "date: ", this.date);
		System.out.printf("%n%-15s %s", "customer: ", this.customer);
		System.out.printf("%n%-15s %s", "ship address: ", this.shipAddress);
		System.out.printf("%n%-15s %s", "supplied: ", this.supplied);
		System.out.printf("%n%-15s %s", "total: ", this.total);
		System.out.printf("%n%-15s %s", "comment: ", this.comment);
		System.out.printf("%n%-15s %s", "products: ", this.products);
	}
	
	/*
	 * 	setters
	 */
	public void 	setIndex(int n)			{ this.index = n; }
	public void 	setDate(long d) 		{ this.date = d; }
	public void 	setCustomer(String c)	{ this.customer = c; }
	public void 	setAddress(String a)	{ this.shipAddress = a; }
	public void 	setIsSupplied(boolean b){ this.supplied = b;	}
	public void 	setTotal(float f)		{ this.total = f;	}
	public void 	setComment(String s) 	{ this.comment = s; }
	public void 	setProducts(String p) 	{ this.products = p; }
	
	/*
	 * getters
	 */
	public int 		getIndex() 				{ return this.index; }
	public long 	getDate() 				{ return this.date; }
	public String 	getCustomerName() 		{ return this.customer; }
	public String 	getShipAddess() 		{ return this.shipAddress; }
	public float 	getTotal()				{ return this.total; }	
	public boolean 	getIsSupplied() 		{ return this.supplied; }
	public String 	getComment() 			{ return this.comment; }
	public String 	getProducts() 			{ return this.products; }
}

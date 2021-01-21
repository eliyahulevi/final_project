package model.product;

import java.util.ArrayList;
import java.util.List;

public class AlternativeProduct {
	
	// this is list of lists contains [[length of require lumber, quantity of that lumber], [], []....,[]]
	// for example i need 5 pieces of length of 75 cm and 2 pieces of length 180 going to look like [[75, 5], [180,2]]
	private List<ArrayList<Integer>> list_of_order = new ArrayList<ArrayList<Integer>>();
	
	private String type_of_lumber;
	
	private int orderID;
	private String customerName;
	
	public AlternativeProduct() {
		
	}
	
	public List<ArrayList<Integer>> getList_of_order() {
		return list_of_order;
	}

	public void setList_of_order(List<ArrayList<Integer>> list_of_order) {
		this.list_of_order = list_of_order;
	}

	public String getType_of_lumber() {
		return type_of_lumber;
	}

	public void setType_of_lumber(String type_of_lumber) {
		this.type_of_lumber = type_of_lumber;
	}

	

	public int getOrderID() {
		return orderID;
	}

	public void setOrderID(int orderID) {
		this.orderID = orderID;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	

}

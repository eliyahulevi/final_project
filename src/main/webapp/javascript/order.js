/*
*	this file handles order related functionalities 
*	order format:
*	"order_id":	int,
*	"date":		long,
*	"total":	float,
*	"supplied":	boolean,
*		
*/


/*********************************************************************************
*	this function creates new order modal
*	@param:		null
*	return:		result, div the created element
*********************************************************************************/
function createNewOrderModal(){
	var select			= document.createElement('div');
	var modalContent	= document.createElement('div');
	var button			= document.createElement('button');
	var close			= document.createElement('button');
	
	close.setAttribute('class', 'btn btn-primary mt-3');
	close.setAttribute('type', 'submit');
	select.setAttribute('id', 'new-order-modal');
	select.setAttribute('class', 'modal');
	
	modalContent.setAttribute('id', 'new-order-modal-content');
	modalContent.setAttribute('class', 'modal-content');
	
	
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-danger dropdown-toggle');
	button.setAttribute('data-toggle', 'dropdown');
	button.setAttribute('aria-haspopup', 'true');
	button.setAttribute('aria-expanded', 'false');
	
	select.appendChild(button);
	select.appendChild(close);
	return select;
}


/*********************************************************************************
*	this function creates a 'select' like element
*	@param:		null
*	return:		result, div the created element
*********************************************************************************/
function createSelect(){
	var select			= document.createElement('div');
	var button			= document.createElement('button');
	var dropDown		= document.createElement('div');
	var action			= document.createElement('a');
	var idiom			= document.createElement('i');
	var img				= document.createElement('img');
	
	
	img.src = 'resources/no_data.png';
	img.setAttribute('class', 'image');
	img.setAttribute('style', 'float:right;');
	
	idiom.setAttribute('class', 'fa fa-angle-down');
	action.setAttribute('class', 'dropdown-item');
	action.setAttribute('href', '#select-group');
	action.innerHTML = 'action';
	action.appendChild(img);
	
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-danger dropdown-toggle');
	button.setAttribute('data-toggle', 'dropdown');
	button.setAttribute('aria-haspopup', 'true');
	button.setAttribute('aria-expanded', 'false');
	button.innerHTML = 'select ';
	button.appendChild(idiom);
	
	dropDown.setAttribute('id', 'new-order-dropdown-menu');
	dropDown.setAttribute('class', 'dropdown-menu');
	dropDown.appendChild(action);
	
	select.setAttribute('id', 'select-group');
	select.setAttribute('class', 'btn-group');
	select.setAttribute('style', 'width: 80%');
	select.appendChild(button);
	select.appendChild(dropDown);
	
	return select;
}


/*********************************************************************************
*	this function handles new order creation and response
*	@param:		order, JSON format
*	return:		null
*********************************************************************************/
function insertOrder(order){
	
	console.log('new order');
	formdata.append("code", "1");
	formdata.append("catalog", catalog);
	formdata.append("type", "0"); 
	formdata.append("price", "0");
	formdata.append("length", "0");
	formdata.append("color", "");
	
	
	$.ajax({    
    url: 			'OrderServlet', 	
    dataType: 		'text',  		
    cache: 			false,
    contentType:	false,
    processData:	false,
    data: 			formdata,                         
    type: 			'post',
    async: 			true,
    success: function(response){
    		if(response > 0)
    		{
    			loadProducts(true);
    			console.log('response from server' + response);
    		}
    	}
    });
}


/*********************************************************************************
*	this function creates an order modal as HTML element and return to caller
*	@param:		null
*	return:		modal, a 'div' HTML element that holds all order fields
*********************************************************************************/
function openOrderModal(){
	var modal		= document.getElementById('new-order-Modal'); 
	var formdata 	= new FormData();
	
	formdata.append("code", 	"0");
	formdata.append("catalog", 	"0");
	formdata.append("type", 	"0"); 
	formdata.append("price", 	"0");
	formdata.append("length", 	"0");
	formdata.append("color", 	"");
	
	$.ajax({    
        url: 			'ProductServlet', 	
        dataType: 		'text',  		
        cache: 			false,
        contentType:	false,
        processData:	false,
        data: 			formdata,                         
        type: 			'post',
        async: 			false,
        success: function(response){

        			var products 		= JSON.parse(response);
					//var newOrderModal	= document.getElementById('new-order-form');
 					//var select			= createSelect();
					var dropDown		= document.getElementById('new-order-dropdown-menu');
				
					//newOrderModal.prepend(select);
        		       			
        			for(var i = 0; i < products.length; i++){
	
						var product 		= JSON.parse(products[i]);
        				var option			= document.createElement("a");
						var img				= document.createElement("img");
						
						img.setAttribute('class', 'image');
						img.setAttribute('style', 'float:right;');
						img.src				= product.image;
						
						option.setAttribute('class', 'dropdown-item');
						option.setAttribute('href', '#select-group');
						option.setAttribute('onclick', 'addProduct(' + product.catalog + ')'); 
						option.appendChild(img);
						option.innerHTML 	= 'product catalog: ' + product.catalog;
						
						dropDown.appendChild(option);
        			}
					modal.style.display = 'block';
					console.log('new order modal ' + modal);
					
    			}
     	});

}


/*********************************************************************************
*	this function add a product to an order
*	@param:		cat, a unique product identifier
*	return:		null
*********************************************************************************/
function addProduct(cat){
	console.log('add product ' + cat);
}


/*********************************************************************************
*	this function creates an order modal as HTML element and return to caller
*	@param:		null
*	return:		modal, a 'div' HTML element that holds all order fields
*********************************************************************************/
function createOrderModal(){
	
	
	var modal			= document.createElement('div');
	var modalContent	= document.createElement('div');
	var span			= document.createElement('span');
	
	span.innerHTML		= '&times ';
	span.setAttribute('class', 'close');
	span.setAttribute('onclick', "function() { 	var modal = document.getElementById('modal') \
												modal.style.display = 'none'}");
	modal.setAttribute('id', 'order-modal');
	modal.setAttribute('class', 'modal');
	modalContent.setAttribute('class', 'modal-content');
	modalContent.appendChild(span);
	modal.appendChild(modalContent);
	//modal.style.display = 'block';
	
	return modal;
}


/*********************************************************************************
*	this function closes the new order modal, through the DOM
*	@param:		null
*	return:		null
*********************************************************************************/
function closeNewOrder(){
	console.log('close order modal ');
	var	elem		= document.getElementById('new-order-Modal');
	var select		= document.getElementById('select-group');
	if( select !== null )
		select.parentNode.removeChild(select);
	elem.style.display = 'none';
}

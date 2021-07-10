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
*	this function adds a chosen product to order. according to unique identifier
*	the function locates the correct 'new-order-product' element and extract
*	product length and color. after product details are extracted the function
*	adds the product to the 'new-order-form' form for display
*	@param:		catalog, int a unique identifier for each product
*	return:		onull
*********************************************************************************/
function addProductToOrder(prodObj){
	
	
	var prodStr		= new String(prodObj).split('#')[1];
	var prod		= document.getElementById(prodStr); 
	console.log('product: ' + prod);
	var product		= document.createElement('div');
	var lengthLbl	= document.createElement('label');
	var colorLbl	= document.createElement('label');
	var imgLbl		= document.createElement('img');
	var edit		= document.createElement('a');
	var remove		= document.createElement('a');
	var space		= document.createElement('i');
	var form		= document.getElementById('new-order-form'); 
	var length		= document.getElementById('new-product-length-' + prodObj.catalog);
	var color		= document.getElementById('new-product-color-' + prodObj.catalog);
	var img			= prod.getElementsByTagName('img');
	var dropDown	= document.getElementById('new-order-dropdown-menu');
	var	items		= dropDown.getElementsByTagName('li');
	var inputs		= prod.getElementsByTagName('input');
 	
	console.log('number fo inputs: ' + inputs.length);
	
	product.setAttribute('class', 'new-order-product');
	
	lengthLbl.innerHTML = 'length: ' + inputs[0].value;
	colorLbl.innerHTML 	= 'color: ' + inputs[1].value; 
	imgLbl.setAttribute('class', 'image');
	imgLbl.src			= img[0].src;
	edit.innerHTML		= 'edit';
	remove.innerHTML	= 'remove';
	space.innerHTML		= ' / ';
	product.appendChild(lengthLbl);
	product.appendChild(colorLbl);
	product.appendChild(imgLbl);
	product.appendChild(edit);
	product.appendChild(space);
	product.appendChild(remove);
	
	form.appendChild(product);
}

/*********************************************************************************
*	this function creates new selected product option in the product selection
*	drop-down
*	@param:		product, a JSON object that holds all the products details
*	return:		option, div the created element
*********************************************************************************/
function createNewProductOption(product){	
	try
	{
		var li			= document.createElement('li');
		var option			= document.createElement('div');
		var lengthLbl		= document.createElement('label');
		var colorLbl		= document.createElement('label');
		var length			= document.createElement('input');
		var color			= document.createElement('input');
		var img				= document.createElement('img');
		var add				= document.createElement('a');
		var prodObj			= {};
		option.setAttribute('class', 'new-order-product');	
		option.setAttribute('id', 'new-order-product-' + product.catalog);	
		length.setAttribute('id', 'new-product-length-' + product.catalog);
		color.setAttribute('id', 'new-product-color-' + product.catalog);
		add.setAttribute('id', 'new-product-add-' + product.catalog);
		add.setAttribute('href', '#new-order-product-' + product.catalog);
		add.setAttribute('onclick', 'addProductToOrder(this)');
		lengthLbl.innerHTML	= 'length: ';
		colorLbl.innerHTML	= 'color: ';
		
		//add.setAttribute('onclick', 'addProductToOrder(' + product.catalog + ',' + length.innerHTML + ',' + color.innerHTML + ')');
		//add.setAttribute('onclick', 'addProductToOrder(' + product.catalog + ')');
		img.setAttribute('id', 'new-product-image-' + product.catalog);
		img.setAttribute('class', 'image');
		img.src = product.image;
		add.innerHTML = 'add product';
		
		
		prodObj.catalog		= length.catalog;
		prodObj.length		= length.innerHTML;
		prodObj.color		= color.innerHTML;
		prodObj.img			= product.image;
		
		
		console.log('image: ' + prodObj.catalog + '\nlength: ' + product.length + '\ncolor: ' + products.color );
	}
	catch(error)
	{
		console.log('error add product to selected products');
	}
	

	option.appendChild(lengthLbl);
	option.appendChild(length);
	option.appendChild(colorLbl);
	option.appendChild(color);
	option.appendChild(img);
	option.appendChild(add);
	li.appendChild(option);
	return li;
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



function createNewProductOption1(product){
	var li		= document.createElement('li');
	var a		= document.createElement('a');
	var img		= document.createElement('img');
	a.innerHTML = 'produt ' + product.catalog;
	a.setAttribute('href', 'li-' + product.catalog);
	a.setAttribute('onclick', 'li-' + product.catalog);
	img.setAttribute('class', 'image');
	img.src		= product.image;
	li.setAttribute('id', 'li-' + product.catalog);
	li.appendChild(a);
	li.appendChild(img);
	return li;
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
					var dropDown		= document.getElementById('new-order-dropdown-menu');
					var existProducts	= dropDown.getElementsByClassName('new-order-product');
        		    
					// remove all previous products
					if(existProducts.length > 0){
						for(var i = existProducts.length - 1; i >= 0 ; i--)
							existProducts[i].remove();
					} 			
					// populates with new products
        			for(var i = 0; i < products.length; i++){
						var product 		= JSON.parse(products[i]);
        				var option			= createNewProductOption(product);
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

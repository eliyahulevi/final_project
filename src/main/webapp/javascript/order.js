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
*	this function load all the users orders (past and present) from the server DB
*	@param:		sync, boolean whether the action should be synchronous or not.
*	return:		result, an array of orders in JSON format
*********************************************************************************/
function loadUserOrders(sync){
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "4");
		formdata.append("index", "");
		formdata.append("date", date);
		formdata.append("customer", sessionStorage.getItem('username'));
		formdata.append("address", ""); 
		formdata.append("supplied", "");
		formdata.append("total", "");
		formdata.append("comment", "");
		formdata.append("products", "");
		
		console.log('load orders for: ' + sessionStorage.getItem('username') + ' now..'); 
		
		$.ajax({    
        url: 			'OrderServlet', 	
        dataType: 		'text',  		
        cache: 			false,
        contentType: 	false,
        processData: 	false,
        data: 			formdata,                         
        type: 			'post',
        async: 			sync,
        success: function(response){ 
        			
        			if (response == '') return;
        			var orders = JSON.parse(response);    			 			
		            var length = orders.length;
		            
		            for(var i = 0; i < length; i++){
		            	addUserOrder(orders[i]);	
		            }
    			}
     	});
}



/*********************************************************************************
*	this function adds an order to the users orders list. this function get a 
*	json object of an order and append a new row to the orders table in the page 
*	@param:		orderObj, a JSON object that holds order details
*	return:		null
*********************************************************************************/
function addUserOrder(orderObj){
	var order			= JSON.parse(orderObj);	
	var table			= document.getElementById('order-table');
	var row				= document.createElement('tr');
	var tdIdx			= document.createElement('td');
	var tdDate			= document.createElement('td');
	var tdTotal			= document.createElement('td');
	var tdSupplied		= document.createElement('td');
	var dateStr			= new String(new Date(Number(order.date))).split(' ').slice(0, 5);
	
	tdDate.innerHTML	= dateStr;
	tdTotal.innerHTML	= (order.total); 
	tdSupplied.innerHTML= (order.supplied) ? "not yet.." : "yes";
	tdIdx.innerHTML		= (order.index);
	
	row.setAttribute('id', 'order-row-' + order.index);
	row.setAttribute('class', 'order-row');
	row.setAttribute('onclick', 'orderRowClicked(this)');
	row.setAttribute('data-toggle', 'modal');	
	row.setAttribute('data-target', '#user-order-Modal');	
	
	row.appendChild(tdIdx);
	row.appendChild(tdDate);
	row.appendChild(tdTotal);
	row.appendChild(tdSupplied);
	table.appendChild(row);
}


/*********************************************************************************
*	this function handles the 'clicked' event of an order in the users past orders
*	table. function gather order details from the user past orders table and sends
*	a request to the server for all order details, and displays it in the 'order-modal'
*	@param:		row, HTMLElement that exist in the user past orders table 
*	return:		null
*********************************************************************************/
function orderRowClicked(row)
{
	var customer		= sessionStorage.getItem('username');
	var columns			= row.getElementsByTagName('td');
	var orderId			= document.getElementById('user-order-index');
	var orderTotal		= document.getElementById('user-order-total');
	var orderDate		= document.getElementById('user-order-date');
	var formdata		= new FormData();
	
	orderId.innerHTML	= columns[0].innerHTML; 
	orderTotal.value	= columns[2].innerHTML;
	orderDate.value		= columns[1].innerHTML;
	
	  
	formdata.append("code", 	"3");
	formdata.append("index", 	orderId.innerHTML);
	formdata.append("date", 	orderDate.innerHTML);
	formdata.append("customer", customer); 
	formdata.append("address", 	"");
	formdata.append("supplied", "");
	formdata.append("total", 	"");
	formdata.append("comment", 	"");
	formdata.append("products", "");
	
	
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
    		var orderObj	= JSON.parse(response);
    		var order		= JSON.parse(orderObj);
    		var prodsStr	= new String((order.products));
    		var jsonReg		= /\{.*?\}/g;
    		var products	= prodsStr.match(jsonReg);
    		var form		= document.getElementById('user-order-form');
    		var exstProds	= form.getElementsByClassName('user-order-products'); 
			var editBtn		= document.getElementById('order-edit-btn');
			var updateBtn	= document.getElementById('order-update-btn');

			if(sessionStorage.getItem('username') === 'admin'){
				editBtn.style.display = 'block';
				updateBtn.style.display = 'block';
				updateBtn.setAttribute('style', 'float:right;');
			}
    		
    		document.getElementById('user-order-shipping-address').value = order.address;
    		document.getElementById('user-order-comment').value  = order.comment; 		
    		
    		for( var i = exstProds.length; i > 0; i--)
    			exstProds[i-1].remove();
    				
    		for(var i = 0; i < products.length; i++)
    		{
    			var prodStr =  (new String(products[i])).replace('/\\/g', '');
				var product = JSON.parse(prodStr); 
    			var img		= localStorage.getItem('img-' + product.type);
    			var imgElem	= document.createElement('img');
    			var div		= document.createElement('div');
    			var label	= document.createElement('label');
				var input	= document.createElement('input');
				var remove	= document.createElement('a');
    			
    			imgElem.src	= img;
    			imgElem.setAttribute('class', 'thumb');
    			label.innerHTML = 'length: ';
				input.value	=  product.length;
				input.disabled = true;
				input.setAttribute('class', 'user-order-product-length');
				input.setAttribute('style', 'border:0px; width: 40px;');
				input.setAttribute('id', 'user-order-product-length-' + product.type);
				remove.setAttribute('class', 'user-order-product-remove');
				remove.setAttribute('href', '#user-order-products');
				remove.setAttribute('onclick', 'removeProductFromOrder()');
				remove.setAttribute('style', 'padding-left:10px;');
				remove.innerHTML = 'remove';
    			div.setAttribute('class', 'user-order-products');
				div.setAttribute('id', 'user-order-products');
    			div.appendChild(imgElem);
    			div.appendChild(label);
				div.appendChild(input);
				div.appendChild(remove);
    			document.getElementById('user-order-form').appendChild(div);
    		}
    	}
    });
}


/*********************************************************************************
*	this function upload a product to the application localStorage memory
*	@param:		product, a javascript object that holds products details
*	@param:		id, a unique product identifier
*	return:		null
*********************************************************************************/
function setLocalProduct(product, id){
	localStorage.setItem('catalog-' + id, product.catalog);
	localStorage.setItem('length-' + id, product.length);
	localStorage.setItem('price-' + id, product.price);
	localStorage.setItem('color-' + id, product.color);
	localStorage.setItem('img-' + id, product.image);
	
	var cat = localStorage.getItem('catalog-' + id);
	
	console.log('set local storage for product: ' + cat);
}


/*********************************************************************************
*	this function download a product from the application localStorage memory
*	@param:		id, a unique product identifier
*	return:		product, a javascript object that holds products details
*********************************************************************************/
function getLocalProduct(id){
	console.log('get product: ' + id);
	var product		= {'catalog': "", 'length': "", 'price':"", 'color':"", 'image':"" };
	product.catalog = localStorage.getItem('catalog-' + id);
	product.length	= localStorage.getItem('length-' + id);
	product.price 	= localStorage.getItem('price-' + id);
	product.color 	= localStorage.getItem('color-' + id);
	product.image 	= localStorage.getItem('img-' + id);
	/*
	console.log('get product: ' + '\ncatalog:' + product.catalog
								+ '\nlength:' + product.length
								+ '\nprice:' + product.price
								+ '\ncolor:' + product.color
								+ '\nimage:' + product.image);
	*/
	return product;
}


/*********************************************************************************
*	this function send a new order to the server async. it iterates over all 
*	'new-products' in the new order and extract details of all added products:
*	type (catalog), length and color, bundle to an array objects of the following
*	form: [{'catalog':<catalog>, 'length': <length>, 'color': <color>},..]
*	@param:		null
*	return:		null
*********************************************************************************/
function sendNewOrder(){
	var form		= document.getElementById('new-order-form');
	var products	= form.getElementsByClassName('order-product')	
	var length		= products.length;
	var date		= new Date().getTime();
	var formdata	= new FormData();
	var	user		= sessionStorage.getItem('username');
	var ordrdPrdLst	= [];
	var address		= document.getElementById('shipping-address').value;
	var comment		= document.getElementById('shipping-comment').value;
	var totalElem	= document.getElementById('order-total');
	var total		= new String(totalElem.innerHTML);//.split(":")[1];
	console.log('total for order: ' + total); 
	
	if( length === 0 ){
		alert('no products added..');
		return;
	}
	
	for(var i = 0; i < length; i++){
				 
		var id			= products[i].id;
		var image		= products[i].getElementsByClassName('img');
		var type		= id.split('-')[2];
		var lengthElem	= document.getElementById('length-lbl-' + type);
		var productLen	= lengthElem.innerHTML;	
		var plen		= new String(productLen).split(':')[1];
		var	ordrdPrdct	= { 'type': type, 'length': plen };
		ordrdPrdLst.push(ordrdPrdct);
	}
	
	totalElem.innerHTML	= total;
	formdata.append("code", 	"1");
	formdata.append("index", 	"");
	formdata.append("date", 	date);
	formdata.append("customer", user); 
	formdata.append("address", 	address);
	formdata.append("supplied", false);
	formdata.append("total", 	total);
	formdata.append("comment", 	comment);
	formdata.append("products", JSON.stringify(ordrdPrdLst));
	
	
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
    			closeNewOrder()
    		}
    	}
    });
    
    
}


/*********************************************************************************
*	this function creates a 'select' like element for each product was chosen from
*	the products list and adds to the 'cart', along with 'edit' and 'remove' 
*	options for each product. the element is appended to the 'new-order-for' form
*	in the modal.
*	@param:		addBtnName, the HTMLElement (button) that triggered the 'add'
*							operation 
*	return:		null
*********************************************************************************/
function addProductToOrder(addBtnName){
	var type		= new String(addBtnName.id).split('add-new-product-')[1];
	var product		= getLocalProduct(type);
	var row			= document.createElement('div');
	var imgSrc		= product.image;
	var imgLbl		= document.createElement('img');
	var productElm	= document.createElement('div');
	var lengthLbl	= document.createElement('label');
	var colorLbl	= document.createElement('label');
	var priceLbl	= document.createElement('label');
	var edit		= document.createElement('a');
	var remove		= document.createElement('a');
	var space		= document.createElement('i');
	var form		= document.getElementById('new-order-form');
	var catLen		= new String(product.catalog + "-" + product.length);
	var btn			= document.getElementById(addBtnName.id);
	var parent		= btn.parentElement;
	var inputs		= parent.parentElement.getElementsByTagName('input');
	var row			= document.createElement('div');
	var colColor	= document.createElement('div');
	var colLength	= document.createElement('div');
	var colImage	= document.createElement('div');
	var colEdRem	= document.createElement('div');
	var totalElem	= document.getElementById('order-total');
	var total		= Number(totalElem.innerHTML);	
	total			= total + Number(inputs[0].value) * Number(product.price);
	
	
	if(localStorage.getItem('currentLength-' + product.catalog) == inputs[0].value )
	{
		alert('product already exist.. change length or product type');
		return;	
	}
	
	totalElem.innerHTML = total;
	row.setAttribute('class', 'row');	
	colColor.setAttribute('class', 'new-order-product');
	colLength.setAttribute('class', 'new-order-product');
	colImage.setAttribute('class', 'new-order-product');
	colEdRem.setAttribute('class', 'new-order-product');
	
	lengthLbl.setAttribute('class', 'new-order-product');
	lengthLbl.setAttribute('style', 'text-align: left;');
	lengthLbl.setAttribute('id', 'length-lbl-' + type);
	lengthLbl.innerHTML = 'length: ' + inputs[0].value;
	colorLbl.innerHTML 	= 'color: ' + inputs[1 ].value; 
	colorLbl.setAttribute('id', 'color-lbl-' + type);
	colorLbl.setAttribute('style', 'margin-left: 15%;');
	colorLbl.setAttribute('class', 'new-order-product');
	//priceLbl.setAttribute('style', 'text-align: left;');
	imgLbl.setAttribute('style', 'margin-left: 15%; margin-right: 10%;');
	imgLbl.src			= imgSrc;
	edit.innerHTML		= 'edit';
	imgLbl.setAttribute('class', 'image');
	edit.setAttribute('onclick', 'editOrderProduct(' + catLen + ')');
	edit.setAttribute('style', 'width: 35px;');
	edit.setAttribute('href', '#' + product.catalog);
	remove.setAttribute('id', 'remove-' + catLen );
	remove.setAttribute('onclick', 'removeOrderProduct(this)' );
	remove.setAttribute('href', '#' + product.catalog);
	remove.setAttribute('style', 'text-align:right;');
	remove.innerHTML	= 'remove';
	space.innerHTML		= ' / ';
	
	colLength.innerHTNL =(lengthLbl);
	colColor.appendChild(colorLbl);
	colImage.appendChild(imgLbl);
	colEdRem.appendChild(edit)
	colEdRem.appendChild(space)
	colEdRem.appendChild(remove)
	
	row.appendChild(colColor);
	row.appendChild(colLength);
	row.appendChild(colImage);
	row.appendChild(colEdRem);
	
	productElm.setAttribute('class', 'order-product');
	productElm.setAttribute('id', 'order-product-' + catLen);// product.catalog + product.length);

	productElm.appendChild(lengthLbl);
	productElm.appendChild(colorLbl);
	productElm.appendChild(imgLbl);
	productElm.appendChild(edit);
	productElm.appendChild(space);
	productElm.appendChild(remove);
	
	form.appendChild(productElm);	
	console.log('added product to order: ' + productElm.id);
}



/*********************************************************************************
*	this function removes a selected item (product) from the 'cart' (products list)
*	by finding the correct item: item id is the catalog concat. with chosen length.
*	@param:		null
*	return:		result, div the created element
*********************************************************************************/
function removeOrderProduct(productID){
	var str			= new String(productID.id);
	var type		= str.split('-')[1];
	var length		= str.split('-')[2];
	console.log('parent node name: ' + type + '-' + length);
	localStorage.removeItem('currentLength-' + type);
	localStorage.removeItem('currentColor-' + type);
	var product		= document.getElementById('order-product-' + type + '-' + length);
	product.remove();
}


/*********************************************************************************
*	this function allows to edit a selected item (product) from the 'cart'. (products 
*	list). it opens the items dialog with parameters to be altered.
*	TODO: complete functionality
*	@param:		null
*	return:		result, div the created element
*********************************************************************************/
function editOrderProduct(productID){	
	try{
			var str			= new String(productID.id);
			var type		= str.split('-')[1];
			var length		= str.split('-')[2];
			console.log('parent node name: ' + type + '-' + length);
			var product		= document.getElementById('order-product-' + type + '-' + length);
			console.log('edit product: ' + product);
		
	}
	catch(e){
		console.log('error in edit product: ' + e);
	}	
}



/*********************************************************************************
*	this function creates new selected product option in the product selection
*	drop-down
*	@param:		product, a JSON object that holds all the products details
*	return:		option, div the created element
*********************************************************************************/
function createNewProductOption(product){

	var lengthLbl	= document.createElement('label');
	var colorLbl	= document.createElement('label');
	var priceLbl	= document.createElement('label');
	var typeLbl		= document.createElement('label');
	var img			= document.createElement('img');
	var add			= document.createElement('button');
	var lengthInp	= document.createElement('input');
	var colorInp	= document.createElement('input');
	var spanLen		= document.createElement('div');
	var spanCol		= document.createElement('span');
	var spanPrc		= document.createElement('span');
	var div			= document.createElement('div');
	var div1		= document.createElement('div');
	var div2		= document.createElement('div');
	var div3		= document.createElement('div');

	
	setLocalProduct(product, product.catalog);

	lengthInp.setAttribute('id','new-product-length-' + product.catalog);
	colorInp.setAttribute('id','new-product-color-' + product.catalog);
	
	add.setAttribute('class','btn btn-success');
	add.setAttribute('id','add-new-product-' + product.catalog);
	add.setAttribute('style','width:85%;');
	add.setAttribute('onclick','addProductToOrder(this)');
	add.innerHTML		= 'add';	
	img.src				= product.image;
	img.setAttribute('class', 'order-product-image');
	img.setAttribute('id', 'order-product-image' + product.catalog);  
	
	div.setAttribute('class', 'box');
	div.setAttribute('id', 'product-option-' + product.catalog);
	div.setAttribute('onclick', 'optionClicked(this)');
	div1.setAttribute('class', 'order-block-lower');
	div2.setAttribute('class', 'order-block-lower');
	div3.setAttribute('class', 'order-block-lower');

	typeLbl.innerHTML	= 'type' + product.catalog;
	lengthLbl.innerHTML = 'length:';
	colorLbl.innerHTML	= 'color:';
	priceLbl.innerHTML	= 'price' + product.catalog;
	
	
	// first column
	div1.appendChild(img);
	div1.appendChild(typeLbl);
	
	// second column
	spanLen.appendChild(lengthLbl);	
	spanLen.appendChild(lengthInp);
	spanCol.appendChild(colorLbl);
	spanCol.appendChild(colorInp);	
	div2.appendChild(spanLen);
	div2.appendChild(spanCol);
	
	// third column
	div3.appendChild(add);

	div.appendChild(div1);
	div.appendChild(div2);
	div.appendChild(div3);

	return div;
}


/*********************************************************************************
*	this function saves the last 'known' chosen length for each product with each
*	time the user clicked on the product div element.
*	@param:		option, the div element containing the product details
*	return:		null
*********************************************************************************/
function optionClicked(option){
	var inputs		= option.getElementsByTagName('input');
	var type		= new String(option.id).split('-')[2];
	
	// clear local storage before insert into memory (in case prior choice was clicked)
	localStorage.removeItem('currentLength-' + type);
	localStorage.removeItem('currentColor-' + type);
	
	localStorage.setItem('currentLength-' + type, inputs[0].value);
	localStorage.setItem('currentColor-' + type, inputs[1].value);
	console.log('option clicked');
}


/*********************************************************************************
*	this function creates an order modal as HTML element and return to caller
*	@param:		null
*	return:		modal, a 'div' HTML element that holds all order fields
*********************************************************************************/
function openOrderModal(){
	var formdata 		= new FormData();
	
	formdata.append("code", 	"0");
	formdata.append("index", 	"");
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
					var existProducts	= dropDown.getElementsByClassName('box');
					
					// remove all previous products
					if(existProducts.length > 0){
						for(var i = existProducts.length - 1; i >= 0 ; i--)
							existProducts[i].remove();
					} 			

					for(var i = 0; i < products.length; i++){
						var product 	= JSON.parse(products[i]);
        				var option		= createNewProductOption(product);
						dropDown.appendChild(option);
    				}
    			}
     	});

}


/*********************************************************************************
*	this function closes the new order modal, through the DOM
*	@param:		null
*	return:		null
*********************************************************************************/
function closeNewOrder(){
	/*
	var	elem		= document.getElementById('new-order-Modal1');
	var select		= document.getElementById('select-group');
	if( select !== null )
		select.parentNode.removeChild(select);
	elem.style.display = 'none';//remove();
	*/
	console.log('close order modal');
}



/*********************************************************************************
*	this function allows the user (admin) to edit an orders, product length, or
*	remove a product all together, and also change the shipping address, comment
*	and total (in case of a discount).
*	@param:		editBtn, the edit button element that was clicked
*	return:		null
*********************************************************************************/
function editOrder(editBtn){
	//var	footer			= editBtn.parentElement;
	var form			= document.getElementById('user-order-form');
	var lengths			= document.getElementById('user-order-product-length');
	var products		= form.getElementsByClassName('user-order-products');
	var shipping		= document.getElementById('user-order-shipping-address');
	var comment			= document.getElementById('user-order-comment');
	var length			= document.getElementById('user-order-product-length-');
	var total			= document.getElementById('user-order-total');
	
	shipping.disabled 	= false;
	comment.disabled 	= false;
	//length.disabled 	= false;
	total.disabled 		= false;
	for(var i = 0; i < lengths.length; i++)
	{
		lengths[i].disabled = false;
	}
	console.log('edit order');
}


function updateOrder(){
	console.log('update order');
}


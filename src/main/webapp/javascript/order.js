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
	
	if( length === 0 ){
		alert('no products added..');
		return;
	}
	
	for(var i = 0; i < length; i++){
		var lengthElems	= form.getElementsByClassName('label');
		var length		= new String(lengthElems[0].innerHTML);
		var color		= new String(lengthElems[1].innerHTML);
		
		
	}
}

function addProductToOrder1(prodObj){
	
	var prodStr		= new String(prodObj).split('#')[1];
	var prod		= document.getElementById(prodStr);
	var product		= document.createElement('div');
	var row			= document.createElement('div');
	var col9		= document.createElement('div');
	var col3		= document.createElement('div');
	var imgs		= prod.getElementsByTagName('img');
	var img 		= document.createElement('img'); 
	
	
	
	img.src		= imgs[0].src;
	
	col9.setAttribute('class', 'col-xl-9 col-md-8');
	col3.setAttribute('class', 'col-xl-3 col-md-4 pt-3 pt-md-0');
	product.setAttribute('class', 'row');
	product.setAttribute('class', 'container pb-5 mt-n2 mt-md-n3');
	
	col3.appendChild(img);
	row.appendChild(col3);
	row.appendChild(col9);
	product.appendChild(row);
	
	console.log('add new product 1');
	return product;
}
	
	
	
	
/*********************************************************************************
*	this function adds a chosen product to order. according to unique identifier
*	the function locates the correct 'new-order-product' element and extract
*	product length and color. after product details are extracted the function
*	adds the product to the 'new-order-form' form for display
*	@param:		catalog, int a unique identifier for each product
*	return:		null
*********************************************************************************/
function addProductToOrder(prodObj){

	var prodStr		= new String(prodObj).split('#')[1];
	var prod		= document.getElementById(prodStr);
	var lstUndrIdx	= prodStr.lastIndexOf('-');
	var catalog		= prodStr.substr(lstUndrIdx + 1, prodStr.length - 1);
	var product		= document.createElement('div');
	var lengthLbl	= document.createElement('label');
	var colorLbl	= document.createElement('label');
	var imgLbl		= document.createElement('img');
	var edit		= document.createElement('a');
	var remove		= document.createElement('a');
	var space		= document.createElement('i');
	var form		= document.getElementById('new-order-form'); 
	var img			= prod.getElementsByTagName('img');
	var inputs		= prod.getElementsByTagName('input');	
	var length		= inputs[0].value;
	var color		= inputs[1].value;
	var colLen		= new String(color + length);
	var catLen		= new String(catalog + "_" + length);
	var row			= document.createElement('div');
	var colColor	= document.createElement('div');
	var colLength	= document.createElement('div');
	var colImage	= document.createElement('div');
	var colEdRem	= document.createElement('div');
	//var table		= createTable('productTable', 1, 4, false);
	var imgURL		= null;
	
	
	row.setAttribute('class', 'row');	
	colColor.setAttribute('class', 'col-sm');
	colLength.setAttribute('class', 'col-sm');
	colImage.setAttribute('class', 'col-sm');
	colEdRem.setAttribute('class', 'col-sm');
	
	
	lengthLbl.setAttribute('style', 'text-align: left;');
	lengthLbl.innerHTML = 'length: ' + length;
	colorLbl.innerHTML 	= 'color: ' + color; 
	colorLbl.setAttribute('style', 'margin-left: 15%;');
	imgLbl.setAttribute('style', 'margin-left: 15%; margin-right: 10%;');
	imgLbl.src			= img[0].src;
	edit.innerHTML		= 'edit';
	imgLbl.setAttribute('class', 'image');
	edit.setAttribute('onclick', 'editOrderProduct(' + catLen + ')');
	edit.setAttribute('style', 'margin-left: 35%;');
	edit.setAttribute('href', '#' + prodStr);
	remove.setAttribute('onclick', "removeOrderProduct(" + catLen + ")" );
	remove.setAttribute('href', '#' + prodStr);
	remove.setAttribute('style', 'text-align:right;');
	remove.innerHTML	= 'remove';
	space.innerHTML		= ' / ';
	/*
	table.rows[0].cells[0].innerHTML = lengthLbl.innerHTML;
	table.rows[0].cells[1].innerHTML = colorLbl.innerHTML;
	table.rows[0].cells[2].innerHTML = "img";
	table.rows[0].cells[2].appendChild(imgLbl);
	table.rows[0].cells[3].innerHTML = edit;
	*/
	colLength.innerHTNL =(lengthLbl);
	colColor.appendChild(colorLbl);
	colImage.appendChild(imgLbl);
	colEdRem.appendChild(edit)
	
	row.appendChild(colColor);
	row.appendChild(colLength);
	row.appendChild(colImage);
	row.appendChild(colEdRem);
	
	product.setAttribute('class', 'order-product');
	product.setAttribute('id', 'order-product-' + catalog + length);
	product.appendChild(lengthLbl);
	product.appendChild(colorLbl);
	product.appendChild(imgLbl);
	product.appendChild(edit);
	product.appendChild(space);
	product.appendChild(remove);
	
	form.appendChild(product);
	form.appendChild(row);
	
}


function addProductToOrder2(prodObj){

	try{
		var prodStr		= new String(prodObj).split('#')[1];
		var product		= document.getElementById(prodStr);
		var	values		= product.getElementsByTagName('label');
		var type		= product.catalog;
		var price		= product.price;
		var img			= product.getElementsByTagName('img')[0];
		var form		= document.getElementById('new-order-form');
		
		//console.log('product image: ' + img.src);
		
		var shopItem = document.createElement("div");
	  	//shopItem.classList.add("shop-item");
	  	var shopItemContent = "	<span class='shop-item-title''>" + type + "${type} type pine wood </span> 					\
		                        <img class='shop-item-image' src=" + img.src + " alt='product photo'> 						\
		                        <div class='shop-item-details'>																\
		                        <input class='input-length' type='number' min='0' pattern='[0-9]*' inputmode='numeric'		\
		                         placeholder='length in centimeters' style='margin-bottom: 3px;'>							\
		                        <div>																						\
		                         <input class='input-quantity' type='number' min='0' pattern='[0-9]*' inputmode='numeric'	\
		                         placeholder='quantity'>																	\
		                        </div>																						\
		                        </div>																						\
		                        <div>																						\
		                        <span>" + price + "$ per meter</span>														\
		                        <button role='button' name='add' id='AddToCart' style='margin-top: 5px;'					\
		                        class='btn btn-primary shop-item-btn'>														\
		                        <span id='AddToCart'>																		\
		                         Add To Cart																				\
		                        </span>" + 																					
		                        "</button>" +																					
		                        "</div>";																						
		/*
		shopItem
		    .getElementsByClassName("input-length")[0]
		    .addEventListener("change", lengthChange);
		shopItem
		    .getElementsByClassName("input-quantity")[0]
		    .addEventListener("change", quantityChange);
		shopItem
		  	.getElementsByClassName("shop-item-btn")[0]
		  	.addEventListener("click", addToCartClicked);
		*/
		shopItem.innerHTML = shopItemContent;
	}
	catch(error){
		
		console.log('error adding item: ' + error);
	}

	  //var shopItems = document.getElementsByClassName("shop-items")[0];
	  //shopItems.append(shopItem);
	 
	console.log('product added length: ' + values[0].innerHTML + ' and color:' + values[1].innerHTML);

	form.append(shopItem);
}



function removeOrderProduct(productID){
	var str			= new String(productID);
	console.log('productID with this: ' + productID);
	var product		= document.getElementById('order-product-' + productID);
	var values		= product.getElementsByTagName('label');
	product.remove();

	console.log('product id: ' + str + ' has values: ' + values[0].innerHTML + values[1].innerHTML);
}



function editOrderProduct(productElement){
	
	try{
		var str			= new String(productElement);
		var prodStr		= new String(productElement).split('#')[1];
		//var prod		= document.getElementById(prodStr);
		console.log('edit product: ' + str);
		
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
	try
	{
		var li				= document.createElement('li');
		var option			= document.createElement('div');
		var lengthLbl		= document.createElement('label');
		var colorLbl		= document.createElement('label');
		var length			= document.createElement('input');
		var color			= document.createElement('input');
		var img				= document.createElement('img');
		var add				= document.createElement('a');
		var prodObj			= new Object();
		
		
		
		option.setAttribute('class', 'new-order-product');	
		option.setAttribute('id', 'new-order-product-' + product.catalog);	
		length.setAttribute('id', 'new-product-length-' + product.catalog);
		color.setAttribute('id', 'new-product-color-' + product.catalog);
		add.setAttribute('id', 'new-product-add-' + product.catalog);
		add.setAttribute('href', '#new-order-product-' + product.catalog);
		add.setAttribute('onclick', 'addProductToOrder2(this)');
		//add.setAttribute('onclick', 'addProductToOrder2(this)');
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

/*
*	this file handles order related functionalities 
*	order format:
*	"order_id":	int,
*	"date":		long,
*	"total":	float,
*	"supplied":	boolean,
*		
*/


function setLocalProduct(product, id){
	localStorage.setItem('catalog-' + id, product.catalog);
	localStorage.setItem('length-' + id, product.length);
	localStorage.setItem('price-' + id, product.price);
	localStorage.setItem('color-' + id, product.color);
	localStorage.setItem('img-' + id, product.image);
	
	var cat = localStorage.getItem('catalog-' + id);
	
	console.log('set local storage for product: ' + cat);
}


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

function addProductToOrder1(addBtnName){

	var type		= new String(addBtnName.id).split('add-new-product')[1];
	var product		= getLocalProduct(type);
	var row			= document.createElement('div');
	var col9		= document.createElement('div');
	var col3		= document.createElement('div');
	var imgSrc		= product.image;
	var imgLbl		= document.createElement('img');
	var form		= document.getElementById('new-order-form');
	var productElm	= document.createElement('div');
	var lengthLbl	= document.createElement('label');
	var colorLbl	= document.createElement('label');
	var edit		= document.createElement('a');
	var remove		= document.createElement('a');
	var space		= document.createElement('i');
	var colLen		= new String(product.color + product.length);
	var catLen		= new String(product.catalog + "_" + product.length);
	
	console.log('form to add to: ' + form.id);
	
	var row			= document.createElement('div');
	var colColor	= document.createElement('div');
	var colLength	= document.createElement('div');
	var colImage	= document.createElement('div');
	var colEdRem	= document.createElement('div');
	
	row.setAttribute('class', 'row');	
	colColor.setAttribute('class', 'col-sm');
	colLength.setAttribute('class', 'col-sm');
	colImage.setAttribute('class', 'col-sm');
	colEdRem.setAttribute('class', 'col-sm');
	
	lengthLbl.setAttribute('style', 'text-align: left;');
	lengthLbl.innerHTML = 'length: ' + product.length;
	colorLbl.innerHTML 	= 'color: ' + product.color; 
	colorLbl.setAttribute('style', 'margin-left: 15%;');
	imgLbl.setAttribute('style', 'margin-left: 15%; margin-right: 10%;');
	imgLbl.src			= imgSrc;
	edit.innerHTML		= 'edit';
	imgLbl.setAttribute('class', 'image');
	edit.setAttribute('onclick', 'editOrderProduct(' + catLen + ')');
	edit.setAttribute('style', 'margin-left: 35%;');
	edit.setAttribute('href', '#' + product.catalog);
	remove.setAttribute('onclick', "removeOrderProduct(" + catLen + ")" );
	remove.setAttribute('href', '#' + product.catalog);
	remove.setAttribute('style', 'text-align:right;');
	remove.innerHTML	= 'remove';
	space.innerHTML		= ' / ';
	
	colLength.innerHTNL =(lengthLbl);
	colColor.appendChild(colorLbl);
	colImage.appendChild(imgLbl);
	colEdRem.appendChild(edit)
	
	row.appendChild(colColor);
	row.appendChild(colLength);
	row.appendChild(colImage);
	row.appendChild(colEdRem);
	
	productElm.setAttribute('class', 'order-product');
	productElm.setAttribute('id', 'order-product-' + product.catalog + product.length);
	productElm.appendChild(lengthLbl);
	productElm.appendChild(colorLbl);
	productElm.appendChild(imgLbl);
	productElm.appendChild(edit);
	productElm.appendChild(space);
	productElm.appendChild(remove);
	
	form.appendChild(productElm);
	
	console.log('added product to order');
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
		var type		= new String(prodObj.id).split('add-new-product')[1];
		console.log('product : ' + type);
		
		var product		= getLocalProduct(type);
		
		var type		= product.catalog;
		var price		= product.price;
		var img			= product.image;
		var	length		= product.length;
		var form		= document.getElementById('new-order-form');		
		var shopItem = document.createElement("div");
	  	//shopItem.classList.add("shop-item");
	  	var shopItemContent = "	<span class='shop-item-title''>" + type + " type pine wood </span> 					\
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
		form.append(shopItem);
	}
	catch(error){
		
		console.log('error adding item: ' + error);
	}

	  //var shopItems = document.getElementsByClassName("shop-items")[0];
	  //shopItems.append(shopItem);
	 
	//console.log('product added length: ' + values[0].innerHTML + ' and color:' + values[1].innerHTML);

	
}



function removeOrderProduct(productID){
	var str			= new String(productID);
	console.log('productID with this: ' + productID);
	var product		= document.getElementById('order-product-' + productID);
	//var values		= product.getElementsByTagName('label');
	product.remove();

	//console.log('product id: ' + str + ' has values: ' + values[0].innerHTML + values[1].innerHTML);
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

	lengthInp.setAttribute('id','new-product-length' + product.catalog);
	colorInp.setAttribute('id','new-product-color' + product.catalog);
	
	add.setAttribute('class','btn btn-success');
	add.setAttribute('id','add-new-product' + product.catalog);
	add.setAttribute('style','width:85%;');
	add.setAttribute('onclick','addProductToOrder1(this)');
	add.innerHTML		= 'add';	
	img.src				= product.image;
	img.setAttribute('class', 'order-product-image');
	img.setAttribute('id', 'order-product-image' + product.catalog);  
	
	div.setAttribute('class', 'box');
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
*	this function creates an order modal as HTML element and return to caller
*	@param:		null
*	return:		modal, a 'div' HTML element that holds all order fields
*********************************************************************************/
function openOrderModal(){
	
	console.log('open modal..');
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
					var existProducts	= dropDown.getElementsByClassName('box');
        		    
					console.log('number of prducts: ' + products.length);
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
	//elem.style.display = 'none';
}

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
	var	user		= sessionStorage.getItem('user');
	var total		= Number(0);
	var ordrdPrdLst	= [];
	
	if( length === 0 ){
		alert('no products added..');
		return;
	}
	
	
	for(var i = 0; i < length; i++){
		console.log('product: ' + products[i].id);
		var id		= products[i].id;
		var prodLen	= id.split('-')[3];
		var type	= id.split('-')[2];
		var product	= getLocalProduct(type);
		total		= total + Number(prodLen) * Number(product.price); 
		var	ordrdPr	= {'type': type, 'length': prodLen};
		ordrdPrdLst[i] = ordrdPr;
	}
	
	console.log('new order: ' + '\nproduct type: ' + type + '\nproduct length: ' + prodLen + '\ntotal: ' + total);
	formdata.append("code", "1");
	formdata.append("date", date);
	formdata.append("customer", user); 
	formdata.append("address", address);
	formdata.append("supplied", false);
	formdata.append("total", total);
	formdata.append("comment", comment);
	formdata.append("products", ordrdPrdLst);
	
	/*
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
    
    */
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
	var colLen		= new String(product.color + product.length);
	var catLen		= new String(product.catalog + "-" + product.length);
	var chosenLen	= localStorage.getItem('currentLength-' + product.catalog);
	var chosenCol	= localStorage.getItem('currentColor-' + product.catalog);
	
	
	var btn			= document.getElementById(addBtnName.id);
	console.log('add button parent: ' + btn.parentElement);
	var parent		= btn.parentElement;
	var inputs		= parent.parentElement.getElementsByTagName('input');
	console.log('product inputs: ' + inputs);
	console.log('product chosen length: ' + inputs[0].value + '\nproduct chosen color: ' + inputs[1].value);
	
	
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
	lengthLbl.setAttribute('id', 'length-lbl-' + type);
	lengthLbl.innerHTML = 'length: ' + inputs[0].value;
	colorLbl.innerHTML 	= 'color: ' + inputs[1].value; 
	colorLbl.setAttribute('id', 'color-lbl-' + type);
	colorLbl.setAttribute('style', 'margin-left: 15%;');
	//priceLbl.setAttribute('style', 'text-align: left;');
	imgLbl.setAttribute('style', 'margin-left: 15%; margin-right: 10%;');
	imgLbl.src			= imgSrc;
	edit.innerHTML		= 'edit';
	imgLbl.setAttribute('class', 'image');
	edit.setAttribute('onclick', 'editOrderProduct(' + catLen + ')');
	edit.setAttribute('style', 'margin-left: 35%;');
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
	console.log('close order modal ');
	var	elem		= document.getElementById('new-order-Modal');
	var select		= document.getElementById('select-group');
	if( select !== null )
		select.parentNode.removeChild(select);
	//elem.style.display = 'none';
}


window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}


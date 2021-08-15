/********************** 	handles index functionality *************************
 *	 
 *
 ********************************************************************************/


function onBodyLoad(body){
	/*
	
	// Add smooth scrolling to all links in navbar + footer link
  	$(".navbar a, footer a[href='#myPage'], #index-products").on('click', function(event) {
    	// Make sure this.hash has a value before overriding default behavior
    	if (this.hash !== "") {
	      	// Prevent default anchor click behavior
	      	event.preventDefault();
	
	      	// Store hash
	      	var hash = this.hash;
	
	      	// Using jQuery's animate() method to add smooth page scroll
	      	// The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
	      	$('html, body').animate({
	        	scrollTop: $(hash).offset().top
	      	}, 900, function(){
	   
	        	// Add hash (#) to URL when done scrolling (default click behavior)
	        	window.location.hash = hash;
	      	});
    	} // End if
  	});

	console.log('products: ' + document.getElementById('index-products'));
  
	$(window).scroll(function() {
		$(".slideanim").each(function(){
	    	var pos = $(this).offset().top;
			var winTop = $(window).scrollTop();
	        if (pos < winTop + 600) {
	        	$(this).addClass("slide");
	        }
	    });
	});
	*/
	
}

/*********************************************************************************
*	this function handles loading images and products details into page
*********************************************************************************/
$(document).ready(function(){
	
	loadStoreProducts();
	
	// Add smooth scrolling to all links in navbar + footer link
  	$(".navbar a, footer a[href='#myPage'] #index-products").on('click', function(event) {
    	// Make sure this.hash has a value before overriding default behavior
    	if (this.hash !== "") {
	      	// Prevent default anchor click behavior
	      	event.preventDefault();
	
	      	// Store hash
	      	var hash = this.hash;

			console.log(hash);
	
	      	// Using jQuery's animate() method to add smooth page scroll
	      	// The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
	      	$('html, body').animate({
	        	scrollTop: $(hash).offset().top
	      	}, 900, function(){
	   
	        	// Add hash (#) to URL when done scrolling (default click behavior)
	        	window.location.hash = hash;
	      	});
    	} // End if
  	});
  
	$(window).scroll(function() {
		$(".slideanim").each(function(){
	    	var pos = $(this).offset().top;
			var winTop = $(window).scrollTop();
	        if (pos < winTop + 600) {
	        	$(this).addClass("slide");
	        }
	    });
	});
	
})




/*********************************************************************************
*	this function loads products into the 'slideanim' element of the index.html
*	page by creating the element for each product, loaded from the DB
*	@param		null
*	@return 	null 
*********************************************************************************/
function loadStoreProducts(){
	
	var formdata	= new FormData();
	formdata.append("code", "0");
	formdata.append("catalog", "0");
	formdata.append("type", "0"); 
	formdata.append("price", "0");
	formdata.append("length", "0");
	formdata.append("color", "");
		
		
	$.ajax({    
    url: 			'ProductServlet', 	
    dataType: 		'text',  		
    cache: 			false,
    contentType:	false,
    processData:	false,
    data: 			formdata,                         
    type: 			'post',
    async: 			true,
    success: function(response){
				
    			var products 	= JSON.parse(response);
				var prodsElem 	= document.getElementById('products');
				var j = 0;
				
    			for(var i = 0; i < products.length;){
					if( i%3 == 0){
						var row = document.createElement('div');
						row.setAttribute('class', 'row slideanim');
						row.setAttribute('id', 'row-slideanim-' + j);
						prodsElem.appendChild(row);			
					}
					
					var slideAnim	= document.getElementById('row-slideanim-' + j);	
					
					for( var k = 0; k < 3; k++, i++){
						var div			= document.createElement('div');
						var product 	= JSON.parse(products[i]); 
						div.setAttribute('class', 'col-sm-4 col-xs-12');
						div.appendChild(createStoreProducts(product));
						slideAnim.appendChild(div);
					}
					if( i%3 === 0 )
						j++;
    			}
			}
     	});
}


/*********************************************************************************
*	this function create a product element, with details taken from the product
*	object given as an argument. 
*	@parameter	product, a JSON object that holds all the products details
*	@return 	panel, the element created  
*********************************************************************************/
function createStoreProducts(product){
	
	var output = '';
	for (var property in product) {
	  output += property + ': ' + product[property]+'; ';
	}
	//console.log('product: ' + output);
	
	var panel			= document.createElement('div');
	var panelBody		= document.createElement('div');
	var panelFooter		= document.createElement('div');
	var h3				= document.createElement('h3');
	var h4				= document.createElement('h4');
	var lengthInput		= document.createElement('input');
	var qtyInput		= document.createElement('input');
	var addBtn			= document.createElement('button');
	var span			= document.createElement('span');
	var img				= document.createElement('img');
	
	// set the attributes
	panel.setAttribute('class', 'panel panel-default text-center');
	panelBody.setAttribute('class', 'panel-body');
	panelFooter.setAttribute('class', 'panel-footer');
	img.setAttribute('class', 'img-responsive img-display');
	img.src = product.image;
	lengthInput.setAttribute('type', 'number');
	lengthInput.setAttribute('min', '0');
	lengthInput.setAttribute('pattern', '[0-9]');
	lengthInput.setAttribute('inputmode', 'numeric');
	lengthInput.setAttribute('placeholder', 'length in centimeters');
	qtyInput.setAttribute('type', 'number');
	qtyInput.setAttribute('min', '0');
	qtyInput.setAttribute('pattern', '[0-9]');
	qtyInput.setAttribute('inputmode', 'numeric');
	qtyInput.setAttribute('placeholder', 'quantity');
	addBtn.setAttribute('class', 'btn btn--large btn--full btn--clear uppercase');
	addBtn.setAttribute('type', 'submit');
	addBtn.setAttribute('name', 'addBtn');
	addBtn.setAttribute('id', 'add-to-cart-btn');
	addBtn.setAttribute('style', 'margin-top: 5px;');
	span.setAttribute('id', 'id-add-to-cart');
	h3.innerHTML = product.type;
	h4.innerHTML = product.price + '$ per meter';
	
	// build the element
	addBtn.appendChild(span);
	panelFooter.appendChild(h3);
	panelFooter.appendChild(h4);
	panelFooter.appendChild(lengthInput);
	panelFooter.appendChild(qtyInput);
	panelFooter.appendChild(addBtn);
	panelBody.appendChild(img);
	panel.appendChild(panelBody);
	panel.appendChild(panelFooter);
	
	return panel;
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}


/*********************************************************************************
*	this function fired up on document is ready. create a 'product' item,
*	with 'length', 'qty', 'add' & 'remove' buttons
*********************************************************************************/
function ready() {

	loadProducts();
	
	  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
	  //   console.log(removeCartItemButtons);
	  for (var i = 0; i < removeCartItemButtons.length; i++) {
	    var button = removeCartItemButtons[i];
	    button.addEventListener("click", removeButtonClicked);
	  }
	
	  var quantityInput = document.getElementsByClassName("cart-input-quantity");
	  for (var i = 0; i < quantityInput.length; i++) {
	    var input = quantityInput[i];
	    input.addEventListener("change", quantityChange);
	  }
	  var lengthInput = document.getElementsByClassName("cart-input-length");
	  for (var i = 0; i < lengthInput.length; i++) {
	    var input = lengthInput[i];
	    input.addEventListener("change", lengthChange);
	  }
	
	  var addToCartButtons = document.getElementsByClassName("shop-item-btn");
	  for (var i = 0; i < addToCartButtons.length; i++) {
	    var button = addToCartButtons[i];
	    button.addEventListener("click", addToCartClicked);
	  }
}


/*********************************************************************************
*	this function assign functionality to 'remove' button in 'product' item
*********************************************************************************/
function removeButtonClicked(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
}


/*********************************************************************************
*	this function handles the 'qty' input event 
*********************************************************************************/
function quantityChange(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
}


/*********************************************************************************
*	this function handles the 'length' input event 
*********************************************************************************/
function lengthChange(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0 || input.value > 600) {
    input.value = 75;
  }
}


/*********************************************************************************
*	this function handles 'add to cart' event
*********************************************************************************/
function addToCartClicked(event) {
	//alert("cart clicked");
	var button = event.currentTarget;
	var shopItem = button.parentElement.parentElement;
	//   console.log(shopItem);
	var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
	var length = shopItem
	  .getElementsByClassName("shop-item-details")[0]
	  .getElementsByClassName("input-length")[0].value;
	
	var quantity = shopItem
	  .getElementsByClassName("shop-item-details")[0]
	  .getElementsByClassName("input-quantity")[0].value;
	
	var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
	
	console.log(title, length, quantity, imageSrc);
	addItemToCart(title, length, quantity, imageSrc);
}


/*********************************************************************************
*	this function handles 'add item to cart' event
*********************************************************************************/
function addItemToCart(title, length, quantity, imageSrc) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartRowContent = ` <div class="item-column cart-column">
                         <img class="cart-item-image" src=${imageSrc} width="100">
                         <span class="cart-item-title">${title}</span>
                        </div>
                        <div class="cart-length cart-column input">
                        <input class="cart-input-length" type="number"  min="0" pattern="[0-9]*" inputmode="numeric" value=${length}>
                        </div>

                        <div class="cart-quantity cart-column input">
                        <input class="cart-input-quantity" type="number" min="0" pattern="[0-9]*" inputmode="numeric" value=${quantity}>
                        <button class="btn btn-danger" role="button">REMOVE</button>
                        </div>
                        </div>`;
  cartRow.innerHTML = cartRowContent;
  var cartItems = document.getElementsByClassName("cart-items")[0];
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeButtonClicked);
  cartRow
    .getElementsByClassName("cart-input-length")[0]
    .addEventListener("change", lengthChange);
  cartRow
    .getElementsByClassName("cart-input-quantity")[0]
    .addEventListener("change", quantityChange);
}


/*********************************************************************************
*	this function will be called when loading page and take items from database 
*	products or whe admin want to add new product
*********************************************************************************/
function createShopItem(type, imageSrc, price) {
  var shopItem = document.createElement("div");
  shopItem.classList.add("shop-item");
  var shopItemContent = `<span class="shop-item-title">${type} type pine wood </span>
                        <img class="shop-item-image" src=${imageSrc} alt="">
                        <div class="shop-item-details">
                        <input class="input-length" type="number" min="0" pattern="[0-9]*" inputmode="numeric"
                         placeholder="length in centimeters" style="margin-bottom: 3px;">
                        <div>
                         <input class="input-quantity" type="number" min="0" pattern="[0-9]*" inputmode="numeric"
                         placeholder="quantity">
                        </div>
                        </div>
                        <div>
                        <span>${price}$ per meter</span>
                        <button role="button" name="add" id="AddToCart" style="margin-top: 5px;"
                        class="btn btn-primary shop-item-btn">
                        <span id="AddToCart">
                         Add To Cart
                         </span>
                        </button>
                        </div>`;

  shopItem.innerHTML = shopItemContent;
  var shopItems = document.getElementsByClassName("shop-items")[0];
  shopItems.append(shopItem);
  //console.log(shopItem);
  shopItem
    .getElementsByClassName("input-length")[0]
    .addEventListener("change", lengthChange);
  shopItem
    .getElementsByClassName("input-quantity")[0]
    .addEventListener("change", quantityChange);
  shopItem
  	.getElementsByClassName("shop-item-btn")[0]
  	.addEventListener("click", addToCartClicked);
}


/*********************************************************************************
*	this function loads the 'products' from the DB
*********************************************************************************/
function loadProducts(){
		//console.log("fuck!!!");
		var date = new Date().getTime();
		var formdata = new FormData();
		formdata.append("code", "0");
		formdata.append("user", sessionStorage.getItem('username'));
		formdata.append("sender", ""); 
		formdata.append("message", "");
		formdata.append("image", "");
		formdata.append("date", date);
		//alert(formdata.get("date"));
	    $.ajax({    
        url: 'ProductServlet', 	// point to server-side
        dataType: 'text',  		// what to expect back from the server if anything
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,                         
        type: 'post',
        success: function(response){ 
        			var products = JSON.parse(response);    
        			//alert(products);  			
		            var form = document.getElementById("items");
		            var length = products.length;
		            for(var i = 0; i < length; i++){
		            	//console.log(products[i]);
		            	//console.log(products[i].image);
		            	var imgSrc = btoa(products[i].image);
		            	//var imgSrc = atob(products[i].image);
		            	//var imgData ="data:image/png;base64," + products[i].image ;
		            	var price = products[i].price;
		            	var type = products[i].type;
		            	//console.log(imgData);
		            	createShopItem(type, imgSrc, price);
		            	//createShopItem(type, imgData, price);
		            	//createShopItem(products[i].type, products[i].imgSrc, products[i].price);
		            	//console.log(products[i].price);
		            				
		            }
    			}
     	});
}

/*********************************************************************************
*	this function creates the item to be appended to 'items' section
*	@param	product: JSON string that holds the info. about that product
*********************************************************************************/
function createItem(product){
	var item;	
	return item;
}
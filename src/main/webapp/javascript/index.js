/********************** 	handles index functionality *************************
 *	 
 *
 ********************************************************************************/


/*********************************************************************************
*	this function handles loading images and products details into page
*********************************************************************************/
$(document).ready(function(){

	loadProducts();
	
// Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
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

function click(){
	
	alert();
	// get users info from form
	var name = document.getElementById("reg-name").value;
	var password = document.getElementById("reg-password").value;
	var nickname = document.getElementById("reg-nick-name").value;
	var email = document.getElementById("reg-email").value;
	var address = document.getElementById("reg-address").value;
	var requestString = 'name=' + name + ',password=' + password + ",nickname=" + nickname + ",email=" + email + ",address=" + address;
	alert("request String:" + requestString);
	
}

function change_page_to_register_test(){
	  window.location.href = "register_test.html";
	} 
	
function change_page_to_login_test(){
	  window.location.href = "login_test.html";
	} 




function loadProduct(){
	
}

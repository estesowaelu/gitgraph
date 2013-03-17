$(document).ready(function() {
    // At Startup
    $('#wait-matter').hide();


    // Function Definitions
    function ShowErrorMessage(msg) {
	$('#error-list').html('<li class="text-error">'+msg+'</li>');
    }

    function HideErrorMessage() {
	$('#error-list').hide();
    }

    function HideFormMatter() {
	$('#form-matter').fadeOut(function() {
	    $('#wait-matter').fadeIn();
	});
    }

    function ShowFormMatter() {
	$('#form-matter').show();
	$('#wait-matter').hide();
    }



    // DOM Rigging
    $('#user-field').keypress(function(e) {
	if(e.which == 13) { //enter key	
	    HideFormMatter();
	    var username = $(this).val();
	    setTimeout(function() {
		$.getJSON('assets/main.php?username='+username, function(data) {
		    // All data is processed within this function.
		    if(data['login'] == null ) {
			ShowFormMatter();
			ShowErrorMessage("Oops! Something went really wrong on our end!");
		    } else {
			HideErrorMessage();		    
		    }
		});
	    }, 100);
	}
    });
});

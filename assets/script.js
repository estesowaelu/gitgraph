$(document).ready(function() {
    // At Startup
    $('#wait-matter').hide();

    // Variables
    var currentCodeFlower;
    
    // Function Definitions
    function CreateCodeFlower(json) {
	if(currentCodeFlower) currentCodeFlower.cleanup();
	currentCodeFlower = new CodeFlower("#flower-img", 300, 600, UpdateUserGUI).update(json);
    };

    function ShowErrorMessage(msg) {
	$('#error-list').html('<li class="text-error">'+msg+'</li>');
    };

    function HideErrorMessage() {
	$('#error-list').hide();
    };

    function HideFormMatter() {
	$('#form-matter').fadeOut(function() {
	    $('#wait-matter').fadeIn();
	});
    };

    function ShowFormMatter() {
	$('#form-matter').show();
	$('#wait-matter').hide();
    };

    function HideWaitMatter() {
	$('#wait-matter').hide();
    }

    function UpdateUserGUI(user) {
        HideFormMatter();
	setTimeout(function() {
 	    $.getJSON('assets/main.php?username='+user, function(data) {
		//		$.getJSON('assets/sample1.json', function(data) {
		// All data is processed within this function.
		if(data['login'] == null ) {
		    ShowFormMatter();
		    ShowErrorMessage("Oops! Something went really wrong on our end!");
		} else {
		    HideWaitMatter();
		    HideErrorMessage();
		    console.log(JSON.stringify(data['relations']));
		    CreateCodeFlower(data['relations']);
		}
	    });
	}, 100);
	
    }

    // DOM Rigging
    $('#user-field').keypress(function(e) {
	if(e.which == 13) { //enter key
	    var username = $(this).val();
	    UpdateUserGUI(username);
	}
    });
});

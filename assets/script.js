$(document).ready(function() {
    // At Startup
    $('#front-matter').hide();

    // Variables
    var currentCodeFlower;
    
    // Function Definitions
    function CreateCodeFlower(json) {
	if(currentCodeFlower) currentCodeFlower.cleanup();
	currentCodeFlower = new CodeFlower("#flower-img", 500, 500, UpdateUserGUI).update(json);
    };

    function CreateRepoPie(json) {
	d3.select("#repo-pie-img").selectAll("svg").remove();
	var m = 10,
	r = 200,
	z = d3.scale.category20c();
 
	var svg = d3.select("#repo-pie-img").selectAll("svg")
	    .data([json])
	    .enter().append("svg:svg")
	    .attr("width", (r + m) * 2)
	    .attr("height", (r + m) * 2)
	    .append("svg:g")
	    .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
 
	svg.selectAll("path")
	    .data(d3.layout.pie().value(function(d) {return d.value;}))
	    .enter().append("svg:path")
	    .attr("d", d3.svg.arc()
		  .innerRadius(r / 2)
		  .outerRadius(r))
	    .style("fill", function(d, i) { return z(i); });
    }

    function ShowErrorMessage(msg) {
	$('#error-list').html('<li class="text-error">'+msg+'</li>');
    };

    function HideErrorMessage() {
	$('#error-list').hide();
    };

    function HideFormMatter() {
	$('#form-matter').fadeOut(function() {
	    $('#front-matter').fadeIn();
	});
    };

    function ShowFormMatter() {
	$('#form-matter').show();
	$('#front-matter').hide();
    };

    function HideFrontMatter() {
	$('#front-matter').hide();
    }

    function UpdateUserGUI(user) {
        HideFormMatter();
	setTimeout(function() {
 	    $.getJSON('assets/main.php?username='+user, function(data) {
		//		$.getJSON('assets/sample1.json', function(data) {
		// All data is processed within this function.
		if(data['login'] == null ) {
		    ShowFormMatter();
		    ShowErrorMessage("Oops! Something went wrong on our end!\nHit escape and try something else.");
		} else {
		    HideFrontMatter();
		    HideErrorMessage();
		    CreateCodeFlower(data['relations']);
		    var repo_pie_data = [];
		    for (var i=0; i<data.repos.length; i++) {
			repo_pie_data.push({'label':data.repos[i].login, 'value':data.repos[i].size});
		    }
		    CreateRepoPie(repo_pie_data);
		}
	    });
	}, 100);
	
    }

    // DOM Rigging
    $('#user-field').keydown(function(e) {
		if(e.which == 13) { //enter key
		    var username = $(this).val();
		    UpdateUserGUI(username);
		}
    });
    $(document).keydown(function(e) {
		if(e.which == 27) { //escape key
			location.reload();
		}    	
    })
});

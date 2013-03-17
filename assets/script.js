$(document).ready(function() {
    // At Startup
    $('#front-matter').hide();
    $('#graph-matter').hide();
    
    // Variables
    var currentCodeFlower;
    
    // Function Definitions
    function CreateCodeFlower(json) {
	if(currentCodeFlower) currentCodeFlower.cleanup();
	currentCodeFlower = new CodeFlower("#flower-img", 450, 570, UpdateUserGUI).update(json);
    };

    function CreatePie(selector, json, dim) {
	d3.select(selector).selectAll("svg").remove();
	var m = 10,
	r = dim,
	z = d3.scale.category20c();
 
	var svg = d3.select(selector).selectAll("svg")
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

    function CreatePieL(selector, json, dim, rad) {
	d3.select(selector).selectAll("svg").remove();
	var w = dim,
	h = dim,
	r = rad,
	color = d3.scale.category20c();
 
	var vis = d3.select(selector)
	    .append("svg:svg")
	    .data([json])
	    .attr("width", w)
	    .attr("height", h)
	    .append("svg:g")
	    .attr("transform", "translate(" + r + "," + r + ")");

        var arc = d3.svg.arc()
            .outerRadius(r);
	
	var pie = d3.layout.pie()
	    .value(function(d) {return d.value; });

	var arcs = vis.selectAll("g.slice")
	    .data(pie)
	    .enter()
	    .append("svg:g")
	    .attr("class", "slice");

        arcs.append("svg:path")
	    .attr("fill", function(d,i) {return color(i);})
	    .attr("d", arc);
	
	arcs.append("svg:text")
	    .attr("transform", function(d) {
		d.innerRadius = 1 * r / 3;
		d.outterRadius = 2 * r;
		return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d,i){return json[i].label; });
    }

    function CreateOrgPie(json) {
	d3.select("#org-pie-img").selectAll("svg").remove();
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

    function UpdateUserName(name) {
	$('#user-name').html(name);
    }

    function ShowGraphMatter(name) {
	$('#graph-matter').show();
    }

    function HideTopTag() {
	$("#top-matter p").slideUp();
    }

    function ShowTopTag() {
	$("#top-matter p").slideDown();
    }

    function UpdateUserGUI(user) {
        HideFormMatter();
	setTimeout(function() {
 	    $.getJSON('assets/main.php?username='+user, function(data) {
		//		$.getJSON('assets/sample1.json', function(data) {
		// All data is processed within this function.
		if(data['login'] == null ) {
		    UpdateUserName("");
		    ShowFormMatter();
		    ShowErrorMessage("Hey. That user doesn't exist. Hit escape and try again.");
		} else {
		    HideTopTag();
		    console.log(data);
		    ShowGraphMatter();
		    UpdateUserName(data['login']);
		    HideFrontMatter();
		    HideErrorMessage();
		    var repo_pie_data = [];
		    var lang_pie_data = [];
		    var org_pie_data = [];
		    for (var i=0; i<data.repos.length; i++) {
			repo_pie_data.push({'label':data.repos[i].name, 'value':data.repos[i].size});
		    }
	            for (key in data.languages) {
		    	lang_pie_data.push({'label':key, 'value':data.languages[key]});
	            }
		    for (var i=0; i<data.orgrepos.length; i++) {
		  	org_pie_data.push({'label':data.orgrepos[i].name, 'value':data.orgrepos[i].size});
		    }
		    CreatePieL('#repo-pie-img', repo_pie_data, 400, 180);
		    CreatePieL('#lang-pie-img', lang_pie_data, 150, 70);
		    CreatePieL('#org-pie-img', org_pie_data, 150, 70);
		    CreateCodeFlower(data['relations']);
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

(function() {

	if(typeof jQuery=='undefined') {
	    var headTag = document.getElementsByTagName("head")[0];
	    var jqTag = document.createElement('script');
	    jqTag.type = 'text/javascript';
	    jqTag.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
	    jqTag.onload = main;
	    headTag.appendChild(jqTag);
	} else {
	     main();
	}



	function stopSpinner(spinner){
		$('#leads-button').removeClass('search-button-clear');
		spinner.stop();	
	}

	function getLeads(spinner) {
		var keyword = document.getElementById("leads-keyword").value;
		var url = "http://api.trade.gov/australian_trade_leads/search.json?q=" ;
		var url = "http://api.trade.gov/trade_leads/search.json?q=";
		
		
		
		if (keyword.length > 0){
			url += keyword;
		}
		else {
			alert("No search term entered");
			document.getElementById("leads-results").innerHTML = "";
			stopSpinner(spinner);
			return;
		}
		url += "&callback=?";
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(feed){
				var results = feed.results;
				if (results.length == 0){
					list = "<p>No leads were found, please try another search term.<p>"
				}
				else {
					$('#leads-results').addClass('leads-container');
					var list = "<p class='results-title'></p>";
					for (var i=0; i<=results.length-1; i++){
						var lead = results[i];
						var lead_source = lead.lead_source;
						var id = lead.id;
						var source = lead.source;
						var last_updated = lead.last_updated;
						var country = lead.country;
						var city = lead.city;
						var title = lead.title;
						var project_number = lead.project_number;
						var industry = lead.industry;
						var project_size = lead.project_size;
						var keywords = lead.keywords;
						var agency = lead.agency;
						var contract_value = lead.contract_value;
						var description = lead.description;
						var parent_id = lead.parent_id;
						var procurement_method = lead.procurement_method;
						var publish_date = lead.publish_date;
						var tender_date = lead.tender_date;
						var funding_source = lead.funding_source;
						var borrowing_entity = lead.borrowing_entity;
						var implementing_entity = lead.implementing_entity;
						var project_pocs = lead.project_pocs;
						var comments = lead.comments;
						var submitting_officer = lead.submitting_officer;
						var submitting_officer_contact = lead.submitting_officer_contact;
						var publish_date_amended = lead.publish_date_amended;
						var status = lead.status;
						var topic = lead.topic;
						var status = lead.status;
						var url = lead.url;
						
						list += "<p class='results-legend'>" + "<strong>Lead Source: </strong>" +  lead_source + "<br>";
						list += "<p class='results-legend'>" + "<strong>ID: </strong>" +  id + "<br>";
						list += "<p class='results-legend'>" + "<strong>Source: </strong>" +  source + "<br>";
						list += "<p class='results-legend'>" + "<strong>Last Updated: </strong>" +  last_updated + "<br>";
						list += "<p class='results-legend'>" + "<strong>Country: </strong>" +  country + "<br>";
						list += "<p class='results-legend'>" + "<strong>City: </strong>" +  city + "<br>";
						list += "<p class='results-legend'>" + "<strong>Title: </strong>" +  title + "<br>";
						list += "<p class='results-legend'>" + "<strong>Project Number: </strong>" +  project_number + "<br>";
						list += "<p class='results-legend'>" + "<strong>Agency: </strong>" +  agency + "<br>";
						list += "<p class='results-legend'>" + "<strong>Industry: </strong>" +  industry + "<br>";
						list += "<p class='results-legend'>" + "<strong>Keywords: </strong>" +  keywords + "<br>";
						list += "<p class='results-legend'>" + "<strong>Project Size: </strong>" +  project_size + "<br>";
						list += "<p class='results-legend'>" + "<strong>Contract Value: $</strong>" + contract_value + " AUD" + "<br>";
						list += "<p class='results-legend'>" + "<strong>Description: </strong>" +  description + "<br>";
						list += "<p class='results-legend'>" + "<strong>Parent ID: </strong>" +  parent_id + "<br>";
						list += "<p class='results-legend'>" + "<strong>Procurement Method: </strong>" +  procurement_method + "<br>";
						list += "<p class='results-legend'>" + "<strong>Publish Date: </strong>" +  publish_date + "<br>";
						list += "<p class='results-legend'>" + "<strong>Tender Date: </strong>" +  tender_date + "<br>";
						list += "<p class='results-legend'>" + "<strong>Funding Source: </strong>" +  funding_source + "<br>";
						list += "<p class='results-legend'>" + "<strong>Borrowing Entity: </strong>" +  borrowing_entity + "<br>";
						list += "<p class='results-legend'>" + "<strong>Implementing Entity: </strong>" +  implementing_entity + "<br>";
						list += "<p class='results-legend'>" + "<strong>Project Pocs: </strong>" +  project_pocs + "<br>";
						list += "<p class='results-legend'>" + "<strong>Comments: </strong>" +  comments + "<br>";
						list += "<p class='results-legend'>" + "<strong>Submitting Officer: </strong>" +  submitting_officer;
						list += "<p class='results-legend'>" +  submitting_officer_contact + "<br>";
						list += "<p class='results-legend'>" + "<strong>Publish Date Amended: </strong>" +  publish_date_amended + "<br>";
						list += "<p class='results-legend'>" + "<strong>Status: </strong>" +  status + "<br>" ;
						list += "<p class='results-legend'>" + "<strong>Topic: </strong>" +  topic + "<br>" ;
						list += "<p class='results-legend'>" + "<strong>Status: </strong>" +  status + "<br>" ;
						list += "<a class='results-link' href=" + url + " target='_blank'>" + url + "</a></p>" + "<br>" + "<br>" ;
					}
				}
				document.getElementById("leads-results").innerHTML = list;
				stopSpinner(spinner);
			},
			error: function(error) {
				stopSpinner(spinner);
				alert("Error retriving leads, please try again");
			},
			timeout:3000
		});
	}

	function main() { 
	    $(document).ready(function($) {
				if (!$("link[href='stylesheets/trade-widgets.css']").length){
					$('<script src="javascripts/spin.js" type="text/javascript"></script>').appendTo("head");
					$('<script src="javascripts/trade-widget-vars.js" type="text/javascript"></script>').appendTo("head");
					$('<link href="stylesheets/trade-widgets.css" rel="stylesheet">').appendTo("head");
				}
				var container = "";
				container += ('<div id="leads-form" class="form-container"></div>');
				container += ('<div id="leads-results" class="leads-container"></div>');
				document.getElementById('leads-container').innerHTML = container;
				$('#leads-container').addClass('widget-container');
				var form = "";				
	      form += ('<p class="widget-title">TRADE LEADS</p>');
				form += ('<div><input class="search-input" type="text" id="leads-keyword" placeholder="" size="40" style="margin-left: 35%;">');
				form += ('<button class="search-button" id="leads-button"></button></div>');
				document.getElementById('leads-form').innerHTML = form;
				$('#leads-button').on('click', function(){
					$(this).addClass('search-button-clear');
					var spinner = new Spinner(spinnerVars).spin(this);
					getLeads(spinner);
					});
				$('#leads-keyword').keypress(function (e){
				    if(e.which == 13){
							$('#leads-button').addClass('search-button-clear');
							target = document.getElementById('leads-button');
							var spinner = new Spinner(spinnerVars).spin(target);
							getLeads(spinner);
				    }
				});
	    });
	}

})();
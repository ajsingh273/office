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
						
						 
						list += "<p class='results-legend'>" + "<table> <tr><td>Lead Source</td><td>" + lead_source + "</td></tr> <tr><td>ID</td><td>" +  id + "</td></tr> <tr><td>Source</td><td>" +  source + "</td></tr> <tr><td>Last Updated</td><td>" +  last_updated + "</td></tr> <tr><td>Country</td><td>" +  country + "</td></tr> <tr><td>City</td><td>" +  city + "</td></tr> <tr><td>Title</td><td>" +  title + "</td></tr> <tr><td>Project Number</td><td>" +  project_number + "</td></tr> <tr><td>Agency</td><td>" +  agency + "</td></tr> <tr><td>Keywords</td><td>" +  keywords + "</td></tr> <tr><td>Project Size</td><td>" +  project_size + "</td></tr> <tr><td>Contract Value</td><td>" +  contract_value + "</td></tr> <tr><td>Description</td><td>" +  description + "</td></tr> <tr><td>Parent ID</td><td>" +  parent_id + "</td></tr> <tr><td>Procurement Method</td><td>" +  procurement_method + "</td></tr> <tr><td>Publish Date</td><td>" +  publish_date + "</td></tr> <tr><td>Tender Date</td><td>" +  tender_date + "</td></tr> <tr><td>Funding Source</td><td>" +  funding_source + "</td></tr> <tr><td>Borrowing Entity</td><td>" +  borrowing_entity + "</td></tr> <tr><td>Implementing Entity</td><td>" +  implementing_entity + "</td></tr> <tr><td>Project Pocs</td><td>" +  project_pocs + "</td></tr> <tr><td>Comments</td><td>" +  comments + "</td></tr> <tr><td>Submitting Officer</td><td>" +  submitting_officer +  submitting_officer_contact + "</td></tr> <tr><td>Publish Date Amended</td><td>" +  publish_date_amended + "</td></tr> <tr><td>Status</td><td>" +  status + "</td></tr> <tr><td>Topic</td><td>" +  topic + "</td></tr> <tr><td>URL</td><td>" +  url + "</td></tr>  </table> </br></br></br></br>"
						
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
	      form += ('<p class="widget-title">Search Trade Leads from Around the World</p>');
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
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
		var url = "http://api.trade.gov/australian_trade_leads/search.json?q=";
		
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
						var agency = lead.agency;
						var contract_value = lead.contract_value;
						var description = lead.description;
						var topic = lead.topic;
						var url = lead.url;
						list += "<p class='results-legend'>" + "<strong>Agency:</strong>" + "</br>" + agency + "<br>";
						list += "<p class='results-legend'>" + "<strong>Topic:</strong>" + "</br>" + topic + "<br>";
						list += "<p class='results-legend'>" + "<strong>Contract Value:</strong>" + "</br>" + contract_value + "<br>";
						list += "<p class='results-legend'>" + "<strong>Description:</strong>" + "</br>" + description + "<br>";
						list += "<a class='results-link' href=" + url + " target='_blank'>" + url + "</a></p>" + "<br>";
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
				if (!$("link[href='stylesheets/']").length){
					$('<script src="javascripts/spin.js" type="text/javascript"></script>').appendTo("head");
					$('<script src="javascripts/trade-widget-vars.js" type="text/javascript"></script>').appendTo("head");
					$('<link href="stylesheets/" rel="stylesheet">').appendTo("head");
				}
				var container = "";
				container += ('<div id="leads-form" class="form-container"></div>');
				container += ('<div id="leads-results" class="leads-container"></div>');
				document.getElementById('leads-container').innerHTML = container;
				$('#leads-container').addClass('widget-container');
				var form = "";				
	      form += ('<p class="widget-title">Trade Leads</p>');
				form += ('<div><input class="search-input" type="text" id="leads-keyword" placeholder="search Trade Leads" size="50">');
				form += ('<button class="search-button" id="leads-button"> Search</button></div>');
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
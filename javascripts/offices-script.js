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
		$('#offices-state-button').removeClass('search-button-clear');
		$('#offices-country-button').removeClass('search-button-clear');
		spinner.stop();	
	}

	function getStateOffices(spinner){
		var officesStateIndex = $('#offices-state-select').val();
		if (officesStateIndex == 0){
			alert("No selection has been chosen");
			document.getElementById("offices-results").innerHTML = "";
			stopSpinner(spinner);
			return;
		}
		else{
			var searchParam = "state=" + stateList[officesStateIndex][1];
			getOffices(searchParam, spinner);
		}
	}

	function getCountryOffices(spinner){
		var officesCountryIndex = $('#offices-country-select').val();
		if (officesCountryIndex == 0){
			alert("No selection has been chosen");
			document.getElementById("offices-results").innerHTML = "";
			stopSpinner(spinner);
			return;
		}
		else{
			var searchParam = "country=" + countryList[officesCountryIndex][1];
			getOffices(searchParam, spinner);
		}
	}


	function getOffices(searchParam, spinner) {
		var url = "http://api.trade.gov/ita_office_locations/search?"+ searchParam + "&callback=?";
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(feed){
				var results = feed.results;
				if (results.length == 0){
					list = "<p>No offices were found, please try another selection.<p>"
				}
				else {
					var list = "<p class='results-title'>List of Offices</p>";
					for (var i=0; i<=results.length-1; i++){
						$('#offices-results').addClass('results-container');
						var office = results[i];
						var name = office.office_name;
						var phone = office.phone;
						list += "<p class='results-legend'>" + name + " - " + phone +"</p>";
					}
				}
				document.getElementById("offices-results").innerHTML = list;
				stopSpinner(spinner);
			},
			error: function(error) {
				stopSpinner(spinner);
				alert("Error retriving events, please try again");
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
			container += ('<div id="offices-form" class="form-container"></div>');
			container += ('<div id="offices-results" class="results-container"></div>');
			document.getElementById('offices-container').innerHTML = container;
			$('#offices-container').addClass('widget-container');
			var form = "";				
	    form += ('<p class="widget-title">Offices & Centers</p>');		
			form += ('<p><div class="select-input"><select id="offices-state-select" class="search-input"></select>');
			form += ('<button class="search-button" id="offices-state-button"></button></div></p>');
			form += ('<div class="select-input"><select id="offices-country-select" class="search-input"></select>');
			form += ('<button class="search-button" id="offices-country-button"></button></div>');
			document.getElementById('offices-form').innerHTML = form;

			$('#offices-state-button').on('click', function(){
				$(this).addClass('search-button-clear');
				var spinner = new Spinner(spinnerVars).spin(this);
				getStateOffices(spinner);
			});
			$('#offices-country-button').on('click', function(){
				$(this).addClass('search-button-clear');
				var spinner = new Spinner(spinnerVars).spin(this);
				getCountryOffices(spinner);
				});

			//populate dropdown lists
			$.each(stateList, function(val, array) {
	      $('#offices-state-select').append( $('<option></option>').val(val).html(array[0]));
	     });
			$.each(countryList, function(val, array) {
	      $('#offices-country-select').append( $('<option></option>').val(val).html(array[0]));
	     });

	   });
	}

})();
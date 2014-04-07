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

	var industry = "";
	var country = "";

	function showCalendar(eventsArray){
		if (!eventsArray){
			$('#trade-events-calendar-message').html('<p>There are no events in this calendar.</p>')
			eventsArray = [];
		}
		else
			$('#trade-events-calendar-message').html('<p>There are ' + eventsArray.length + ' events in this calendar.</p>')
		document.getElementById("trade-events-calendar").innerHTML = "";
		$('#trade-events-calendar').fullCalendar({
			contentHeight: 400,
			weekMode:'fixed',
			events:eventsArray
		});
	}

	function stopSpinner(spinner){
		$('#country-trade-events-calendar-button').removeClass('search-button-clear');
		$('#industry-trade-events-calendar-button').removeClass('search-button-clear');
		spinner.stop();	
	}

	function getTradeEvents(spinner){
		var countryIndex = $('#trade-events-calendar-country').val();
		var industryIndex = $('#trade-events-calendar-industry').val();
		if (countryIndex == 0 && industryIndex == 0){
			alert("No selection has been chosen");
			showCalendar();
			stopSpinner(spinner);
			return;
		}
		else{
			if (industryIndex > 0){
				industry = industryList[industryIndex];
			}
			if (countryIndex > 0){
				country = countryList[countryIndex][1]
			}
			var searchParams = "countries=" + country + "&industry=" + industry;
		}

		var url = "http://api.trade.gov/trade_events/search?" + searchParams + "&callback=?";

		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(feed){
				var results = feed.results;
				if (results.length == 0){
					list = "<p>No events were found, please try another selection.<p>"
					showCalendar();
					stopSpinner(spinner);
					return;
				}
				else {

					var eventsArray = [];
					for (var i=0; i<=results.length-1; i++){
						var event = results[i];
						var name = event.event_name;
						var startDate = event.start_date;
						var endDate = event.end_date;
						var url = event.url;
						var eventObject={title:name, start:startDate, end:endDate, url:url};
						eventsArray.push(eventObject);
					}
					showCalendar(eventsArray);
					stopSpinner(spinner);
				}
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
				$('<script type="text/javascript" src="fullcalendar.js"></script>').appendTo("head");
				$('<link href="stylesheets/fullcalendar.css" rel="stylesheet">').appendTo("head");
				if (!$("link[href='stylesheets/trade-widgets.css']").length){
					$('<script src="javascripts/spin.js" type="text/javascript"></script>').appendTo("head");
					$('<script src="javascripts/trade-widget-vars.js" type="text/javascript"></script>').appendTo("head");
					$('<link href="stylesheets/trade-widgets.css" rel="stylesheet">').appendTo("head");
				}
				var container = "";
				container += ('<div id="trade-events-calendar-form" class="form-container"></div>');
				container += ('<div id="trade-events-calendar-message"></div>');
				container += ('<div id="trade-events-calendar"></div>');			
				document.getElementById('trade-events-calendar-container').innerHTML = container;
				$('#trade-events-calendar-container').addClass('widget-container');
				var form = "";				
	      form += ('<p class="widget-title">Trade Events Calendar</p>');
				form += ('<p><div class="select-input"><select class="search-input" id="trade-events-calendar-industry"></select>');
				form += ('<button class="search-button" id="industry-trade-events-calendar-button"></button></div></p>');
				form += ('<div class="select-input"><select class="search-input" id="trade-events-calendar-country"></select>');
				form += ('<button class="search-button" id="country-trade-events-calendar-button"></button></div>');
				document.getElementById('trade-events-calendar-form').innerHTML = form;
				$('#industry-trade-events-calendar-button').on('click', function(event){
					//var y = window.pageYOffset;
					$(this).addClass('search-button-clear');
					var spinner = new Spinner(spinnerVars).spin(this);
					getTradeEvents(spinner)
					//window.scrollTo(0, y)
				});
				$('#country-trade-events-calendar-button').on('click', function(event){
					//event.preventDefault();
					$(this).addClass('search-button-clear');
					var spinner = new Spinner(spinnerVars).spin(this);
					getTradeEvents(spinner);
					//return false;
				});


				//populate dropdown lists
				$.each(industryList, function(val, text) {
		      $('#trade-events-calendar-industry').append( $('<option></option>').val(val).html(text));
		     });
				$.each(countryList, function(val, array) {
		      $('#trade-events-calendar-country').append( $('<option></option>').val(val).html(array[0]));
		     });

				$('#trade-events-calendar').addClass('results-container');
				showCalendar();

	    });
	}

})();
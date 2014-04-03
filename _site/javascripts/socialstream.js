var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-28420521-1']);
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageview']);

(function () {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

(function ($) {
	$.fn.extend({
		SocialWidget: function (options) {

			var defaults = {
				SocialStreams: {},
				selector: '#SocialStream',
				//serverURL: '',
				//serverURL: 'http://localhost/Q4SocialStream/Default/',
				serverURL:'http://q4socialstream.q4web.com/SocialBuilder/',
				//serverURL:'http://q4green.q4admin.local/Q4SocialStream/Default/',
				theme: {
					//name: 'icontemplate',
					//name: 'tabsplane',
					//name:"planeboard",
					name:"SocialLight",
					//name:'tabshorizontal',
					shell: {
						background: '#ffffff',
						color: '#000000',
						links: '#333333',
						height:'370'
					},
					tweets: {
						background: 'none',
						color: '#333',
						links: '#333'
					}
				},
				widgetTitle: 'Social Stream',
				rpp:20,
				pageNumber:0,
				timeout:null,
				clientHrefLogo: 'http://q4websystems.com',
				after: null
				//readyLoad: loadCallback
			};

			var streamsArr = options;
			var options = $.extend(true, defaults, options);


			/*#################
			* Start the pugin
			################ */

			var o = options;
			var $thisObj = $(this);

			$thisObj.removeAttr('class').addClass(o.theme.name);

			var cssHref;

			switch (o.theme.name) {
			case 'planeboard':
				cssHref = "PlaneBoard/css/styles.css";
				break;
			case 'SocialLight':
				cssHref = "SocialLight/css/styles.css";
				break;
              case 'tabshorizontal':
				cssHref = "TabTemplateHoriz/css/styles.css";
				break;
			case 'tabsplane':
				cssHref = "TabsPlane/css/styles.css";
				break;
			case 'icontemplate':
				cssHref = "IconTemplate/css/styles.css";
				break;
			default:
			}

			/*##################
			* Css/Js external files
			/*#################*/

			$thisObj.append('<div id="Q4Styles" />');

			var cssObjectList = ['js/colorbox/colorbox.css', 'js/scroll/jquery.jscrollpane.codrops2.css' ];
			var jsObjectList = ['js/colorbox/jquery.colorbox-min.js', 'js/scroll/jquery.mousewheel.js', 'js/scroll/jquery.jscrollpane.min.js', 'js/scroll/scroll-startstop.events.jquery.js'];

			// include generic css files

			var css_main = $("<link>", {
				rel: "stylesheet",
				type: "text/css",
				href: o.serverURL + cssHref
			});
			css_main.appendTo($thisObj.find('#Q4Styles'));

			for(var i=0;i<cssObjectList.length; i++){
				var css_link = $("<link>", {
					rel: "stylesheet",
					type: "text/css",
					href: o.serverURL + cssObjectList[i]
				});
				css_link.appendTo($thisObj.find('#Q4Styles'));
			}

			var style_g = '<style type="text/css">';
			style_g += '#SocialStream{ background-color:' + o.theme.shell.background + ';color:' + o.theme.shell.color + ';} #SocialStream a{color:' + o.theme.shell.links + ';}';
			style_g += '#SocialStream .dataContainerInner { background-color:' + o.theme.tweets.background + ';color:' + o.theme.tweets.color + ';height:'+o.theme.shell.height+'px;} #SocialStream .dataContainerInner a{color:' + o.theme.tweets.links + ';}';
			style_g += '</style>';
			$(style_g).appendTo($thisObj.find('#Q4Styles'));

			// include generic js files

			for(var i=0;i<jsObjectList.length; i++){
				var script_file = document.createElement("script");
				script_file.type = "text/javascript";
				script_file.src = o.serverURL + jsObjectList[i];
				$thisObj.find('#Q4Styles').append(script_file);
			}

			var SocialObject ={
				SocialChanels:{
					blog:{
						callback:function blog(myUrl) {
							this.myUrl = myUrl;
							if (myUrl !== undefined && myUrl !== "Twitter") {
								var thisFeed = SocialObject.blogParse(myUrl);
								return $.getJSON(thisFeed, function (rss_data) {
									if (rss_data.responseStatus == 200) {} else {
									var msg = rss_data.responseDetails;
								}
							});
						}
					},

					parser:function(obj , data){
							parseBlog(obj, data);
					}
				},

				slideshare:{
					callback:function(myUrl, tag) {
						this.myUrl = myUrl;
						this.tag = tag;
						var tagname  = (tag === undefined) ? "" : '/tag/'+tag;

						if (myUrl !== undefined) {
							var thisFeed = SocialObject.blogParse('http://www.slideshare.net/rss/user/' + myUrl+tagname);
							return $.getJSON(thisFeed, function (slideshare_data) {
								if (slideshare_data.responseStatus == 200) {} else {
									var msg = slideshare_data.responseDetails;
								}
							});
						}
					},

					parser:function(obj, dataObj){
						parseSlideshare(obj, dataObj);
					}
				},
				twitter:{
					callback:function(myUrl) {
						this.myUrl = myUrl;
						if (myUrl !== undefined) {
							// var thisFeed = SocialObject.blogParse('http://www.twitter-rss.com/user_timeline.php?screen_name='+myUrl);
							return $.getJSON('http://q4socialstream.herokuapp.com/twitter/'+ myUrl, function (data) {
								if (data.responseStatus == 200) {} else {
									var msg = data.responseDetails;
								}
							});
						}
					},
					parser:function(obj , data){
						parseTwitter(obj, data);
					}
				},
				facebook:{
					callback:function(myUrl) {
						this.myUrl = myUrl;

						if (myUrl !== undefined) {
							var thisFeed = SocialObject.blogParse('https://www.facebook.com/feeds/page.php?id='+myUrl+'&format=atom10');
							return $.getJSON(thisFeed, function (facebook_data) {
								if (facebook_data.responseStatus == 200) {} else {
									var msg = facebook_data.responseDetails;
								}
							});
						}
					},
					parser:function(obj , data){
						parseFacebook(obj, data);
					}
				},
				youtube:{
					callback:function(myUrl, tag) {
						this.myUrl = myUrl;
						this.tag = tag;
						var tagname  = (tag === undefined) ? "" : '/-/'+tag+'';
						var Startindex = o.pageNumber>1?'&start-index='+o.pageNumber+o.rpp:'';
						var href = 'http://gdata.youtube.com/feeds/users/' + myUrl + '/uploads'+tagname+'?alt=json-in-script&callback=?&max-results='+o.rpp+Startindex;

						if (myUrl !== undefined) {
							return $.ajax({
								type: "GET",
								url: href,
								dataType: "jsonp",
								success: function (youtube_data) {},
								error:function(status){
									console.log(status);
								}
							});
						}
					},
					parser:function(obj, data){
						parseYoutube(obj, data);
					}
				},
				stocktwits:{
					callback:function(myUrl) {
						this.myUrl = myUrl;
						if (myUrl !== undefined) {
							return $.ajax({
								type: "GET",
								url: 'http://api.stocktwits.com/api/streams/user/' + myUrl + '.json?limit='+o.rpp,
								dataType: "jsonp",
								success: function (stocktwits_data) {}
							});
						}
					},
					parser:function(obj, data){
						parseStockTwits(obj, data);
					}
				}
			},

			blogParse:function(url){
				this.url = url;
				var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(url);
				api += "&num="+o.rpp;
				api += "&output=json_xml";
				return api;
			},
			formatTwitString:function(str){
				str = ' ' + str;
				str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm, '<a href="$1" target="_blank">$1</a>');
				str = str.replace(/([^\w])\@([\w\-]+)/gm, '$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
				str = str.replace(/([^\w])\#([\w\-]+)/gm, '$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
				return str;
			},
			getSocialList:function(chanels){
				var $obj  = this;
				this.chanels = chanels;
				var chn = [];

				$.each(chanels, function (i, data) {
					var label = data.label.toLowerCase();
					chn.push(SocialObject.SocialChanels[label].callback(data.url, data.tag));
				});

				$(o.selector).find('.dataContainer').html('<span class="LoadingImage" />');
				$obj.SocialContentObj =[];

				$.when.apply($, chn).done(function() {
					var args  = arguments;
					var length =0;
					var count = 0;

					for (var i in chanels) {
						if (chanels.hasOwnProperty(i)) {
							count++;
						}
					}

					for(i in chanels) {
						var label  = i;
						if(count >1) {
							$obj["SocialChanels"][label].parser($obj, args[length][0]);
						}
						else{
							$obj["SocialChanels"][label].parser($obj, args[length]);
						}
						if (chanels.hasOwnProperty(i)) {
							length++;
						}
					}

					function custom_sort(a, b) {
						return b.dateField.getTime() - a.dateField.getTime();
					}

					$obj.SocialContentObj.sort(custom_sort);

					$.each($obj.SocialContentObj, function (i, data) {
						var content = data.content;
						$thisObj.find('.dataContainer').append(content);
					});

					$thisObj.find('.dataContainer').wrapInner('<div class="dataContainerInner" />').find('.LoadingImage').hide();

					if (typeof $obj.StreamLoad == "function") {
						$obj.StreamLoad.call($obj);
					}

					if (typeof o.after == "function") {
                      o.after.call(this, $obj, o);
					}

					if(o.theme.name=="planeboard"){
						$obj.MasonryFunction();
					}

				});
			},

			SocialContentObj:[],
			CreateTabs:tabCallback,
			StreamLoad:loadStream,

			ScrollFunction:function(){
				var $el = $thisObj.find('.dataContainerInner').jScrollPane({
					verticalGutter: -16
				});
			},

			MasonryFunction:function(){
				$thisObj.find('img').load(function(){
					$thisObj.find('.dataContainerInner').isotope({
						itemSelector: '.SocialItem'
					});
				});
			}
		};

		SocialObject.CreateTabs(o.SocialStreams);
		SocialObject.getSocialList(o.SocialStreams);

		if(o.timeout !== null && typeof(o.timeout) =="number"){
			setInterval(function(){SocialObject.getSocialList(SocialObject.chanels);}, o.timeout);
		}

		/*##############################
		Parsiung Social Data
		##############################*/

		function parseStockTwits(obj, dataObj){

			var parseDateStock = function (str) {
				var v = str.split("-");
				var month = parseInt(v[2].substr(0, 2), 10);
				return new Date(Date.parse((parseInt(v[1], 10) + "/" + month + "/" + parseInt(v[0], 10) + " " + parseInt(v[2].substr(3, 2), 10) + ":" + parseInt(v[2].substr(6, 2), 10) + ":" + parseInt(v[2].substr(9, 2), 10) + " UTC")));
			};

			$.each(dataObj.messages, function (i, data) {
				var id = data.message.id;
				var date = parseDateStock(data.message.created_at);
				var title = SocialObject.formatTwitString(data.message.body);

				var content = '<div class="StockTwits SocialItem">';
				content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
				content += '<span class="ItemTitle">' + title + '</span>';
				content += '<span class="expandIcon"></span>';
				content += '<div class="TwitterLinks">';
				content += '<span class="ItemDate">' + $.timeago(date) + ' </span><span class="MidDot first"> &middot;</span> ';
				content += '<a href="https://stocktwits.com/addon/button/share?reshare=' + id + '" class="stq-share" target="_blank">share</a><span class="MidDot"> &middot; </span>';
				content += '<a href="https://stocktwits.com/addon/button/share?reply=' + id + '" class="stq-reply" target="_blank">reply</a><span class="MidDot"> &middot; </span>';
				content += '<a href="https://stocktwits.com/addon/button/share?like=' + id + '" class="stq-like" target="_blank">like</a>';
				content += '</div>';
				content += '</div></div>';

				var dateItem = {
					"label": "StockTwits",
					"dateField": date,
					"content": content
				};
				obj.SocialContentObj.push(dateItem);
			});
		}

		function parseTwitter(obj, dataObj){
			$.each(dataObj, function (i, data) {

              var id = data.id_str;
			  var id_str = data.created_at.split(' +')
			  id_str[1] = id_str[1].split(' ').pop();
			  id_str = id_str[0] + ' ' + id_str[1];
              var date = new Date(id_str);
              var title = obj.formatTwitString(data.text);
              var screen_name = data.user.screen_name
              var user_name = data.user.name
              var content = '<div class="Twitter SocialItem">';
              content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
              content += '<span class="ItemTitle"><div class="ScreenName"><a href="http://twitter.com/#!/' + screen_name + '" target="_blank">' + screen_name + ' </a><span> ' + user_name + '</span></div>' + title + '</span>';
              content += '<span class="expandIcon"></span>';
              content += '<div class="TwitterLinks">';
              content += '<span class="ItemDate">' + $.timeago(date) + ' </span>	&middot; ';
              content += '<a href="http://twitter.com/intent/tweet?in_reply_to=' + id + '" class="twtr-reply" target="_blank">reply</a> &middot; ';
              content += '<a href="http://twitter.com/intent/retweet?tweet_id=' + id + '" class="twtr-rt" target="_blank">retweet</a> &middot; ';
              content += '<a href="http://twitter.com/intent/favorite?tweet_id=' + id + '" class="twtr-fav" target="_blank">favorite</a>';
              content += '</div>';
              content += '<div class="via">via ' + data.source + '</div>';
              content += '</div></div>';

              var dateItem = {
                  "label": "Twitter",
                  "dateField": date,
                  "content": content
              };
              obj.SocialContentObj.push(dateItem);

          });
		}

		function parseFacebook(obj, dataObj){
			$.each(dataObj.responseData.feed.entries, function (i, data) {
				var date = new Date(data.publishedDate),
				author = data.author;
				title = data.title,
				url = data.link,
				description = data.content;
				var content = '<div class="Facebook SocialItem">';
				content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
				content += '<span class="ItemTitle">' + description + '</span>';
				content += '<span class="ItemDate">' + $.timeago(date) + '</span>';
				content += '</div>';
				content += '</div>';

				var dateItem = {
					"label": "Facebook",
					"dateField": date,
					"content": content
				};
				obj.SocialContentObj.push(dateItem);
			});
		}

		function parseYoutube (obj, dataObj) {

			if(dataObj.feed.entry !==undefined) {
				$.each(dataObj.feed.entry, function (i, data) {
					function parseDate(str) {
						var v = str.split("-");
						var month = parseInt(v[1].substr(0, 2), 10);
						return new Date(Date.parse((parseInt(v[1], 10) + "/" + month + "/" + parseInt(v[0], 10) + " " + parseInt(v[2].substr(3, 2), 10) + ":" + parseInt(v[2].substr(6, 2), 10) + ":" + parseInt(v[2].substr(9, 2), 10) + " UTC")));
					}

					var date = parseDate(data.published['$t']);
					var title = data.title["$t"];
					var id = data.id["$t"].split('http://gdata.youtube.com/feeds/videos/').pop();
					var url = data.link[0].href;
					var description = '<div class="ImageThumb"><a href="http://www.youtube.com/embed/' + id + '"><img src="http://img.youtube.com/vi/' + id + '/default.jpg" alt="Tumb" /></a></div>';
					description += '<div class="YoutubeContent">' + data["media$group"]["media$description"]["$t"] + '</div>';

					var content = '<div class="Youtube SocialItem">';
					content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
					content += '<a href="http://www.youtube.com/embed/' + id + '" class="ItemLink" target="_blank" id="' + id + '">';
					content += '<span class="ItemTitle">' + title + '</span></a>';
					content += '<span class="ItemDate">' + $.timeago(date) + '</span>';
					content += '<span class="expandIcon"></span>';
					content += '</div>';
					content += '<div class="ItemContent">' + description + '</div>';
					content += '</div>';

					var dateItem = {
						"label": "Youtube",
						"dateField": date,
						"content": content
					};

					obj.SocialContentObj.push(dateItem);
				});
			}
		}

		function parseBlog(obj, dataObj) {

			$.each(dataObj.responseData.feed.entries, function (i, data) {
				var date = new Date(data.publishedDate);
				var title = data.title;
				var url = data.link;
				var description = data.contentSnippet;
				var madiaThumb = $("img", data.content).length?'<img src="'+$("img:first", data.content).attr('src')+'" alt="RssThumb" />':'';
				description += ' <a href="' + url + '" class="readMore" target="_blank">Read More ></a>';

				var content = '<div class="Blog SocialItem">';
				content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
				content += '<a href="' + url + '" class="ItemLink" target="_blank">';
				content += '<span class="ItemTitle">' + title + '</span></a>';
				content += '<span class="ItemDate">' + $.timeago(date) + '</span>';
				content += '<span class="expandIcon"></span>';
				content += '</div>';
				content += '<div class="ItemContent">' + madiaThumb+  description + '</div>';
				content += '</div>';

				var dateItem = {
					"label": "RSS",
					"dateField": date,
					"content": content
				};
				obj.SocialContentObj.push(dateItem);
			});
		}

		function parseSlideshare(obj, dataObj) {
			$.each(dataObj.responseData.feed.entries, function (i, data) {
				var date = new Date(data.publishedDate);
				var title = data.title;
				var url = data.link;
				var description = '<div class="ImageThumb"><a href="' + url + '"><img src="' + data.mediaGroups[0].contents[0].thumbnails[0].url + '" alt="thumb" /></a></div>';
				description += '<div class="SlideshareContent">' + data.contentSnippet + '</div><a href="' + url + '" class="readMore" target="_blank">Read More></a>';
				var content = '<div class="Slideshare SocialItem">';
				content += '<div class="ItemHeader"><span class="SocialIcon"></span>';
				content += '<a href="' + url + '" class="ItemLink" target="_blank">';
				content += '<span class="ItemTitle">' + title + '</span></a>';
				content += '<span class="ItemDate">' + $.timeago(date) + '</span>';
				content += '<span class="expandIcon"></span>';
				content += '</div>';
				content += '<div class="ItemContent">' + description + '</div>';
				content += '</div>';

				var dateItem = {
					"label": "slideshare",
					"dateField": date,
					"content": content
				};
				obj.SocialContentObj.push(dateItem);
			});
		}

		/*######################
		* Stream Load Events
		######################*/

		if(o.theme.name=="planeboard"){
			$('.tabHeader li a').click(function (event) {
				event.preventDefault();
				var title = $(this).text()!=="All"?$(this).attr('title'):'SocialItem';
				$thisObj.find('.dataContainerInner').isotope({filter: '.'+title});
			});
		}
		else{
			$('.tabHeader li a').click(function (event) {
				event.preventDefault();
				var $this = $(this);
				$this.addClass('active').parent().siblings().find('a').removeClass('active');
				var title = (typeof $this.attr('title') !== 'undefined' && $this.attr('title') !== false) ? $this.attr('title').toLowerCase() : '';
				_gaq.push(['_trackEvent', location.host, 'Click', title]);

				$(".dataContainer").removeClass(function (i, val) {
					var itemClass = val.split(' ');
					for (var i = 0; i < itemClass.length; i++) {
						if (itemClass[i].indexOf('_SocialItem') != -1) {
							return itemClass[i];
						}
					}
					return false;

				}).addClass($this.find('span').text() + '_SocialItem');

				if (!title.length) {
					SocialObject.getSocialList(o.SocialStreams);
				}
				else {
					var chanelObject  = {};
					chanelObject[title] = o.SocialStreams[title];
					SocialObject.getSocialList(chanelObject);
				}
			});
		}

		/*##########################
		 *  Tab callback function
		 * ########################*/

		function tabCallback(streams){
			this.streams = streams;
			var $obj = this;

			/*#######	Building Tabs ########*/

			var tabList = ['<li class="All"><a href="#" class="active"><span>All</span></a></li>'];

				$.each(streams, function (i, val) {
					var url = val.url;
					var name = val.label;
					var cotnent = '<li class="' + name + '">';
					cotnent += '<a href="' + url + '" title="' + name + '"><span>' + name + '</span></a>';
					cotnent += '</li>';
					tabList.push(cotnent);
				});

				$thisObj.append('<div class="dataContainer" style="height:'+o.theme.shell.height+'px;"></div><span class="Q4Footer"><a href="http://q4websystems.com" target="_blank"></a></span>');

				$('<ul />', {
					"class": "tabHeader",
					html: tabList.join('')
				}).prependTo($thisObj).wrap('<div class="HeaderContainer" />').before('<div class="WidgetTitle"><a href="'+o.clientHrefLogo+'" target="_blank" class="ClientLogo"></a><h1>' + o.widgetTitle + '</h1></div><a href="" target="_blank" class=""></a>');

				$(".Q4Footer").bind('click', function (event) {
					event.preventDefault();
					_gaq.push(['_trackEvent', location.host, 'Click', 'Powered by Q4 Web Systems']);
				});

				/*Icon template circle*/

				if (o.theme.name == 'icontemplate') {
					$.ajax({
							type: "GET",
							url: o.serverURL + 'IconTemplate/js/socialBlocks.js',
							success: function(){
								$thisObj.find('ul.tabHeader').wrap('<div class="SocialBlocks">').parent().mobilyblocks({widthMultiplier : 1.3}).find('.trigger').trigger('click');
							},
							dataType: "script",
							cache: true
					});
				}

				/*########Tabs events########*/

				switch (o.theme.name) {
					case 'planeboard':
				break;
					case 'SocialLight':
				break;
					case 'tabshorizontal':
					tabHorizontal();
				break;
					case 'tabsplane':
					tabVertical();
				break;
					case 'icontemplate':
					break;
				default:
					tabHorizontal();
				}

				function tabVertical() {
					$thisObj.find('.tabHeader li a').hover(function (event) {
						$(this).stop(true, true).animate({
							'top': '-20px',
							'height': '75px'
						}, 300);
					}, function () {
							$(this).stop(true, true).animate({
								'top': '0px',
								'height': '55px'
							}, 500);
					});

					$thisObj.find('.WidgetTitle h1').click(function (event) {
						$thisObj.find('.tabHeader li.All a').trigger('click');
					});
				}

				function tabHorizontal() {
					$thisObj.find(".HeaderContainer").append('<a class="ToggleIcon" href="#"><span>Choos stream</span></a>').find('a.ToggleIcon').click(function (event) {
					event.preventDefault();
					$(this).animate({
						'right': '0',
						'opacity': '0'
					}, 200).parent().find('.tabHeader').delay('200').animate({
						'width': '50px',
						'opacity': 1,
						right: '-63px'
					}, 400, function () {});
					event.stopPropagation();
					});

					$thisObj.find(".HeaderContainer ul.tabHeader").css({
						'opacity': 0
					}).find('li a').click(function () {
						$thisObj.find(".HeaderContainer .ToggleIcon").removeAttr('class').addClass('ToggleIcon ' + $(this).attr('title'));
					});

					$('html').click(function (event) {
						$thisObj.find('.tabshorizontal .HeaderContainer ul').animate({
							'width': '0px',
							'opacity': 0,
							right: '0'
						}, 200, function () {
							$(this).parent().find('a.ToggleIcon').animate({
								right: '-61px',
								opacity: 1
							}, 200);
						});
					});
				}
			}

			/*####################################
			 * Load Stream Callback
			* ###################################*/

			function loadStream(){
				var $obj  = this;

				if(o.theme.name !=="planeboard"){
				// Tobble accordion
					$thisObj.find(".dataContainer:not(.Youtube_SocialItem, .Slideshare_SocialItem) .SocialItem:not(.Twitter,.StockTwits,.Facebook) .ItemHeader").click(function (event) {
						event.preventDefault();
						var $this = $(this);
						$this.parent().addClass('expanded').find('.ItemContent').slideToggle().end().siblings().removeClass('expanded').find('.ItemContent').slideUp();
					});
					//include Scroll panel
					SocialObject.ScrollFunction();
				}
				//Twitter reply 
				/*$thisObj.find(".dataContainerInner .Twitter.SocialItem .TwitterLinks a").click(function () {
					window.open($(this).attr('href'), '', 'width=600,height=500');
				});*/
				//Lightbox Script
				$thisObj.find('.Youtube.SocialItem .ImageThumb a, .Youtube_SocialItem .Youtube.SocialItem a.ItemLink ').click(function (event) {
					event.preventDefault();
					var hrefUrl = $(this).attr('href');
					$.colorbox({
						iframe: true,
						width: "853px",
						height: "480px",
						href: hrefUrl
					});
				});
				// Slideshare Lightbox
				$thisObj.find('.Slideshare.SocialItem .ImageThumb a, .Slideshare_SocialItem a.ItemLink').click(function (event) {
					event.preventDefault();
					var href = $(this).attr('href');
					$.getJSON('http://www.slideshare.net/api/oembed/2?url=' + href + '&format=jsonp&callback=?', function (data) {
						$.colorbox({
							iframe: true,
							width: "853px",
							height: "480px",
							href: 'http://www.slideshare.net/slideshow/embed_code/' + data.slideshow_id
						});
					});
				});
				//Include Analytics	
				$(".twtr-reply").bind('click', function (event) {
					event.preventDefault();
					_gaq.push(['_trackEvent', location.host, 'Click', 'Twitter Reply']);
				});

				$(".twtr-rt").bind('click', function (event) {
					event.preventDefault();
					_gaq.push(['_trackEvent', location.host, 'Click', 'Twitter Retweet']);
				});

				$(".twtr-fav").bind('click', function (event) {
					event.preventDefault();
					_gaq.push(['_trackEvent', location.host, 'Click', 'Twitter Favorite']);
				});
				//Stock Twits reply
				var stocktwits_links = $thisObj.find('.dataContainer a[href*="stocktwits.com/addon/button/"]');

				stocktwits_links.each(function() {
					$(this).click(function() {
						var link = $(this).attr("href");
						var st_share = link.match(/share\?(\S+)/)[1].split("=");

						$(this).attr("href", "javascript:void(0)");

						var param = st_share[0];
						var message_id = st_share[1];
						var share_url = "http://stocktwits.com/widgets/share?" + param + "=" + message_id;

						var left = (window.screen.width/2) - 250;
						var top = (window.screen.height/2) - 250;
						window.open(share_url,"_blank","height=500,width=500,modal=yes,alwaysRaised=yes,resizable=no,scrollbars=no,toolbar=no,location=no,status=no,menubar=no,left=" + left + ",top=" + top);       
						$(this).attr("href", link);

						return false;
				});
			});
		}
		// Callback on ready load	
	}
});

/*########################
 * Time Go Method 
 * #######################*/

$.timeago = function (timestamp) {
	if (timestamp instanceof Date) {
		return inWords(timestamp);
	}
	else if (typeof timestamp === "string") {
		return inWords($.timeago.parse(timestamp));
	}
	else {
		return inWords($.timeago.datetime(timestamp));
	}
};
var $t = $.timeago;

$.extend($.timeago, {
	settings: {
		refreshMillis: 60000,
		allowFuture: false,
		strings: {
		prefixAgo: null,
		prefixFromNow: null,
		suffixAgo: "ago",
		suffixFromNow: "from now",
		seconds: "less than a minute",
		minute: "about a minute",
		minutes: "%d minutes",
		hour: "about an hour",
		hours: "about %d hours",
		day: "a day",
		days: "%d days",
		month: "about a month",
		months: "%d months",
		year: "about a year",
		years: "%d years",
		numbers: []
	}
},
  inWords: function (distanceMillis) {
	var $l = this.settings.strings;
	var prefix = $l.prefixAgo;
	var suffix = $l.suffixAgo;
	if (this.settings.allowFuture) {
		if (distanceMillis < 0) {
			prefix = $l.prefixFromNow;
			suffix = $l.suffixFromNow;
		}
		distanceMillis = Math.abs(distanceMillis);
	}

	var seconds = distanceMillis / 1000;
	var minutes = seconds / 60;
	var hours = minutes / 60;
	var days = hours / 24;
	var years = days / 365;

	function substitute(stringOrFunction, number) {
		var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
		var value = ($l.numbers && $l.numbers[number]) || number;
		return string.replace(/%d/i, value);
	}

	var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) || seconds < 90 && substitute($l.minute, 1) || minutes < 45 && substitute($l.minutes, Math.round(minutes)) || minutes < 90 && substitute($l.hour, 1) || hours < 24 && substitute($l.hours, Math.round(hours)) || hours < 48 && substitute($l.day, 1) || days < 30 && substitute($l.days, Math.floor(days)) || days < 60 && substitute($l.month, 1) || days < 365 && substitute($l.months, Math.floor(days / 30)) || years < 2 && substitute($l.year, 1) || substitute($l.years, Math.floor(years));

	return $.trim([prefix, words, suffix].join(" "));
  },
	parse: function (iso8601) {
		var s = $.trim(iso8601);
		s = s.replace(/\.\d\d\d+/, ""); // remove milliseconds
		s = s.replace(/-/, "/").replace(/-/, "/");
		s = s.replace(/T/, " ").replace(/Z/, " UTC");
		s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
		return new Date(s);
	},
	datetime: function (elem) {
		// jQuery's `is()` doesn't play well with HTML5 in IE
		var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
		var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
		return $t.parse(iso8601);
	}
});

$.fn.timeago = function () {
	var self = this;
	self.each(refresh);

	var $s = $t.settings;
	if ($s.refreshMillis > 0) {
		setInterval(function () {
			self.each(refresh);
		}, $s.refreshMillis);
	}
	return self;
};

function refresh() {
	var data = prepareData(this);
	if (!isNaN(data.datetime)) {
		$(this).text(inWords(data.datetime));
	}
	return this;
}

function prepareData(element) {
	element = $(element);
	if (!element.data("timeago")) {
		element.data("timeago", {
			datetime: $t.datetime(element)
		});
		var text = $.trim(element.text());
		if (text.length > 0) {
			element.attr("title", text);
		}
	}
	return element.data("timeago");
}

function inWords(date) {
	return $t.inWords(distance(date));
}

function distance(date) {
	return (new Date().getTime() - date.getTime());
}

/*=====Time ago Function End=====*/
})(jQuery);
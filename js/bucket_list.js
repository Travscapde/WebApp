var map;
var markers = [];
var selectedMarker;

$(document).ready(function() {


	var userID = sessionStorage.getItem('userID');

	var bucketList;


	var js_file = document.createElement('script');
	js_file.type = 'text/javascript';
	js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDI1IKGx1lrpkAszfQZQ-NNpyt9Fi0CBNs&callback=initMap';
	document.getElementsByTagName('head')[0].appendChild(js_file);

	Backend.getBucketList(userID, function(err, data) {
		if(err) {
			window.alert("Could not Fetch Bucket List");
		} else {
			if(data.length == 0) {
				$('#empty-page').css('display', 'block');
			} else {
				bucketList = data;
				var list = $('#country-list');
				for (var i=0; i<bucketList.length; i++) {
					var country = bucketList[i].name;
					var li = $('<li/>').html(country);
					li.attr('value', i);
					li.addClass('list-element');
					li.appendTo(list);
				}
				addCallbacks();
			}
		}

	});


	function addCallbacks() {
		$('.list-element').click(function() {
			var idx = $(this).attr('value');
			/*var len = $('.list-element').length;
			for(var i=0;i<len;i++) {
				if (i<idx) {
					$("#country-list li").eq(0).remove();
				} else if (i>idx) {
					$("#country-list li").eq(1).remove();
				}
			}*/
			history.pushState(null, null, "bucket_list-" + bucketList[idx].name + ".html");
			window.addEventListener("popstate", function(e) {
			    window.location = "/bucket_list.html";
			});

			showBucketListOfCountry(bucketList[idx]);

		});
	}

	var defaultIcon = {
		url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	};

	var selectedIcon = {
		url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
		//scaledSize: new google.maps.Size(48,48), 
	}

	function showBucketListOfCountry(bucketListElement) {
		console.log(bucketListElement);
		var cards = bucketListElement.cards;
		$('#country-list').css('display', 'none');
		$('#bucket-list-country').css('display', 'block');
		$('#country-name').css('display', 'block');

		$('#country-name').html(bucketListElement.name);

		google.maps.event.trigger(map, "resize");
		//if(marker)
		  //marker.setMap(null);

		var bounds = new google.maps.LatLngBounds();
		for (var i=0; i<cards.length; i++) {
			//markers.push({lat: cards[i].latitude, lng: cards[i].longitude});
			if (findMarker(cards[i].latitude, cards[i].longitude)) {
				continue;
			}
			coord = {lat: cards[i].latitude, lng: cards[i].longitude};
			marker = new google.maps.Marker({
		  		position: coord,
		  		map: map,
		  		icon: defaultIcon,
			});
			markers.push(marker);
			bounds.extend(coord);
			map.setZoom(map.getZoom() - 1);
		}  
		console.log(markers.length);		

		
		if(markers.length == 1) {
			map.setCenter({lat: markers[0].position.lat(), lng: markers[0].position.lng()});
			map.setZoom(4);
		} else {
			map.fitBounds(bounds);
		}


		function findMarker(latitude, longitude) {
			console.log(latitude, longitude);
			for (var i=0;i<markers.length;i++) {
				if(markers[i].position) {
					console.log(markers[i].position.lat() + " " + markers[i].position.lng());
					if(Math.abs(markers[i].position.lat() - latitude) < 0.0001 && Math.abs(markers[i].position.lng() - longitude) < 0.0001 ) {
						return markers[i];
					}
				}
			}
		}


		

		function photoActivateCallback(eventName, idx) {
			if(selectedMarker) {
				selectedMarker.setIcon(defaultIcon);
			}
			marker = findMarker(pictureCardsArr[idx].latitude, pictureCardsArr[idx].longitude);
			marker.setIcon(selectedIcon);
			selectedMarker = marker;
			//marker.setAnimation(google.maps.Animation.BOUNCE);
		}

		function blogActivateCallback(eventName, idx) {
			if(selectedMarker) {
				selectedMarker.setIcon(defaultIcon);
			}
			marker = findMarker(blogCardsArr[idx].latitude, blogCardsArr[idx].longitude);
			marker.setIcon(selectedIcon);
			selectedMarker = marker;
		}


		var options_picture = {
		    horizontal: 1,
		    itemNav: 'basic',
		    smart: 1,
		    activateOn: 'click',
		    mouseDragging: 1,
		    touchDragging: 1,
		    releaseSwing: 1,
		    startAt: 0,
		    speed: 300,
		    elasticBounds: 1,
		    activeClass: 'active-element', 
		    next: $('#picture-cards-next'),
			prev: $('#picture-cards-prev'),
		};


		var options_blog = {
		    horizontal: 1,
		    itemNav: 'basic',
		    smart: 1,
		    activateOn: 'click',
		    mouseDragging: 1,
		    touchDragging: 1,
		    releaseSwing: 1,
		    startAt: 0,
		    speed: 300,
		    elasticBounds: 1,
		    activeClass: 'active-element', 
		    next: $('#blog-cards-next'),
			prev: $('#blog-cards-prev'),
		};

		var pictureCardsArr = [];
		var blogCardsArr = [];


		var pictureCards = $('#picture-cards');
		pictureCards.css('display', 'block');
		var pictureCardsList = $('#picture-cards-list');
		cards.forEach(function(card) {
			if (card.card_type == "photo") {
				pictureCardsArr.push(card);
				var listItem = $('<li/>');
				var img = $('<img/>').attr('src', card.url);
				if(card.picture_width > card.picture_height) {
					img.css('height', '100%');
				} else {
					img.css('width', '100%');
				}
				img.addClass('img-responsive');
				img.appendTo(listItem);
				listItem.appendTo(pictureCardsList);
			}
		});


		var frame1 = new Sly('#picture-cards', options_picture, {
			active: photoActivateCallback,
		}).init();

		if (pictureCardsArr.length == 0) {
			$('#picture-cards-next').css('display', 'none');
			$('#picture-cards-prev').css('display', 'none');
			var container = $('#picture-cards');
			container.addClass('empty');
			var msg = $('<p/>', {text: "No Photos in Bucket List"});
			msg.css('font-size', '2em');
			msg.appendTo(container);
		}

		/*function emptyStateMessage(container, msg) {
			container.addClass('empty');
			var msg = $('<p/>', {text: msg});
			msg.css('font-size', '2em');
			msg.appendTo(container);
		}*/
		

		var blogCards = $('#blog-cards');
		blogCards.css('display', 'block');
		var blogCardsList = $('#blog-cards-list');
		cards.forEach(function(card) {
			if (card.card_type == "blog") {
				blogCardsArr.push(card);
				console.log('blog');
				var listItem = $('<li/>');
				var img = $('<img/>').attr('src', card.thumbnail);
				if(card.picture_width > card.picture_height) {
					img.css('height', '100%');
				} else {
					img.css('width', '100%');
				}
				img.addClass('img-responsive');
				img.appendTo(listItem);
				var title = $('<div/>');
				title.addClass('blog-title')
				title.css('position', 'absolute');
				title.css('width', '100%');
				title.css('height', '100%');
				//title.css('background', 'rgba(0,0,0,0.4)');
				$('<p/>', {text: card.title}).appendTo(title);
				title.appendTo(listItem);	
				listItem.appendTo(blogCardsList);
			}
		});

		var frame2 = new Sly('#blog-cards', options_blog, {
			active: blogActivateCallback,
		}).init();

		if (blogCardsArr.length == 0) {
			console.log("empty");
			console.log($('#blog-cards-next').css('display'));
			$('#blog-cards-next').css('display', 'none');
			$('#blog-cards-prev').css('display', 'none');
			var container = $('#blog-cards');
			container.addClass('empty');
			var msg = $('<p/>', {text: "No Blogs in Bucket List"});
			msg.css('font-size', '2em');
			msg.appendTo(container);
		}

		/*blogCards.sly({
		   horizontal: 1,
		    itemNav: 'basic',
		    smart: 1,
		    activateOn: 'click',
		    mouseDragging: 1,
		    touchDragging: 1,
		    releaseSwing: 1,
		    startAt: 0,
		    speed: 300,
		    elasticBounds: 1,
		    next: $('#blog-cards-next'),
			prev: $('#blog-cards-prev'),
		 });*/

		


	}


});




function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 4
  });
}
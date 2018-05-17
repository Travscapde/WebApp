$(document).ready(function() {

	var pictureCards = [];
	var blogCards = [];
	var userID;

	//Get user id from url
	var qParams = getUrlVars();
 	console.log(qParams);
 	if('user' in qParams) {
	 	if (qParams['user'] == 'self') {
	 		userID = sessionStorage.getItem('userID');
	 		console.log(userID);
	 	} else {
	 		userID = qParams['user'];
	 	}
 	} else {
 		console.log("User ID not found");
 	}




	$('#tab-headers a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show');
	});


	//local test
	//var userID = "588b2b72da66b9a4379fc335";
	//var userID = "589593bbac48cd73cb0811aa";

	Backend.getUserInfo(userID, function(err, user) {
		if(err) {
			wondow.alert("Unable to Load User Info");
		} else {
			console.log(user);
			$('#profile-pic').attr('src', user.profile_pic);
			$('#name').html(user.name);
			$('#number-likes').html(user.likes_received + " Likes Received");
			$('#number-bl').html(user.bl_received + " Bucket Lists Received");
		}
	}); 


	Backend.getUserCards(userID, function(err, cards) {
		if(err) {
			window.alert("Cannot Get User Cards");
		} else {
			console.log(cards.length);
			cards.forEach(function(card) {
				if(card.card_type == "photo") {
					pictureCards.push(card);
				} else {
					blogCards.push(card);
				}
			});

			$('#number-photo').html(pictureCards.length + " Photos");
			$('#number-blog').html(blogCards.length + " Blogs");

			populatePictureCards();
			populateBlogCards();
		}
	});

	function populatePictureCards() {
		var container = $('#photo-cards');
		console.log(pictureCards.length);
		if (pictureCards.length == 0) {
			var emptyMsg = $('<p />');
			emptyMsg.html("No Photos Uploaded");
			var link = $('<a />');
			link.html("Upload Photo");
			link.attr("href", "/add_picture.html");
			emptyMsg.appendTo(container);
			link.appendTo(container);
		} else {
			pictureCards.forEach(function(card, idx) {
				var div = $('<div />');			
				var item = $('<img />');
				item.attr('src', card.url);
				item.appendTo(div);
				div.appendTo(container);
			});
		}
	}

	function populateBlogCards() {
		var container = $('#blog-cards');
		if (blogCards.length == 0) {
			var emptyMsg = $('<p />');
			emptyMsg.html("No Blogs Uploaded");
			var link = $('<a />');
			link.html("Upload Blog");
			link.attr("href", "/add_blog.html");
			emptyMsg.appendTo(container);
			link.appendTo(container);
		} else {
			blogCards.forEach(function(card, idx) {
				var div = $('<div />');			
				var item = $('<img />');
				item.attr('src', card.thumbnail);

				var title = $('<div />');
				title.addClass('blog-title');
				$('<p />', {text: card.title}).appendTo(title);

				title.appendTo(div);
				item.appendTo(div);
				div.appendTo(container);
			});
		}
	}

});


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
$(document).ready(function() {

	var userID = sessionStorage.getItem('userID');
	var user = JSON.parse(sessionStorage.getItem("user"));
	var blogTitle;
	var blogUrl;
	var thumbnailUrl = [];
	var thumbnailIdx = 0;
	var blogExtract;
	var interests = [];


	var isAdmin;
	if ('user_type' in user && user.user_type == "admin") {
	    isAdmin = true;
	} else {
	    isAdmin = false;
	}

	adminStuffs();
	function adminStuffs() {
        if (isAdmin) {
            console.log("Welcome Admin");
            var container = $('#middle-col');
            
            var inp = $('<input />');
            inp.attr('id', 'user-id-override');
            inp.css('margin-top', '2em');
            
            var inp2 = $('<input />');
            inp2.attr('id', 'thumbnail-override');
            
            var inp3 = $('<input />');
            inp3.attr('id', 'extract-override');

            container.append("User ID: ");
            inp.appendTo(container);
	        container.append("<br/>Thumbnail Picture Override: ");
	        inp2.appendTo(container);
	        container.append("<br/>Extract Override: ");
	        inp3.appendTo(container);    
        }
	    
	}


	function leaveInput(el) {
		console.log("lost focus");
		console.log(el.value);
		if (el.value.length > 0) {
			if (!el.classList.contains('active')) {
					el.classList.add('active');
			}
		} else {
			if (el.classList.contains('active')) {
					el.classList.remove('active');
			}
		}
	}

	var inputs = document.getElementsByClassName("m-input");
	for (var i = 0; i < inputs.length; i++) {
		var el = inputs[i];
		el.addEventListener("blur", function() {
			leaveInput(this);
		});
	}

	/*function leaveInput(el) {
		console.log("Unfocusing");
		if (el.val().length > 0) {
			if (!el.hasClass('active')) {
					el.addClass('active');
			}
		} else {
			if (el.hasClass('active')) {
					el.removeClass('active');
			}
		}
	}

	var inputs = $(".m-input");
	console.log(inputs);

	$('.m-input').each(function(idx, element) {
		console.log(element);
		element.blur(function(){
    		console.log ("This input field has lost its focus.");
		});
		//element.focusout(leaveInput($(this)));
	});*/


	function showLoader() {
		$('#loading-screen').css('display', 'block');
	}

	function hideLoader() {
		$('#loading-screen').css('display', 'none');
	}
	

	$('#preview-button').click(function() {

		blogUrl = $('#blog-url').val();
		//console.log(url);
		if(!blogUrl) {
			window.alert("Enter URL");
		} else {
			showLoader();
			Backend.getLinkPreview(blogUrl, function(err, info) {
				if(err) {
					console.log(err);
					window.alert("Could not get preview");
				} else {
					//console.log(info);
					blogTitle = info.title;
					thumbnailUrl = info.image;
					blogExtract = info.extract;
					$('#url-input-group').css('display', 'none');
					$('#preview').css('display', 'block');
					$('#title').html(info.title);
					$('#extract').html(info.extract);
					$('#extract-modify').click(function() {
						$('#extract').css('display', 'none');
						$('#extract-modify').css('display', 'none');
						$('#extract-input-group').css('display', 'block');
						$('#extract-custom').addClass('active');
						$('#extract-custom').val(info.extract);
						$('#extract-custom').focus();
						$('#extract-custom').select();
					});
					$('#location-input').css('display', 'block');
					$('#interest-input').css('display', 'block');
					$('#upload-button').css('display', 'block');
					$('#thumbnail').attr('src', thumbnailUrl[0]);
					$('#thumbnail-next').click(function() {
						thumbnailIdx++;
						thumbnailIdx = thumbnailIdx%thumbnailUrl.length;
						$('#thumbnail').attr('src', thumbnailUrl[thumbnailIdx]);
					});
					$('#thumbnail-prev').click(function() {
						var n = thumbnailUrl.length;
						thumbnailIdx++;
						thumbnailIdx = (thumbnailIdx+n) % n;
						$('#thumbnail').attr('src', thumbnailUrl[thumbnailIdx]);
					});
					//$('#thumbnail').css('display', 'block');

					autocomplete = new google.maps.places.Autocomplete(
					        (document.getElementById('autocomplete')) /*,
					        {types: ['geocode']} */);

					$('#interest-input').click(function() {
						openInterestSeletion(null, 3, true, onInterestSelected);
					}) 
					
				}
				hideLoader();
			});
		}


	});



	$('#button-select-interest').click(function() {
		$('#button-select-interest').attr('value', 'Select');	
		$('#button-select-interest').blur();	
		$('#button-select-interest').trigger("blur");	
		openInterestSeletion(null, 3, true, onInterestSelected);
	});



	/*function closeInterestSeletion() {
		//selectedInterests = [];
		//$('#interest-list').empty();
		$('#select-interest-modal').css('display', 'none');
	}*/
	

	/*var interestsShown = false;

	function openInterestSeletion(preSelectedInterests, callback) {
		var selectedInterests = [];
		$('#select-interest-modal').css('display', 'block');
		$('#button-close-modal').click(function() {
			closeInterestSeletion();
		});

		if(interestsShown)
			return;

		var interestList = JSON.parse(sessionStorage.getItem('interestList'))['interests'];
		//var interestList = [{'interest':'Hiking'}, {'interest':'Biking'}, {'interest':'Diving'}];
		var container = $('#interest-list');
		interestList.forEach(function(element) {
			$('<input />', { type: 'checkbox', id: element.interest, value: element.interest }).appendTo(container);
			$('<label />', {text: element.interest }).appendTo(container);
			$('<br>').appendTo(container);
		});

		$('<button />', {text: 'Done', id: 'select-return'}).appendTo(container);
		interestsShown = true;

		$('#select-return').click(function() {
			selectedInterests = [];
			var checkboxes = container.find(':checkbox');
			checkboxes.each(function(idx) {
				if($( this ).prop('checked')  == true) {
					selectedInterests.push($( this ).val());
					//console.log($( this ).val());
				}
			});

			callback(selectedInterests);
			
			
		});
			
		
	}*/

	function onInterestSelected(selectedInterests) {
		console.log(selectedInterests);
		showSelectedInterest(selectedInterests);
		interests = selectedInterests;
		closeInterestSeletion();
	}


	function showSelectedInterest(selectedInterests) {
	     if(selectedInterests.length > 0) {
	         $('#button-select-interest').val(selectedInterests.join(', '));
	         $('#button-select-interest').addClass('active');
	     } else {
	         $('#button-select-interest').val("");
	         $('#button-select-interest').removeClass('active');
	     }
	 }




	$('#upload-button').click(function() {
		var place = autocomplete.getPlace();
        if (!place) {
            window.alert("Location Not Selected");
            return;    
        }

        if((interests).length == 0){
            window.alert("Interest Not Selected");
            return;
        }

        if($('#extract-input-group').css('display') != 'none') {
        	blogExtract = $('#extract-custom').val();
        }


        //Admin UserID Override
        if(isAdmin && document.getElementById('user-id-override').value != "") {
            console.log("Overriding user ID");
            userID =  document.getElementById('user-id-override').value;
            if(document.getElementById('thumbnail-override').value != "") {
            	thumbnailUrl[thumbnailIdx] = document.getElementById('thumbnail-override').value;
            	console.log(thumbnailUrl[thumbnailIdx]);
            }
			if(document.getElementById('extract-override').value != "") {
            	blogExtract = document.getElementById('extract-override').value;
            }
                        


        } 

		showLoader();	

        var place = autocomplete.getPlace();
        var addrArray = place['formatted_address'].split(',');
        var country = addrArray[addrArray.length-1];
        var locationString = place['name'] + ", " + country;
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();

        console.log(blogUrl);
        Backend.postBlogCard(userID, blogUrl, blogTitle, blogExtract, thumbnailUrl[thumbnailIdx], interests, place.place_id, locationString, lat, lng, function(err, savedCard) {
        	hideLoader();
        	if (err) {
               window.alert("Failed to upload to server"); 
            } else {
        		sessionStorage.setItem("uploaded_card", JSON.stringify(savedCard));
        		window.location = "/index.html";
        	}
        })

	});


	/*function initializeInterestList() {
		var selectInterest = document.getElementById('button-select-interest');
		var interestList = JSON.parse(sessionStorage.getItem('interestList'))['interests'];
		
		interestList.forEach(function(element) {
		    var option = document.createElement( 'option' );
		    option.value = element.interest;
		    option.innerHTML = element.interest;
		    selectInterest.appendChild(option);
		});

		selectInterest.selectedIndex = -1;

	}*/


});
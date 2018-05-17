var map;
var destination = {lat: 0, lng: 0};
var userLocation;
var marker, userMarker;


$(document).ready(function() {


  var userID = sessionStorage.getItem('userID');
  //userID = "589593bbac48cd73cb0811aa";
  var user = JSON.parse(sessionStorage.getItem('user'));
  console.log(user);
  if(user)
    var nationality= user.nationality;
  var interestList = JSON.parse(sessionStorage.getItem('interestList'));

  if(sessionStorage.getItem('uploaded_card')) {
    console.log("Uploaded Card Present");
    var uploadedCard = JSON.parse(sessionStorage.getItem('uploaded_card'));
    console.log(uploadedCard);
  }

  var cardsArray = [];
  if(sessionStorage.getItem('cards')) {
    cardsArray = JSON.parse(sessionStorage.getItem('cards'));
  } else {

  }

  var links = [
    {
      "bgcolor":"red",
      "icon":"+"
    },
    {
      "url":"/add_picture.html",
      "bgcolor":"red",
      "color":"#fffff",
      "icon":"<img src='images/icon_add_picture.svg' style='width: 100%;'/>",
      "title":"Add Photo"
    },
    {
      "url":"/add_blog.html",
      "bgcolor":"red",
      "color":"#fffff",
      "icon":"<img src='images/icon_add_blog.svg' style='width: 60%;'/>",
      "title":"Add Blog"
    }
  ];
  var interestsShown = false;
  var isSearchResults = false;

  if (user.location_lat && user.location_lng) {
    userLocation = {
      lat: user.location_lat,
      lng: user.location_lng,
    };
  } else {
    userLocation = {
      lat: 500,
      lng: 500,
    }
  }

  var qParams = getUrlVars();

  if (qParams['modal'] == 'location-info') {

  }

  var locationOnBoarded = false;
  if(sessionStorage.getItem('location-onboarded')) {
    locationOnBoarded = sessionStorage.getItem('location-onboarded');
  }

  var blOnBoarded = false;
  if(sessionStorage.getItem('bl-onboarded')) {
    blOnBoarded = sessionStorage.getItem('bl-onboarded');
  }

  /*console.log(user);
  console.log(interestList);*/




  if (user.interests.length == 0) {
    console.log("Requesting interest");
    openInterestSeletion(null, 100, false, function(selectedInterests) {
      user.interests = selectedInterests;
      sessionStorage.setItem("user", JSON.stringify(user));
      updateUserInterests(selectedInterests)
      setupHomePage();
    });
  } else {
    setupHomePage();
  }

  //Test in Local
  //setupHomePage();



  function setupAutoComplete() {
    autocomplete = new google.maps.places.Autocomplete(
          (document.getElementById('autocomplete')) /*,
          {types: ['geocode']}*/ );
  }



  function updateUserInterests(selectedInterests) {
    Backend.updateUserInterests(userID, selectedInterests, function(err) {
      if(err) {
        window.alert('Failed to Update Interest');
      } else {

      }
    })
  }



  /*function closeInterestSeletion() {
    //selectedInterests = [];
    //$('#interest-list').empty();
    $('#select-interest-modal').css('display', 'none');
  }*/


  /*function openInterestSelection(preSelectedInterests, callback) {
    $('#select-interest-modal').css('display', 'block');
    $('#button-close-modal').click(function() {
      closeInterestSeletion();
    });

    if(interestsShown)
      return;

    var interestList = JSON.parse(sessionStorage.getItem('interestList'))['interests'];
    //var interestList = [{'interest':'Hiking'}, {'interest':'Biking'}, {'interest':'Diving'}];
    var container = $('#interest-list');
    interestList.forEach(function(element, idx) {
      $('<input />', { type: 'checkbox', id: idx, value: element.interest }).appendTo(container);
      $('<label />', {text: element.interest }).appendTo(container);
      $('<br>').appendTo(container);
    });

    $('<button />', {text: 'Done', id: 'select-return'}).appendTo(container);
    interestsShown = true;

    console.log(preSelectedInterests);
    if(preSelectedInterests) {
      preSelectedInterests.forEach(function(element) {
        var selectedIdx = interestList.findIndex(function(interestObj) {
          return (interestObj.interest==element)
        })
        console.log(typeof selectedIdx + " " + selectedIdx + " " +  $("#"+selectedIdx));
        $("#"+selectedIdx).prop('checked', true);
      });
    }

    $('#select-return').click(function() {
      selectedInterests = [];
      var checkboxes = container.find(':checkbox');
      checkboxes.each(function(idx) {
        if($( this ).prop('checked')  == true) {
          selectedInterests.push($( this ).val());
          //console.log($( this ).val());
        }
      });

      closeInterestSeletion();
      callback(selectedInterests);
    });


  }*/

  function populateCards(refresh, newCardIdx) {
    if(refresh == true) {
      $('#update').empty();
    }

    var start = 0;
    if(newCardIdx) {
      start = newCardIdx;
    }

    var output = '';
    for (var i=start; i<cardsArray.length;i++) {
      var v = cardsArray[i];
      console.log(v);

      if (v.card_type == 'photo') {
        output =   '<div class="row">';
        output +=   '<div class="col-md-3" >';
        output +=   '</div>'
        output +=   '<div class="col-md-6 travscapade">';
        output +=     '<div class="user-content">';
        output +=       '<img src="' + v.url + '" id="'+ v._id + '" class="travimage center-block" data-name="travimage" />';
        output +=       '<div id="overlay_' + v._id + '" class="overlay-picture"></div>';
        output +=       '<div id="location_' + v._id + '" value="' + v._id + '" class="location-text-picture"><p class="'+ v._id +'">'+ v.location +'</p></div>';
        output +=     '</div>';
        output +=     '<div id="description_' + v._id + '" class="picture-description"><p class="'+ v._id +'">'+ v.description +'</p></div>';
        output +=     '<div class="buttons-div">';
        output +=       '<p class="text-center">';
        output +=         '<button id="like_button_' + v._id + '" class="glyphicon glyphicon-heart heart button-override" aria-hidden="true" value="'+ v._id +'"></button>';
        output +=         '<span class="likes" id="likes_' + v._id + '">' + v.likes + '</span>';
        output +=         '<button id="bucket_button_' + v._id + '" class="glyphicon glyphicon-plus button-override" aria-hidden="true" value="'+ v._id +'"></button>';
        output +=         '<span id="bucket_count_' + v._id + '">' + v.bucket_count + '</span>';
        output +=       '</p>';
        output +=     '</div>';
        output +=     '<div id="details">';
        output +=       '<a id="travel-type-blog">' + v.interests + '</a><br>';
        output +=       '<div id="distance_' + v._id + '"></div>';
        output +=       '<div class="visa" id="visa_' + v._id + '"></div>';
        output +=     '</div>';
        output +=     '<div id="uploader">';
        output +=       '<a><img src="https://backend.travscapade.com:443/api/getImage?url=' + v.user_profile_pic + '"/></a>';
        output +=       '<a>' + v.user_name + '</a>';
        output +=     '</div>';
        output +=   '</div>';
        output +=   '<div class="col-md-3" >';
        output +=   '</div>'
        output +=  '</div>';


      } else if (v.card_type == "blog") {
        var imageURL = "https://backend.travscapade.com:443/api/getImage?url=" + v.thumbnail;

        output =  '<div class="row">';
        output +=   '<div class="col-md-3" >';
        output +=   '</div>'
        output +=   '<div class="col-md-6 travscapade" >';
        output +=     '<div class="blog-clickable" id="blog-clickable_' + v._id + '">';
        output +=       '<div class="blog-title"><p>' + v.title + '</p></div>';
        output +=       '<div class="user-content">';
        output +=         '<img src="' + imageURL + '" id="'+ v._id + '" class="travimage" data-name="travimage" />';
        output +=         '<div class="overlay-blog"></div>';
        output +=         '<div class="blog-extract"><p>' + v.description + '</p></div>';
        output +=       '</div>';
        output +=     '</div>';
        output +=     '<div id="location_' + v._id + '" value="' + v._id + '" class="location-text-blog"><p class="'+ v._id +'">'+ v.location +'</p></div>';
        //output +=     '<div id="location_' + v._id + '" class="location-text-blog"><p class="'+ v._id +'">'+ v.location +'</p></div>';
        output +=     '<div class="buttons-div">';
        output +=       '<p class="text-center">';
        output +=         '<button id="like_button_' + v._id + '" class="glyphicon glyphicon-heart heart button-override" aria-hidden="true" value="'+ v._id +'"></button>';
        output +=         '<span class="likes" id="likes_' + v._id + '">' + v.likes + '</span>';
        output +=         '<button id="bucket_button_' + v._id + '" class="glyphicon glyphicon-plus button-override" aria-hidden="true" value="'+ v._id +'"></button>';
        output +=         '<span id="bucket_count_' + v._id + '">' + v.bucket_count + '</span>';
        output +=       '</p>';
        output +=     '</div>';
        output +=     '<div id="details">';
        output +=       '<a id="travel-type-blog">' + v.interests.join(', ') + '</a><br>';
        output +=       '<div id="distance_' + v._id + '"></div>';
        output +=       '<div class="visa" id="visa_' + v._id + '"></div>';
        output +=     '</div>';
        output +=     '<div id="uploader">';
        output +=       '<a><img src="https://backend.travscapade.com:443/api/getImage?url=' + v.user_profile_pic + '"/></a>';
        output +=       '<a>' + v.user_name + '</a>';
        output +=     '</div>';
        output +=   '</div>';
        output +=   '<div class="col-md-3" >';
        output +=   '</div>'
        output +=  '</div>';
      }

      $('#update').append(output);

      if('distance' in v) {
        $('#distance_'+v._id).html(getDistanceString(v.distance));
      } else {
        $('#distance_'+v._id).css('display', 'none');
      }


      if('visa_info' in v) {
        if (v.visa_info == "Nationality needed") {
          $('#visa_'+v._id).html("Visa Info");
          $('#visa_'+v._id).click(visaCallback);
        } else if (v.visa_info == "Not available") {
          $('#visa_'+v._id).html("Visa Info Unavailable");
        } else {
          $('#visa_'+v._id).html(v.visa_info);
        }
      }


      /*if('visa_info' in v) {
        $('#visa_'+v._id).html(v.visa_info);
      } else if (nationality) {
        $('#visa_'+v._id).html("Not Availbale");
      } else {
        $('#visa_'+v._id).html("Visa Info");
        $('#visa_'+v._id).click(visaCallback);
      }*/



      if(v.card_type == "photo") {
        $('#'+v._id).click(function(e) {
          console.log($(this)[0].id);
          var id = $(this)[0].id;
          if($(window).width() > 480) {
            openFullscreen(getCard(id));
          }
        });
      }

      if(v.card_type == "blog") {
        $('#blog-clickable_'+v._id).click(function(e) {
          var id = $(this)[0].id;
          var id = id.replace('blog-clickable_','');
          var url = getCard(id).url + '?utm_source=travscapade';
          console.log(url);
          ga('send', 'event', 'Blog Card', "Open", sessionStorage.getItem('userID'));
          window.open(url);
        })
      }

      if(v.is_liked == true){
        onLike(v._id);
      }

      if(v.is_bucket_listed == true){
        console.log(v._id);
        onBucketList(v._id);
      }

    }
  }




  function closeHint(element) {
    element.removeClass('elevated');
    $('#overlay-hint').empty();
    $('#overlay-hint').css('display', 'none');

    $('body').css('overflow', 'auto');
  }

  function showHint(element, msg, pos, offset, positionMid) {
    $('body').css('overflow', 'hidden');

    target = element.offset();
    console.log(target.top + " " + target.left);
    var mid =$(window).height()/2;

    if (positionMid) {
      if(target.top > mid) {
        console.log("Diff: " + mid);
        $(window).scrollTop(target.top-mid);
        target.top = mid;
      }
    } else {
      target.top -= $(window).scrollTop();
    }


    $('#overlay-hint').css('display', 'block');
    var hintMsg = $('<p />');
    hintMsg.addClass('hint');
    hintMsg.html(msg);


    hintMsg.css('left', target.left+element.width()/2);
    hintMsg.css('transform', 'translate(-50%, 0)');

    if($(window).width() > 480) {

    } else {
      hintMsg.css('width', '100px');
      //window.alert(target.left+element.width()/2 + " " + hintMsg.width()/2 + " " + $(window).width());
      if (target.left + element.width()/2 + hintMsg.width()/2 > $(window).width()) {
        var w = ($(window).width() - target.left - element.width()/2) * 2;
        hintMsg.css('width', w);
      }
    }

    if (pos && pos == "top") {
      hintMsg.css('bottom', $(window).height() - target.top - offset);
    } else {
      hintMsg.css('top', target.top + element.height() + offset);
    }

    /*if($(window).width() > 480) {
      hintMsg.css('left', target.left+element.width()/2);
      hintMsg.css('transform', 'translate(-50%, 0)');
    } else {
      hintMsg.css('left', '1em');
      hintMsg.css('width', '15em');
    }*/

    hintMsg.appendTo($('#overlay-hint'));
    element.addClass('elevated');

    $('#overlay-hint').click(function() {
      closeHint(element);
    });

  }



  function getDistanceString(distance) {
    var time = (distance/920) + 1;
    var hr = Math.floor(time);
    var min = (time - hr) * 60;
    var roundedMin;
    if(min < 7.5) {
      roundedMin = 0;
    } else if (min > 7.5 && min < 22.5){
      roundedMin = 15;
    } else if (min > 22.5 && min < 37.5){
      roundedMin = 30;
    } else if (min > 37.5 && min < 52.5){
      roundedMin = 45;
    }  else {
      roundedMin = 0;
      hr++;
    }
    return "About " + hr + "hr " + (roundedMin!=0 ? roundedMin+"min" : "") + " flight.";
  }


  function openLocationRequest(callback) {
    $('#location-request-modal').css('display', 'block');
    $('#location-request-ok').click(function() {
      closeLocationRequest();
      callback("ok");
    });

    $('#location-request-cancel').click(function() {
      closeLocationRequest();
      callback("cancel");
    });
  }

  function closeLocationRequest() {
    $('#location-request-modal').css('display', 'none');
  }

  function getUserLocation() {
    return new Promise (function(resolve, reject) {

      if (user.location_lat && user.location_lng) {
        console.log("user location already have");
        userLocation = {
          lat: user.location_lat,
          lng: user.location_lng,
        };
        resolve();
        return;
      } else {
        //Default
        userLocation = {
          lat: 500,
          lng: 500,
        }
      }

      if (navigator.geolocation) {
        openLocationRequest(function(status) {
          if (status == "cancel") {
            resolve();
            return;
          } else {
              navigator.geolocation.getCurrentPosition(function(position) {
                userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                user.location_lat = position.coords.latitude;
                user.location_lng = position.coords.longitude;
                sessionStorage.setItem("user", JSON.stringify(user));
                Backend.updateUserLocation(userID, position.coords.latitude, position.coords.longitude, function(err) {
                  if (err) {

                  }
                });

                console.log(user.location_lat, user.location_lng);
                refresh(function() {
                  resolve();
                  return;
                });
              }, function(err) {
                console.log("Not Availbale");
                resolve();
                return;
              });
          }
        });
      } else {
        resolve();
        return;
        console.log("Not Supported");
      }
    });



  }

  function refresh(callback) {
    cardsArray = [];
    //Backend.getCards(cardsArray.length, "589593bbac48cd73cb0811aa", userLocation.lat, userLocation.lng, function(data) {
    Backend.getCards(cardsArray.length, userID, userLocation.lat, userLocation.lng, function(data) {
      cardsArray = data.cards;
      sessionStorage.setItem("cards", JSON.stringify(cardsArray));
      populateCards(true);
      callback();
    });
  }

  function onBoarding() {
    console.log("onboarding function");
    if(user.number_visit <= 1) {
      var id = cardsArray[0]._id;
      console.log(id);
      if($("#"+id).height() > 0) {
        showHint($('#like_button_'+id), "|<br>Like a picture to reveal its location!", "bottom", 0, true);
        showHint($('#bucket_button_'+id), "Add destinations to your bucket list!<br>|", "top", 0, true);
      } else {
        $("#"+id).bind('load', function() {
          console.log("First Image Loaded");
          showHint($('#like_button_'+id), "|<br>Like a picture to reveal its location!", "bottom", 0, true);
          showHint($('#bucket_button_'+id), "Add destinations to your bucket list!<br>|", "top", 0, true);
        });
      }
    }
  }


  function onBoardingLocation(cardID) {
    console.log("onboarding location");
    if(user.number_visit <= 1) {
      if(locationOnBoarded == false) {
        showHint($('#location_'+cardID), "|<br>Click on the location to learn more", "bottom", 30, true);
        locationOnBoarded = true;
        sessionStorage.setItem("location-onboarded", locationOnBoarded);
      }
    }
  }

  function onBoardingBucketList() {
    console.log("onboarding bl");
    if(user.number_visit <= 1) {
      if(blOnBoarded == false) {
        showHint($('#user-button'), "|<br>Find the cards you bucket listed here", "bottom", 0, false);
        blOnBoarded = true;
        sessionStorage.setItem("bl-onboarded", blOnBoarded);
      }
    }
  }



  function setupHomePage() {
    //getUserLocation();

    //var js_file = document.createElement('script');
    //js_file.type = 'text/javascript';
    //js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDI1IKGx1lrpkAszfQZQ-NNpyt9Fi0CBNs&libraries=places&callback=initMap';
    //document.getElementsByTagName('head')[0].appendChild(js_file);

    setupCloseModals();
    setupAutoComplete();
    //$("#country").countrySelect("destroy");
    //console.log("destroyed");
    //if (cardsArray.length != 0)
      //$("#country").countrySelect({defaultCountry: "af"});


    $('.kc_fab_wrapper').kc_fab(links);

    console.log(userLocation);
    //Backend.getCards(cardsArray.length, "589593bbac48cd73cb0811aa", userLocation.lat, userLocation.lng, function(data) {
    if(cardsArray.length != 0) {
      console.log("cards already exist");
      if(uploadedCard) {
        var temp = [];
        temp.push(uploadedCard);
        cardsArray = temp.concat(cardsArray);
        sessionStorage.removeItem("uploaded_card");
      }
      populateCards(true);
    } else {
      console.log("fetching cards");


      Backend.getCards(cardsArray.length, userID, userLocation.lat, userLocation.lng, function(data) {
        cardsArray = data.cards;
        sessionStorage.setItem("cards", JSON.stringify(cardsArray));
        populateCards(true);
        getUserLocation().then(onBoarding);
      });
    }
  }


  function closeCountrySelectModal() {
     $('#country-select-modal').css('display', 'none');
  }

 //$(document).on("click", ".visa" , function() {
  function visaCallback() {
    $("#country").countrySelect({defaultCountry: "af"});
    $('#country-select-modal').css('display', 'block');

    history.pushState(null, null, "nationality-select.html");
    window.addEventListener("popstate", function(e) {
        closeCountrySelectModal();
    });

    $('#country-select-button').click(function() {
      var countryName = $("#country").countrySelect("getSelectedCountryData").name;
      countryName = countryName.split("(")[0];
      countryName = countryName.trim();
      console.log(countryName);
      history.back();
      //closeCountrySelectModal();
      Backend.registerNationality(userID, countryName, function() {
        refresh();
      });
    })
  }


  $(document).on("click", ".heart" , function() {
    //$(this).css("color","red");
    //$(this).css("-webkit-text-stroke", "0px");
    var cardID = $(this).attr("value");
    var cardIdx = getCardIdx(cardID);
    cardsArray[cardIdx].likes++;
    cardsArray[cardIdx].is_liked = true;
    sessionStorage.setItem("cards", JSON.stringify(cardsArray));
    Backend.registerLikeCard(userID, cardID);
    onLike(cardID);
    onBoardingLocation(cardID);
  }); //like button (heart) function



  $(document).on("click", ".glyphicon-plus" , function() {
    var cardID = $(this).attr("value");
    var cardIdx = getCardIdx(cardID);
    cardsArray[cardIdx].bucket_count++;
    cardsArray[cardIdx].is_bucket_listed = true;
    sessionStorage.setItem("cards", JSON.stringify(cardsArray));
    Backend.registerBucketCard(userID, cardID);
    onBucketList(cardID);
    onBoardingBucketList();
  });


  $(document).on("click", ".location-text-picture" , function() {
    openLocationInfoModal($(this).attr("value"));
  });

  $(document).on("click", ".location-text-blog" , function() {
    openLocationInfoModal($(this).attr("value"));
  });



  $('#button-user-interests').click(function() {
    if (!user) {
      window.alert("Not Logged in");
    }

    openInterestSeletion(user.interests, 100, true, function(selectedInterests) {
      user.interests = selectedInterests;
      sessionStorage.setItem("user", JSON.stringify(user));
      updateUserInterests(selectedInterests);
    });
  });


  $('#button-logout').click(function() {
    window.location = "/signin.html?state=logout";
  });


  function onLike(cardID) {
    //getCard(cardID).is_liked = true;
    //sessionStorage.setItem("cards", JSON.stringify(cardsArray));

    $('#like_button_'+cardID).css("color","red");
    $('#like_button_'+cardID).css("-webkit-text-stroke", "0px");
    $('#like_button_'+cardID).prop('disabled', true);

    $('#overlay_'+cardID).css("display", "block");
    $('#location_'+cardID).css("display", "block");
    if(getCard(cardID).description != "") {
      $('#description_'+cardID).addClass('picture-description-displayed');
    }
    $('#likes_'+cardID).html(cardsArray[getCardIdx(cardID)].likes);
  }

  function onBucketList(cardID) {
    //getCard(cardID).is_bucket_listed = true;
    //sessionStorage.setItem("cards", JSON.stringify(cardsArray));

    $('#bucket_button_'+cardID).css("color","red");
    $('#bucket_button_'+cardID).css("-webkit-text-stroke", "0px");
    $('#bucket_button_'+cardID).prop('disabled', true);
    $('#bucket_count_'+cardID).html(cardsArray[getCardIdx(cardID)].bucket_count);

    $('#overlay_'+cardID).css("display", "block");
    $('#location_'+cardID).css("display", "block");
    if(getCard(cardID).description != "") {
      $('#description_'+cardID).addClass('picture-description-displayed');
    }

  }


  function setupCloseModals () {
    //Fullscreen
    $('#button-close-fullscreen').click(function(event) {
      event.stopPropagation();
      history.back();
    });
    $('#fullscreen-modal').click(function() {
      history.back();
    });

    //Location Info
    $('#location-info-modal').click(function() {
      history.back();
    });
    $('#button-close-location').click(function(event) {
      event.stopPropagation();
      history.back();
    });

    //Country Selection
    $('#country-bg').click(function(event) {
      event.stopPropagation();
    });
    $('#country-select-modal').click(function() {
      history.back();
    });
    $('#button-close-country-select').click(function(event) {
      event.stopPropagation();
      history.back();
    });


    $('#button-close-search').click(function() {
     history.back();
    });


    //Interest Selection
    $('#interest-modal-content').click(function(event) {
      event.stopPropagation();
    })

    $('#select-interest-modal').click(function() {
      history.back();
    });
    $('#button-close-modal').click(function(event) {
      event.stopPropagation();
      history.back();
    });

  }


  function closeFullscreen(card) {
    $('#fullscreen-modal').css('display', 'none');
  }

  function openFullscreen(card) {
    ga('send', 'event', 'Picture Card', 'Fullscreen', sessionStorage.getItem('userID'));

    history.pushState(null, null, "fullscreen.html");
    window.addEventListener("popstate", function(e) {
        closeFullscreen();
    });

    console.log(card.url);
    $('#fullscreen-modal').css('display', 'block');

    $('#fullscreen-image').attr('src', card.url);

    //console.log(card.picture_width + " " + card.picture_height);
    if(card.picture_height < card.picture_width) {
      console.log("l");
      $('#fullscreen-content').css('width', '50%');
    } else {
      console.log('p');
      $('#fullscreen-content').css('width', '40%');
    }

    var w = $('#fullscreen-image-div').width();
    var h = (card.picture_height/card.picture_width)*w;
    var marginTop = ($(window).height()) / 2 - (h / 2);
    $('#fullscreen-content').css('margin-top', marginTop);

  }


  function openLocationInfoModal(cardID) {
    ga('send', 'event', 'Card', 'Location Info Open', sessionStorage.getItem('userID'));

    history.pushState(null, null, "lcocation-info.html");
    window.addEventListener("popstate", function(e) {
        closeLocationInfoModal();
    });

    $('#location-info-modal').css("display", "block");

    var card = getCard(cardID);
    console.log(card);

    google.maps.event.trigger(map, "resize");
    if(marker)
      marker.setMap(null);
    //map.clearOverlays();
    destination = {lat: card.latitude, lng: card.longitude};
    marker = new google.maps.Marker({
      position: destination,
      map: map
    });

    var userIcon = {
      url: "/images/user-location-marker.png",
      scaledSize: new google.maps.Size(50, 50)
    };
    if(!userMarker) {
      if(userLocation.lat != 500 && userLocation.lng != 500) {
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          icon: userIcon
        });
      }
    }

    if(userLocation.lat != 500 && userLocation.lng != 500) {
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(destination);
      bounds.extend(userLocation);
      map.fitBounds(bounds);
    } else {
      map.panTo(destination);
    }




    $('#location-info-name').html(card.location_info_name);
    if(card.location_info_summary == "") {
      $('#location-info-summary').html("Location Information unavailable at the moment.");
    } else {
        $('#location-info-summary').html(card.location_info_summary);
    }
    if(card.location_info_link != "") {
      $('#link').css('display', 'block');
      $('#link').attr("href", card.location_info_link);
    } else {
      $('#link').css('display', 'none');
    }

    var monthNames = ['Jan', 'Feb', 'Mar', "Apr", "May", "Jun", 'Jul', 'Aug', 'Sep', "Oct", 'Nov', 'Dec'];
    var scoreBar = $('#score-bar');
    scoreBar.empty();

    //Check Validity
    if (card.location_score[0] == -1 && card.location_score[11] == -1) {
      console.log("Best time to go unavailable");
      var msg = $('<p />');
      msg.html("Data Unavailable");
      msg.appendTo(scoreBar);

      return;
    }


    for (var i=0; i<12; i++) {
      var mon = $('<span/>');
      mon.css('text-align', 'center');
      //mon.css('color', '#FFFFFF')
      mon.css('height', '2em');
      mon.css('display', 'inline-block');
      mon.css('position', 'relative');
      mon.css('width', '8.3%');
      if(i==0) {
        mon.css('margin-left', '0.2%');
      }
      var overlay = $('<div />');
      overlay.addClass('score-bar-overlay');
      overlay.appendTo(mon);
      var monName = $('<p />');
      monName.html(monthNames[i]);
      monName.addClass('mon-name');
      monName.appendTo(mon);


      var score = Math.floor(card.location_score[i]);
      if (score == 3)
        score =2;
      var nxtScore = -1;
      if(i<11) {
        nxtScore = Math.floor(card.location_score[i+1]);
      } else {
        nxtScore = Math.floor(card.location_score[0]);
      }
      if(nxtScore == 3)
        nxtScore=2;

      if (score == nxtScore || i == 11) {
        if(score == 0) {
          mon.css('background', 'red');
        } else if (score == 1) {
          mon.css('background', 'yellow');
        } else {
          mon.css('background', 'green');
        }
      }

      if(score == 0 && nxtScore == 1) {
        mon.css('background', 'linear-gradient(to right, red, yellow)');
      } else if (score == 1 && nxtScore == 0) {
        mon.css('background', 'linear-gradient(to right, yellow, red)');
      } else if (score == 1 && nxtScore == 2) {
        mon.css('background', 'linear-gradient(to right, yellow, green)');
      } else if (score == 2 && nxtScore == 1) {
        mon.css('background', 'linear-gradient(to right, green, yellow)');
      } else if (score == 0 && nxtScore == 2) {
        mon.css('background', 'linear-gradient(to right, red, green)');
      } else if (score == 2 && nxtScore == 0) {
        mon.css('background', 'linear-gradient(to right, green, red)');
      }

      mon.appendTo(scoreBar);
    }

  }


  function closeLocationInfoModal() {
    $('#location-info-modal').css("display", "none");
  }


  function closeSearch () {
    $('#search-box').css('display', 'none');
    $('#search-button').css('display', 'inline-block');
    $('#search-empty').css('display', 'none');

    $('#update').removeClass('search-result');

    //$('#button-close-search').css('display', 'none');

    $('.loader').css('display', 'block');
    isSearchResults = false;
    if(sessionStorage.getItem('cards')) {
      cardsArray = JSON.parse(sessionStorage.getItem('cards'));
      populateCards(true);
    } else {
      refresh();
    }
  }





  //Search
  $('#search-button').click(function() {
    if ($('#search-box').css('display') == 'none') {
      $('#search-box').css('display', 'inline-block');
      $('#search-button').css('display', 'none');
      $('#autocomplete').val("");
      $('#autocomplete').focus();
      //$('#button-close-search').css('display', 'inline-block');
    } else {
      /*var place = autocomplete.getPlace();
      if (!place) {

      } else {
        console.log(place['formatted_address']);
        var locationString = place['formatted_address'];
        Backend.search(userID, locationString, function(err, data) {
          console.log(data);
          cardsArray = data.cards;
          populateCards(true);
        });
      }*/
    }
  });

  google.maps.event.addListener(autocomplete, 'place_changed', onSearchRequested);

  function onSearchRequested() {
    var place = autocomplete.getPlace();
    if (!place) {

    } else {
      console.log(place['formatted_address']);
      var locationString = place['formatted_address'];
      ga('send', 'event', 'Search', locationString, sessionStorage.getItem('userID'));

      history.pushState(null, null, "search");
      window.addEventListener("popstate", function(e) {
          closeSearch();
      });

      Backend.search(userID, locationString, function(err, data) {
        $('.loader').css('display', 'none');
        console.log(data);
        cardsArray = data.cards;
        if(cardsArray.length == 0) {
          $('#search-empty').css('display', 'block');
        }
        $('#update').addClass('search-result');
        populateCards(true);
        isSearchResults = true;
      });
    }
  }



  //Infinite Scroll
  var loading = false;
  $(window).scroll(loadMore);

  function loadMore () {
    if(loading == true) {
      return;
    }

    if(isSearchResults == true) {
      return;
    }

    if($(window).scrollTop() > $(document).height()*0.8) {
      loading = true;
      console.log("Loading More");
      //Backend.getCards(cardsArray.length, "589593bbac48cd73cb0811aa", userLocation.lat, userLocation.lng, function(data) {
      Backend.getCards(cardsArray.length, userID, userLocation.lat, userLocation.lng, function(data) {
        if(data.cards.length == 0) {
          $(window).scroll(null);
          $('.loader').css('display', 'none');
          return;
        }
        console.log("New Cards");
        var newIdx = cardsArray.length;
        cardsArray = cardsArray.concat(data.cards);
        sessionStorage.setItem("cards", JSON.stringify(cardsArray));
        populateCards(false, newIdx);
        loading = false;
      });

    }
  }





  function getCard(cardID) {
    for (var i=0; i<cardsArray.length;i++) {
      if (cardsArray[i]._id == cardID) {
        return cardsArray[i];
      }
    }
  }


  function getCardIdx(cardID) {
    for (var i=0; i<cardsArray.length;i++) {
      if (cardsArray[i]._id == cardID) {
        return i;
      }
    }
  }

  /*$(window).unload(function(){
    console.log("Going Away");
    var i;
    var seenCards = [];
    for (i=0;i<cardsArray.length;i++) {
      var id = cardsArray[i]._id;
      seenCards.push(id);
      var element = $('#like_button_'+id);
      if(element.offset().top > $(window).scrollTop() + $(window).height()) {
        console.log(i-1);
        break;
      }
    }


    var data = {user_id: userID, cards: seenCards};
    var headers = {type : 'application/x-www-form-urlencoded'};
    var blobData = new Blob([$.param(data)], headers);
    navigator.sendBeacon('https://backend.travscapade.com:443/api/seenCard', blobData);

    //Backend.registerSeenCards(userID, seenCards);
  });*/


}); //document ready



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: destination,
    zoom: 4
  });
}


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

$(document).ready(function() {

  var locations = [];
  var currIdx = 0;

  //var userID = sessionStorage.getItem('userID');
  var userID = "594fc842ac75b7b539dd35da";

  Backend.adminGetLocations(userID, function(err, res) {
    if(err) {
      console.log(err);
    } else  {
      console.log(res);
      locations = res.locations;
      populateInfo(locations[currIdx]);
    } 
  })

  $('#next').click(function() {
    currIdx++;
    populateInfo(locations[currIdx]);
  });


  $('#override').click(function() {
    if(document.getElementById('summary-override').value != "") {
      locations[currIdx].summary = document.getElementById('summary-override').value;
    }
    if(document.getElementById('link-override').value != "") {
      locations[currIdx].link = document.getElementById('link-override').value;
    }
    Backend.adminUpdateLocation(locations[currIdx], function(err, res) {
      if(err) {

      } else {
        document.getElementById('summary-override').value = "";
        document.getElementById('link-override').value = "";
        //currIdx++;
        //populateInfo(locations[currIdx]);
      }
    })
  });



  function populateInfo(locationObject) {
    //Get Info 


    /*google.maps.event.trigger(map, "resize");
    if(marker)
      marker.setMap(null);
    //map.clearOverlays();
    destination = {lat: card.latitude, lng: card.longitude};
    marker = new google.maps.Marker({
      position: destination,
      map: map
    });
    map.panTo(destination);*/
   




    $('#location-info-name').html(locationObject.name);
    
    if(locationObject.summary == "") {
      $('#location-info-summary').html("No Summary Available");
      $('#location-info-link').html("No Link");
    } else {
      $('#location-info-summary').html(locationObject.summary);
      $('#location-info-link').html(locationObject.link);
      $('#location-info-link').attr("href", locationObject.link);
    }




    /*var monthNames = ['Jan', 'Feb', 'Mar', "Apr", "May", "Jun", 'Jul', 'Aug', 'Sep', "Oct", 'Nov', 'Dec'];
    var scoreBar = $('#score-bar');
    scoreBar.empty();
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
    
    */


  }



});
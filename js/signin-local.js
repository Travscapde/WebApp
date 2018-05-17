function onLogin (name, password, email, type, id, ppURL) {
  console.log('Logged in.' + ' name ' + name + ' email ' + email, + ' type ' + type + ' id ' + id + ' ppurl ' + ppURL);

  Backend.getUser(name, password, email, type, id, ppURL, function(err, user) {
    if (err) {
      window.alert("Failed to Sign in");
    } else {
      console.log(user);
      var id = user._id;
      sessionStorage.setItem('isLogged','true');
      sessionStorage.setItem('login-type', type);
      sessionStorage.setItem('userID', id);
      sessionStorage.setItem("user", JSON.stringify(user));
      getMasterInterestList();
    }
  });
}


function getMasterInterestList() {
  Backend.getInterests(function(interestListString) {
    sessionStorage.setItem('interestList', interestListString); //String
    //console.log(sessionStorage.getItem('interestList'));
    //window.location = "file:///C:/Travscapade/Trav_Site/index.html";
    window.location = "/Users/hassan/Desktop/Travscapade/Trav_Site/index.html";
  })
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

/*function onSignIn(googleUser) {
  //var authResponse = googleUser.getAuthResponse(true);
  //console.log(authResponse);
  //console.log(authResponse.access_token);
  var id_token = googleUser.getAuthResponse().id_token;
  sessionStorage.setItem('token', id_token);

  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  onLogin(profile.getName(), profile.getEmail(), "google", profile.getId(), profile.getImageUrl());

}


var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '244135627049-amvb3pkpavrrqthk7tlocma5lvsoc0un.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('g-login-btn'));
  });
};

  function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {}, onSignIn, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
  */






$(document).ready(function() {

  //test
  //onLogin("Hassan Ali Askari", null, "sunny_the_mastermind@hotmail.com");
  //onLogin("Hassan Askari", null, "hassan.ali.askari@gmail.com");
  onLogin ("Travscapade App", null, "travscapade@gmail.com");

});

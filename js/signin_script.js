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
    window.location = "/index.html";
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

function onSignIn(googleUser) {
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

  onLogin(profile.getName(), null, profile.getEmail(), "google", profile.getId(), profile.getImageUrl());

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






$(document).ready(function() {

  //test
  //onLogin("Hassan Ali Askari", null, "sunny_the_mastermind@hotmail.com");

  var email, password, name, password_confirm;

  //Setup Inputs
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


  //Custom Login
  $('#login-button').click(function() {
    email = $('#email-input').val();
    if (email == "") {
      window.alert("Please Enter Email Address");
    }
    password = $('#password-input').val();
    if (password == "") {
      window.alert("Please Enter Password");
    }

    Backend.loginCustomUser(password, email, function(err, user) {
      if (err) {
        window.alert("Wrong username and/or password");
      } else {
        console.log(user);
        var id = user._id;
        sessionStorage.setItem('isLogged','true');
        sessionStorage.setItem('login-type', 'custom');
        sessionStorage.setItem('userID', id);
        sessionStorage.setItem("user", JSON.stringify(user));
        getMasterInterestList();
      }
    });

  });

  //Register
  $('#register-button').click(function() {
    email = $('#email-input').val();
    if (email == "") {
      window.alert("Please Enter Email Address");
      return;
    }
    password = $('#password-input').val();
    if (password == "") {
      window.alert("Please Enter Password");
      return;
    }

    $('#register').css('display', 'block');

  });

  $('#register-cancel-button').click(function() {
    $('#register').css('display', 'none');
  })


  //Register Confirm
  $('#register-confirm-button').click(function() {
    name = $('#name-input').val();
    if (name == "") {
      window.alert("Please Enter Your Name");
      return;
    }
    password_confirm = $('#password-confirm-input').val();
    if (password_confirm == "") {
      window.alert("Please Confirm Your Password");
      return;
    }
    if (password_confirm != password) {
      window.alert("Password does not match");
      return;
    }

    $('#register').css('display', 'none');

    Backend.registerCustomUser(name, password, email, function(err, user) {
      if (err) {
        window.alert("Failed to Register");
      } else {
        console.log(user);
        var id = user._id;
        sessionStorage.setItem('isLogged','true');
        sessionStorage.setItem('login-type', 'custom');
        sessionStorage.setItem('userID', id);
        sessionStorage.setItem("user", JSON.stringify(user));
        getMasterInterestList();
      }
    });
  });

  startApp();

  var qParams = getUrlVars();
  console.log(qParams['state']);

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=495600770631539";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


  window.fbAsyncInit = function() {
    FB.init({
      appId      : '495600770631539',
      xfbml      : true,
      version    : 'v2.9'
    });
    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
      console.log(response);
      if (response.status === 'connected') {
        if (qParams['state'] == 'logout') {
          console.log('logging out');
          FB.logout(function(response) {
            console.log('logged out');
          });
        } else {
          sessionStorage.setItem('token', response.authResponse.accessToken);
          FB.api('/me', {fields: 'name, email, id, picture'}, function(response) {
              console.log(response);
              var ppUrl = "https://graph.facebook.com/" + response.id + "/picture?type=large";
              onLogin(response.name, null, response.email, "fb", response.id, ppUrl);
          });
        }
      }
      //else {
      $('#fb-login-button').click(function() {
        console.log('login clicked');
        FB.login(function(response){
          console.log(response);
          sessionStorage.setItem('token', response.authResponse.accessToken);
          FB.api('/me', {fields: 'name, email, id, picture'}, function(response) {
              console.log(response);
              var ppUrl = "https://graph.facebook.com/" + response.id + "/picture?type=large";
              onLogin(response.name, null, response.email, "fb", response.id, ppUrl);
          });
        }, {scope: 'public_profile,email'});
      });
      /*$("#fb-login-button").click(function () {
        FB.login(function(response) {
          console.log(response);
          sessionStorage.setItem('token', response.authResponse.accessToken);
          onLogin(response.name, null,  response.email);
        }, {scope: 'name, email, id, picture'});
      });*/
      //}

    });

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



  setTimeout(function() {
    $("#hill1").removeClass("border-no-fill");
  },0);

  setTimeout(function() {
    $("#hill2").removeClass("border-no-fill");
  },500);

  setTimeout(function() {
    $("#mountain").removeClass("border-no-fill");
  },800);

  setTimeout(function() {
    $("#rect-bg").removeClass("border-no-fill");
  },1200);

  setTimeout(function() {
    $("#sun2").removeClass("border-no-fill");
  },1400);

  setTimeout(function() {
    $("#sun1").removeClass("border-no-fill");
  },2000);
});

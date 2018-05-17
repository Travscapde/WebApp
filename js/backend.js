var Backend = (function() {

  var url = "https://backend.travscapade.com:443/api/";
  //var url = "http://54.169.51.25/api/";
  //var url = 'localhost:8080/api/';

  function getUser(name, password, userEmail, type, id, ppURL, callback) {
  var req = new XMLHttpRequest();
  req.open('POST', url + "registerUser", true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify({name:name, password: password, email:userEmail, profile_pic:ppURL, type:type}));
  req.onreadystatechange = processRequest

   function processRequest(e) {
      if (req.readyState == 4 ) {
        console.log(req.statusText);
        if (req.status == 200) {
          console.log(req.response);
          var res = JSON.parse(req.response);
          if ('user_id' in res && 'user' in res) {
            callback(null, res.user);
          } else {
            callback('err');
          }
        }
      }
    }
  }


  function registerCustomUser(name, password, userEmail, callback) {
  var req = new XMLHttpRequest();
  req.open('POST', url + "registerCustomUser", true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify({name:name, password: password, email:userEmail}));
  req.onreadystatechange = processRequest

   function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          if ('user_id' in res && 'user' in res) {
            callback(null, res.user);
          } else {
            callback('err');
          }
        }
      }
    }
  }


  function loginCustomUser(password, userEmail, callback) {
  var req = new XMLHttpRequest();
  req.open('POST', url + "loginCustomUser", true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify({password: password, email:userEmail}));
  req.onreadystatechange = processRequest

   function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          if ('user_id' in res && 'user' in res) {
            callback(null, res.user);
          } else {
            callback('err');
          }
        }
      }
    }
  }


  function getCards(len, userID, lat, lng, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "getCards", true);
     req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, start_idx:len, latitude:lat, longitude:lng}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        console.log(req.statusText);
        if (req.status == 200) {
          //console.log(req.response);
          var res = JSON.parse(req.response);
          callback(res);
        }
      }
    }
  }


function getInterests(callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url + "getInterests", true);
    req.send();
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        console.log(req.statusText);
        if (req.status == 200) {
          //var res = JSON.parse(req.response);
          //var interestList = res['interests'];
          //console.log(interestList[0]);
          callback(req.response);
        }
      }
    }
  }



  function getUserPictureCount(userID, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', url + "getUserPhotoCount", true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify({user_id:userID}));
      req.onreadystatechange = processRequest

      function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            var res = JSON.parse(req.response);
            console.log(res);
            var count = res['count'];
            if(count>=0) {
              callback(null, count);
            } else {
              callback("Cannot get picture count", null);
            }
          }
        }
      }
    }


    function postPictureCard(userID, pictureUrl, heading, locationID, location, latitude, longitude, interest, description, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "registerCard", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var param = {
      user_id:userID,
      card_type:"photo",
      url:pictureUrl,
      title:heading,
      location_id:locationID,
      location:location,
      latitude:latitude,
      longitude:longitude,
      interests:[interest],
      description:description
    };
    req.send(JSON.stringify(param));
    req.onreadystatechange = processRequest

     function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            var res = JSON.parse(req.response);
            if('saved_card' in res) {
              callback(null, res.saved_card);
            } else {
              callback("err");
            }
          }
        }
      }
    }


    function getLinkPreview(link, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', url + "getLinkPreview", true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify({link:link}));
      req.onreadystatechange = processRequest

      function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            var res = JSON.parse(req.response);
            callback(null, res);
          } else {
            callback("err");
          }
        }
      }
    }



    function postBlogCard(userID, blogUrl, blogTitle, blogExtract, thumbnailUrl, selectedInterests, locationID, locationString, latitude, longitude, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "registerCard", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var param = {
      user_id:userID,
      card_type:"blog",
      url:blogUrl,
      title:blogTitle,
      thumbnail:thumbnailUrl,
      description:blogExtract,
      interests:selectedInterests,
      location_id:locationID,
      location:locationString,
      latitude:latitude,
      longitude:longitude,
    };
    req.send(JSON.stringify(param));
    req.onreadystatechange = processRequest

     function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            //console.log(req.response);
            var res = JSON.parse(req.response);
            if('saved_card' in res) {
              callback(null, res.saved_card);
            } else {
              callback("err");
            }
          }
        }
      }
    }



    function getBucketList(userID, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', url + "getBucketList", true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify({user_id:userID}));
      req.onreadystatechange = processRequest

      function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            var res = JSON.parse(req.response);
            console.log(res);
            if(res.bucket_list) {
              callback(null, res.bucket_list);
            } else {
              callback("err");
            }
          } else {
            callback("err");
          }
        }
      }
    }


    function getUserCards(userID, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', url + "getUserCards", true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify({user_id:userID}));
      req.onreadystatechange = processRequest

      function processRequest(e) {
        if (req.readyState == 4 ) {
          console.log(req.statusText);
          if (req.status == 200) {
            var res = JSON.parse(req.response);
            var pictureCards = [];
            /*res.cards.forEach(function(card) {
              if (card.card_type =='photo') {
                pictureCards.push(card);
              }
            });*/

            callback(null, res.cards);
          } else {
            callback("err");
          }
        }
      }
    }


  function updateUserInterests(userID, interestList, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "registerInterests", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, interests:interestList}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          callback(null);
        } else {
          callback("err");
        }
      }
    }
  }


  function registerLikeCard(userID, cardID) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "likeCard", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, card_id:cardID}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
        } else {
        }
      }
    }
  }



  function registerBucketCard(userID, cardID) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "addToBucket", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, card_id:cardID}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
        } else {
        }
      }
    }
  }



  function search(userID, locationString, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "search", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, location:locationString}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          callback(null, res);
        } else {
          callback(err);
        }
      }
    }
  }


  function registerNationality(userID, nationality, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "registerNationality", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, nationality:nationality}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          console.log(req.response);
          callback();
        } else {
        }
      }
    }
  }

  function getUserInfo(userID, callback) {
    var req = new XMLHttpRequest();
    //req.open('POST', "http://localhost:8080/api/" + "getUserInfo", true);
    req.open('POST', url + "getUserInfo", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          callback(null, res);
        } else {
          callback(err);
        }
      }
    }
  }


  function updateUserLocation(userID, lat, lng, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "updateLocation", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, lat: lat, lng: lng}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          if('user_id' in res) {
            callback(null);
          } else {
            callback("err");
          }
        } else {
          callback("err");
        }
      }
    }
  }



  function adminGetLocations(userID, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', "http://localhost:8080/api/" + "adminGetLocations", true);
    //req.open('POST', url + "adminGetLocations", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          callback(null, res);
        } else {
          callback(err);
        }
      }
    }
  }


  function adminUpdateLocation(locationObj, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', "http://localhost:8080/api/" + "adminUpdateLocation", true);
    //req.open('POST', url + "adminUpdateLocation", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({location_obj:locationObj}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          callback(null, res);
        } else {
          callback(err);
        }
      }
    }
  }


  function registerSeenCards(userID, seenCards) {
    var req = new XMLHttpRequest();
    req.open('POST', url + "seenCard", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({user_id:userID, cards:seenCards}));
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
        } else {
        }
      }
    }
  }


  function uploadImage(pictureIdx, fileName, file, callback) {
    console.log(fileName);
    var req = new XMLHttpRequest();
    req.open('POST', url + "uploadImage", true);
    var formData = new FormData();
    formData.append("image_file", file, fileName);
    req.send(formData);
    req.onreadystatechange = processRequest

    function processRequest(e) {
      if (req.readyState == 4 ) {
        if (req.status == 200) {
          var res = JSON.parse(req.response);
          console.log(res);
          callback(null, res);
        } else {
          callback(err);
        }
      }
    }
  }



  return {
    getUser: getUser,
    registerCustomUser: registerCustomUser,
    loginCustomUser: loginCustomUser,
    getCards: getCards,
    getInterests: getInterests,
    getUserPictureCount: getUserPictureCount,
    postPictureCard: postPictureCard,
    getLinkPreview: getLinkPreview,
    postBlogCard:postBlogCard,
    getBucketList:getBucketList,
    getUserCards:getUserCards,
    updateUserInterests:updateUserInterests,
    registerLikeCard:registerLikeCard,
    registerBucketCard:registerBucketCard,
    search:search,
    registerNationality:registerNationality,
    getUserInfo:getUserInfo,
    updateUserLocation:updateUserLocation,
    adminGetLocations:adminGetLocations,
    adminUpdateLocation:adminUpdateLocation,
    registerSeenCards:registerSeenCards,
    uploadImage: uploadImage,
  }


})();
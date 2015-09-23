'use strict';

angular.module('stranded.services', ['ngResource'])
  .factory('sessionsApi', function($resource, $window, ENV){
    var sessionsApi = $resource('', {}, {
      'createSession': {
        method: 'POST',
        url: ENV.apiEndpoint + 'api/sessions',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      'destroySession': {
        method: 'DELETE',
        url: ENV.apiEndpoint + 'api/sessions/:id'
      }
    });
    return {
      createSession: function(data){
        return sessionsApi.createSession(
            {
              'session': data
            }
        );
      },
      destroySession: function(){
        var auth_token = $window.sessionStorage.auth_token;
        delete $window.sessionStorage.auth_token;
        return sessionsApi.destroySession(
            {
              'id': auth_token
            }
        );
      }
    };
  })

  .factory('usersApi', function($resource, ENV){
      var usersApi = $resource('', {}, {
        'viewUser': {
          method: 'GET',
          url: ENV.apiEndpoint + 'api/users/:id',
          isArray: true
        },
        'createUser': {
          method: 'POST',
          url: ENV.apiEndpoint + 'api/users',
          headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
        'deleteUser': {
          method: 'DELETE',
          url: ENV.apiEndpoint + 'api/users/:id'
        }
      });
      return {
        viewUser: function(data){
          return usersApi.viewUser(data);
        },
        createUser: function(data){
          return usersApi.createUser(
              {
                'user': data
              }
          );
        },
        updateUser: function(data, auth_token){
          var updateUserApi = $resource(ENV.apiEndpoint + 'api/users/', {'user': data}, {
            'updateUser': {
              method: 'PATCH',
              url: ENV.apiEndpoint + 'api/users/:id',
              headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': auth_token
              }
            }
          });
          return updateUserApi.updateUser();
        },
        deleteUser: function(data){
          return usersApi.deleteUser(data);
        }
      };
    })

  .factory('bottlesApi', function($resource, $window, ENV){
    var auth_token;
    if($window.sessionStorage.auth_token) {
      auth_token = $window.sessionStorage.auth_token;
    }
    console.log(auth_token);
    var bottlesApi = $resource('', {}, {
      'getCurrentBottle': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/bottles/current_bottle',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'replyCurrentBottle': {
        method: 'POST',
        url: ENV.apiEndpoint + 'api/bottles/reply',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'fishBottle': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/bottles/fish',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'createBottle': {
        method: 'POST',
        url: ENV.apiEndpoint + 'api/bottles',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'releaseBottle': {
        method: 'PUT',
        url: ENV.apiEndpoint + 'api/bottles/release',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'getMyBottles': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/bottles/my_bottles',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'viewBottle': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/bottles/view/:bottle_id',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'addStar': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/stars/add/:message_id',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      }
    });
    return {
      getCurrentBottle: bottlesApi.getCurrentBottle,
      replyCurrentBottle: function(data){
        var reply = {
          reply: data
        };
        return bottlesApi.replyCurrentBottle(reply);
      },
      fishBottle: function(){
        return bottlesApi.fishBottle();
      },
      createBottle: function(data){
        var bottle = {
          bottle: data
        };
        return bottlesApi.createBottle(bottle);
      },
      releaseBottle: function(){
        return bottlesApi.releaseBottle();
      },
      getMyBottles: function(){
        return bottlesApi.getMyBottles();
      },
      viewBottle: function(arg){
        var data = {
          bottle_id: arg
        };
        return bottlesApi.viewBottle(data);
      },
      addStar: function(arg){
        var target = {
          message_id: arg
        };
        console.log(target);
        return bottlesApi.addStar(target);
      }
    };
  });

'use strict';

angular.module('stranded.services', ['ngResource'])
  .service('authService', function($http, $q, session, ENV) {
    /**
     * Check whether the user is logged in
     * @returns boolean
     */
    this.isLoggedIn = function () {
      if (session.getAuthToken() !== null) {
        var config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
            'Authorization': session.getAuthToken()
          }
        };
        $http
          .get(ENV.apiEndpoint + 'api/sessions/verify', config)
          .then(function() {
            return true;
          },
          function() {
            return false;
          });
      } else {
        return false;
      }
    };

    /**
     * Log in
     *
     * @param credentials
     * @returns {*|Promise}
     */
    this.logIn = function(credentials){
      return $http
        .post(ENV.apiEndpoint + 'api/sessions', {'session': credentials})
        .then(function(response){
          console.log('newlogin', response);
          var data = response.data;
          session.setAuthToken(data.auth_token);

          return data.auth_token;
        }, function(error){
          return $q.reject(error);
        });
    };

    /**
     * Log out
     * @returns {*|Promise}
     */
    this.logOut = function(){
      return $http
        .delete(ENV.apiEndpoint + 'api/sessions/:id', {'id': session.getAuthToken()})
        .then(function(){

          // Destroy session in the browser
          session.destroy();
        });
    };
  })

  .service('session', function(localStorageService) {
    this._auth_token = localStorageService.get('auth_token');

    this.getAuthToken = function(){
      return this._auth_token;
    };

    this.setAuthToken = function(auth_token){
      this._auth_token = auth_token;
      localStorageService.set('auth_token', auth_token);
      return this;
    };

    /**
     * Destroy session
     */
    this.destroy = function destroy(){
      localStorageService.clearAll();
    };
  })

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
      'starMessage': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/stars/message/:message_id',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'starBottle': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/stars/bottle/:bottle_id',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'unstarMessage': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/stars/unstar_message/:message_id',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': auth_token
        }
      },
      'unstarBottle': {
        method: 'GET',
        url: ENV.apiEndpoint + 'api/stars/unstar_bottle/:bottle_id',
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
      starMessage: function(arg){
        var target = {
          message_id: arg
        };
        console.log(target);
        return bottlesApi.starMessage(target);
      },
      starBottle: function(arg){
        var target = {
          bottle_id: arg
        };
        console.log(target);
        return bottlesApi.starBottle(target);
      },
      unstarMessage: function(arg){
        var target = {
          message_id: arg
        };
        console.log(target);
        return bottlesApi.unstarMessage(target);
      },
      unstarBottle: function(arg){
        var target = {
          bottle_id: arg
        };
        console.log(target);
        return bottlesApi.unstarBottle(target);
      }
    };
  });

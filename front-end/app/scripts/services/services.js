'use strict';

angular.module('stranded.services', ['ngResource'])
  .service('authService', function($rootScope, $http, $q, session, ENV) {
    /**
     * Check whether the user is logged in
     * @returns {*|Promise}
     */
    this.isLoggedIn = function () {
      var defer = $q.defer();

      if (session.getAuthToken() !== null) {
        if ($rootScope.online) {
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
              // console.log('verified');
              defer.resolve(true);
            },
            function() {
              // console.log('not verified');
              defer.reject();
            });
        } else {
          // console.log('has auth_token, but offline');
          defer.resolve(true);
        }
      } else {
        defer.reject();
      }
      return defer.promise;
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
          // console.log('newlogin', response);
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
      this._auth_token = null;
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

  .factory('bottlesApi', function($resource, $rootScope, session, ENV){
    return {
      getCurrentBottle: function() {
        var bottleApi = $resource('', {}, {
          'getCurrentBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/bottles/current_bottle',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        return bottleApi.getCurrentBottle();
      },
      replyCurrentBottle: function(data){
        var bottleApi = $resource('', {}, {
          'replyCurrentBottle': {
            method: 'POST',
            url: ENV.apiEndpoint + 'api/bottles/reply',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var reply = {
          reply: data
        };
        return bottleApi.replyCurrentBottle(reply);
      },
      fishBottle: function(){
        var bottleApi = $resource('', {}, {
          'fishBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/bottles/fish',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        return bottleApi.fishBottle();
      },
      createBottle: function(data){
        var bottleApi = $resource('', {}, {
          'createBottle': {
            method: 'POST',
            url: ENV.apiEndpoint + 'api/bottles',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var bottle = {
          bottle: data
        };
        return bottleApi.createBottle(bottle);
      },
      releaseBottle: function(){
        var bottleApi = $resource('', {}, {
          'releaseBottle': {
            method: 'PUT',
            url: ENV.apiEndpoint + 'api/bottles/release',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        return bottleApi.releaseBottle();
      },
      getMyBottles: function(){
        var bottleApi = $resource('', {}, {
          'getMyBottles': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/bottles/my_bottles',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        return bottleApi.getMyBottles();
      },
      viewBottle: function(arg){
        var bottleApi = $resource('', {}, {
          'viewBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/bottles/view/:bottle_id',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var data = {
          bottle_id: arg
        };
        return bottleApi.viewBottle(data);
      },
      starMessage: function(arg){
        var bottleApi = $resource('', {}, {
          'starMessage': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/stars/message/:message_id',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var target = {
          message_id: arg
        };
        // console.log(target);
        return bottleApi.starMessage(target);
      },
      starBottle: function(arg){
        var bottleApi = $resource('', {}, {
          'starBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/stars/bottle/:bottle_id',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var target = {
          bottle_id: arg
        };
        // console.log(target);
        return bottleApi.starBottle(target);
      },
      unstarMessage: function(arg){
        var bottleApi = $resource('', {}, {
          'unstarMessage': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/stars/unstar_message/:message_id',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var target = {
          message_id: arg
        };
        // console.log(target);
        return bottleApi.unstarMessage(target);
      },
      unstarBottle: function(arg){
        var bottleApi = $resource('', {}, {
          'unstarBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/stars/unstar_bottle/:bottle_id',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': session.getAuthToken()
            }
          }
        });
        var target = {
          bottle_id: arg
        };
        // console.log(target);
        return bottleApi.unstarBottle(target);
      }
    };
  });

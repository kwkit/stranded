'use strict';

angular.module('stranded.services', ['ngResource'])
  .factory('sessionsApi', function($resource, ENV){
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
      destroySession: function(data){
        return sessionsApi.destroySession(
            {
              'id': data.auth_token
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

  .factory('bottlesApi', function($resource, ENV){
    return {
      fishBottle: function(auth_token){
        var fishBottleApi = $resource(ENV.apiEndpoint + 'api/bottles/', {}, {
          'fishBottle': {
            method: 'GET',
            url: ENV.apiEndpoint + 'api/bottles/fish',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': auth_token
            }
          }
        });
        return fishBottleApi.fishBottle();
      }
    };
  });

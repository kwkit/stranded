'use strict';

angular.module('starter.services', ['ngResource'])
  .factory('sessionsApi', function($resource){
    var sessionsApi = $resource('', {}, {
      'createSession': {
        method: 'POST',
        url: 'http://api.lvh.me:3000/sessions',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }
      },
      'destroySession': {
        method: 'DELETE',
        url: 'http://api.lvh.me:3000/sessions/:id'
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

  .factory('usersApi', function($resource){
      var usersApi = $resource('', {}, {
        'viewUser': {
          method: 'GET',
          url: 'http://api.lvh.me:3000/users/:id',
          isArray: true
        },
        'createUser': {
          method: 'POST',
          url: 'http://api.lvh.me:3000/users',
          headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
          }
        },
        'deleteUser': {
          method: 'DELETE',
          url: 'http://api.lvh.me:3000/users/:id',
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
          var updateUserApi = $resource('http://api.lvh.me:3000/users/', {'user': data}, {
            'updateUser': {
              method: 'PATCH',
              url: 'http://api.lvh.me:3000/users/:id',
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
    });

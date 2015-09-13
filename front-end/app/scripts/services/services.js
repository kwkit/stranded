'use strict';

angular.module('starter.services', ['ngResource'])
  .factory('sessionsApi', function($resource){
    var sessionsApi = $resource('', {}, {
      'createSession': {
        method: 'POST',
        url: 'api.localhost:3000/sessions',
        isArray: true
      },
      'destroySession': {
        method: 'DELETE',
        url: 'api.localhost:3000/sessions/:id'
      }
    });
    return {
      createSession: function(data) {
        return sessionsApi.createSession(data);
      },
      destroySession: function(data){
        return sessionsApi.destroySession(data);
      }
    };
  });

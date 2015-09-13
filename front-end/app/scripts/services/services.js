'use strict';

angular.module('starter.services', ['ngResource'])
  .factory('sessionsApi', function($resource){
    var sessionsApi = $resource('', {}, {
      'createSession': {
        method: 'POST',
        url: 'http://api.lvh.me:3000/sessions',
        isArray: true
      },
      'destroySession': {
        method: 'DELETE',
        url: 'http://api.lvh.me:3000/sessions/:id'
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

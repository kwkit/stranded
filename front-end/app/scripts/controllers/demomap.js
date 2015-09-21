'use strict';

angular.module('stranded.controllers')
  .controller('DemoMapCtrl', function($scope) {
    $scope.fakeBottle = {
      'message': 'Have you ever wondered why the sea is blue?',
      'author': 'Curious Cat',
      'latitude': null,
      'longitude': null,
      'created_at': '2015-09-21T09:02:17.669Z',
      'messages': [
        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Smart boy',
          'created_at': '2015-09-21T09:02:17.681Z',
          'latitude': '56',
          'longitude': '73'
        },

        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Stupid boy',
          'created_at': '2015-09-21T11:02:17.681Z',
          'latitude': '26.12',
          'longitude': '62.23'
        },

        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Shiny boy',
          'created_at': '2015-09-21T12:02:17.681Z',
          'latitude': '156',
          'longitude': '72.3'
        },

        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Small boy',
          'created_at': '2015-09-21T19:02:17.681Z',
          'latitude': '-26',
          'longitude': '73.321'
        }
      ]
    };
    var location = [];
    if ($scope.fakeBottle.latitude) {
      location.push({
        'latitude': $scope.fakeBottle.latitude,
        'longitude': $scope.fakeBottle.longitude
      });
    }

    $scope.fakeBottle.messages.forEach(function(message) {
      if (message.latitude) {
        location.push({
          'latitude': message.latitude,
          'longitude': message.longitude
        });
      }
    });
  });

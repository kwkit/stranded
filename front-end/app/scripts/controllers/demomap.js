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
          'latitude': '57.23',
          'longitude': '76.12'
        },

        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Shiny boy',
          'created_at': '2015-09-21T12:02:17.681Z',
          'latitude': '46.123',
          'longitude': '72.3'
        },

        {
          'message': 'Cos the fishes go blu blu blu?',
          'author': 'Small boy',
          'created_at': '2015-09-21T19:02:17.681Z',
          'latitude': '66',
          'longitude': '63.321'
        }
      ]
    };
    $scope.locations = [];
    $scope.paths = [];
    if ($scope.fakeBottle.latitude) {
      $scope.paths.push([
        parseFloat($scope.fakeBottle.latitude),
        parseFloat($scope.fakeBottle.longitude)
      ]);
      $scope.locations.push($scope.fakeBottle.latitude + ', ' + $scope.fakeBottle.longitude);
    }

    $scope.fakeBottle.messages.forEach(function(message) {
      if (message.latitude) {
        $scope.paths.push([
          parseFloat(message.latitude),
          parseFloat(message.longitude)
        ]);
        $scope.locations.push(message.latitude + ', ' + message.longitude);
      }
    });

    function distanceBetween(lng1, lat1, lng2, lat2) {
      function toRad(number) {
        return number * Math.PI / 180;
      }

      var radius = 6371000; // metres
      var phi1 = toRad(lat1);
      var phi2 = toRad(lat2);
      var deltaPhi = toRad((lat2 - lat1));
      var deltaLamda = toRad((lng2 - lng1));

      var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLamda / 2) * Math.sin(deltaLamda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return radius * c;
    }

    $scope.distance = 0;
    for (var i = 1; i < $scope.paths.length; i++) {
      var location1 = $scope.paths[i];
      var location2 = $scope.paths[i - 1];
      $scope.distance += distanceBetween(location1[1], location1[0], location2[1], location2[0]);
    }

  });

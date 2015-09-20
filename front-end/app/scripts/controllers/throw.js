'use strict';

angular.module('stranded.controllers')
  .controller('ThrowCtrl', function ($scope, bottlesApi) {
    $scope.newMessageData = {};
    $scope.doCreateBottle = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            $scope.newMessageData.latitude = position.coords.latitude;
            $scope.newMessageData.longitude = position.coords.longitude;
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }

      bottlesApi.createBottle($scope.newMessageData).$promise.then(
        function (response) {
          console.log(response);
        },
        function (error) {
          console.log('Error:', error.errors);
        }
      );
    };
  });

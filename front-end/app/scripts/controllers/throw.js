'use strict';

angular.module('stranded.controllers')
  .controller('ThrowCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};
    $scope.clearMessageData = function () {
      $scope.newMessageData = {};
    };
    $scope.doCreateBottle = function () {
      $ionicLoading.show();
      
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
          $scope.newMessageData = {};
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: 'Bottle creation successful!',
            template: 'Bottle thrown back into the sea.'
          }).then(function() {
            $state.go('home');
          });
        },
        function (error) {
          console.log('Error:', error.errors);
        }
      );
    };
  });

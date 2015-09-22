'use strict';

angular.module('stranded.controllers')
  .controller('ThrowCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};
    $scope.clearMessageData = function () {
      $scope.newMessageData = {};
    };
    $scope.doCreateBottle = function (newBottleForm) {
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

      if (newBottleForm.$valid) {
        $ionicLoading.show();
        bottlesApi.createBottle($scope.newMessageData).$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Bottle creation successful!',
              template: 'Bottle thrown into the sea.'
            }).then(function() {
              $scope.newMessageData = {};
              $state.go('home');
            });
          },
          function (error) {
            console.log('Error:', error);
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error: ' + error.status + ' ' + error.statusText,
              template: 'Please try again later.'
            });
          }
        );
      }
    };
  });

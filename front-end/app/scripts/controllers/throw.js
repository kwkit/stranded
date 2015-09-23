'use strict';

angular.module('stranded.controllers')
  .controller('ThrowCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};
    $scope.clearMessageData = function () {
      $scope.newMessageData = {};
    };
    $scope.locationEnable = true;

    $scope.setLocation = function (locationEnable) {
      $scope.locationEnable = locationEnable;
      if ($scope.locationEnable) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $scope.newMessageData.latitude = position.coords.latitude;
              $scope.newMessageData.longitude = position.coords.longitude;
            },
            function (error) {
              $scope.$apply(function () {
                $scope.locationEnable = false;
              });
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  console.log('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  console.log('The request to get user location timed out.');
                  break;
                case error.UNKNOWN_ERROR:
                  console.log('An unknown error occurred.');
                  break;
              }
            }
          );
        } else {
          console.log('Geolocation is not supported by this browser.');
          $scope.$apply(function () {
            $scope.locationEnable = false;
          });
        }
      } else {
        $scope.newMessageData.latitude = null;
        $scope.newMessageData.longitude = null;
      }
    };

    $scope.setLocation($scope.locationEnable);

    $scope.doCreateBottle = function (newBottleForm) {
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

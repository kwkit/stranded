'use strict';

angular.module('stranded.controllers')
  .controller('ThrowCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, localStorageService, bottlesApi) {
    $scope.createBottleFormData = {};

    $scope.clearMessageData = function () {
      $scope.createBottleFormData = {};
    };
    $scope.locationEnable = true;

    $scope.setLocation = function (locationEnable) {
      $scope.locationEnable = locationEnable;
      if ($scope.locationEnable) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $scope.createBottleFormData.latitude = position.coords.latitude;
              $scope.createBottleFormData.longitude = position.coords.longitude;
            },
            function (error) {
              $scope.$apply(function () {
                $scope.locationEnable = false;
              });
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  // console.log('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  // console.log('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  // console.log('The request to get user location timed out.');
                  break;
                case error.UNKNOWN_ERROR:
                  // console.log('An unknown error occurred.');
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
        $scope.createBottleFormData.latitude = null;
        $scope.createBottleFormData.longitude = null;
      }
    };

    $scope.setLocation($scope.locationEnable);

    $scope.doCreateBottle = function (newBottleForm) {
      if (newBottleForm.$valid) {
        if ($rootScope.online) {
          onlineCreateBottle();
        } else {
          offlineCreateBottle();
        }
      }
    };

    function onlineCreateBottle() {
      $ionicLoading.show();
      bottlesApi.createBottle($scope.createBottleFormData).$promise.then(
        function() {
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: 'Bottle creation successful!',
            template: 'Bottle thrown into the sea.'
          }).then(function() {
            $scope.createBottleFormData = {};
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

    function offlineCreateBottle() {
      $ionicLoading.show();
      // console.log('offline now, save user data to submit later');
      localStorageService.set('createBottleFormData', angular.toJson($scope.createBottleFormData));
      $ionicLoading.hide();

      $ionicPopup.alert({
        title: 'Bottle creation successful!',
        template: 'Bottle will be thrown into the sea when you are back online.'
      }).then(function() {
        $scope.createBottleFormData = {};
        $state.go('home');
      });
    }

    $scope.$on('$ionicView.enter', function() {
      if (localStorageService.get('createBottleFormData')) {
        $scope.createBottleFormData = angular.fromJson(localStorageService.get('createBottleFormData'));
      }
    });
  });

'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};
    $scope.locationEnable = true;

    $scope.setLocation = function (locationEnable) {
      $scope.locationEnable = locationEnable;
      if ($scope.locationEnable && $scope.currentBottle) {
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


    $scope.getCurrentBottle = function() {
      bottlesApi.getCurrentBottle().$promise.then(
        function (response) {
          $scope.currentBottle = response.bottle ? response.bottle : null;
          console.log($scope.currentBottle);

          if ($scope.currentBottle) {
            $scope.setLocation($scope.locationEnable);
          }
        },
        function (error) {
          console.log('Error:', error.errors);
        }
      );
    };

    $scope.getCurrentBottle();

    $scope.grabBottle = function () {
      console.log('grabbing bottle');
      if ($scope.currentBottle) {
        console.log('you already have a bottle, this function shouldn\'t be called');
      } else {
        $ionicLoading.show();
        bottlesApi.fishBottle().$promise.then(
          function (response) {
            $ionicLoading.hide();
            $scope.currentBottle = response.bottle;
            $scope.setLocation($scope.locationEnable);
            console.log(response);
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.replyBottle = function (replyBottleForm) {
      console.log('replying bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to reply, this function shouldn\'t be called');
      } else if (replyBottleForm.$valid) {
        $ionicLoading.show();
        bottlesApi.replyCurrentBottle($scope.newMessageData).$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Reply successful!',
              template: 'Bottle thrown back into the sea.'
            }).then(function() {
              $scope.currentBottle = null;
              $scope.newMessageData = {};
              $state.go('home');
            });
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.releaseBottle = function () {
      console.log('releasing bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to release, this function shouldn\'t be called');
      } else {
        $ionicLoading.show();
        bottlesApi.releaseBottle().$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Return successful!',
              template: 'Bottle thrown back into the sea without a new reply.'
            }).then(function() {
              $scope.currentBottle = null;
              $scope.newMessageData = {};
              $state.go('home');
            });
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };
  });

'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.newMessageData = {};

    $scope.getCurrentBottle = function() {
      bottlesApi.getCurrentBottle().$promise.then(
        function (response) {
          $scope.currentBottle = response.bottle ? response.bottle : null;
          console.log($scope.currentBottle);
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
        bottlesApi.fishBottle().$promise.then(
          function (response) {
            $scope.currentBottle = response.bottle;
            console.log(response);
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };

    $scope.replyBottle = function () {
      console.log('replying bottle');

      $ionicLoading.show();

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to reply, this function shouldn\'t be called');
      } else {
        bottlesApi.replyCurrentBottle($scope.newMessageData).$promise.then(
          function (response) {
            console.log(response);
            $scope.currentBottle = null;
            $scope.newMessageData = {};
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Reply successful!',
              template: 'Bottle thrown back into the sea.'
            }).then(function() {
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

      $ionicLoading.show();

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to release, this function shouldn\'t be called');
      } else {
        bottlesApi.releaseBottle().$promise.then(
          function (response) {
            console.log(response);
            $scope.currentBottle = null;
            $scope.newMessageData = {};
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Return successful!',
              template: 'Bottle thrown back into the sea without a new reply.'
            }).then(function() {
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

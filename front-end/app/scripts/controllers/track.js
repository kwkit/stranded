'use strict';

angular.module('stranded.controllers')
  .controller('TrackCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.getMyBottles = function() {
      bottlesApi.getMyBottles().$promise.then(
        function (response) {
          $scope.myBottles = response.bottles;
        },
        function (error) {
          console.log('Error:', error);
        }
      );
    };
    $scope.getMyBottles();
    $scope.trackBottle = function(bottle_id) {
      $state.go('view', {'bottle_id': bottle_id});
    };
  });

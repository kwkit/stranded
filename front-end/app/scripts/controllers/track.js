'use strict';

angular.module('stranded.controllers')
  .controller('TrackCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup,
                                     localStorageService, bottlesApi) {
    $scope.getMyBottles = function() {
      if ($rootScope.online) {
        bottlesApi.getMyBottles().$promise.then(
          function (response) {
            $scope.myBottles = response.bottles;
            localStorageService.set('myBottles', angular.toJson($scope.myBottles));
          },
          function (error) {
            console.log('Error:', error);
          }
        );
      } else {
        if (localStorageService.get('myBottles')) {
          $scope.myBottles = angular.fromJson(localStorageService.get('myBottles'));
        } else {

        }
      }

    };
    $scope.$on('$ionicView.enter', function() {
      $scope.getMyBottles(); 
    });
    
    $scope.trackBottle = function(bottle_id) {
      $state.go('view', {'bottle_id': bottle_id});
    };
  });

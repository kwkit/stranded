'use strict';

angular.module('stranded.controllers')
  .controller('ViewCtrl', function ($scope, $state, $stateParams, $ionicLoading, $ionicPopup, bottlesApi) {
    $scope.viewBottle = function () {
      bottlesApi.viewBottle($stateParams.bottle_id).$promise.then(
        function (response) {
          $scope.bottle = response.bottle;
        },
        function (error) {
          console.log('Error:', error);
        }
      );
    };
    $scope.$on('$ionicView.enter', function() {
      $scope.viewBottle(); 
    });
  });
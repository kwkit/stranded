'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, bottlesApi) {
    bottlesApi.getCurrentBottle().$promise.then(
      function (response) {
        $scope.currentBottle = response.bottle ? response.bottle : null;
        console.log($scope.currentBottle);
      },
      function (error) {
        console.log('Error:', error.errors);
      }
    );

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
  });

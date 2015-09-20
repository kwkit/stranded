'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $rootScope, bottlesApi) {
    bottlesApi.getCurrentBottle().$promise.then(
      function (response) {
        $rootScope.currentBottle = response.bottle ? response.bottle : null;
        console.log($rootScope.currentBottle);
      },
      function (error) {
        console.log('Error:', error.errors);
      }
    );

    $scope.grabBottle = function () {
      console.log('grabbing bottle');
      if ($rootScope.currentBottle) {
        console.log('you already have a bottle, this function shouldn\'t be called');
      } else {
        bottlesApi.fishBottle().$promise.then(
          function (response) {
            $rootScope.currentBottle = response.bottle;
            console.log(response);
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }
    };
  });

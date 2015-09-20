'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, bottlesApi) {

    $scope.grabBottle = function () {
      console.log('grabbing bottle');
      var bottle = bottlesApi.fishBottle().$promise.then(
        function (response) {
          console.log(response);
        },
        function (error) {
          console.log('Error:', error.errors);
        }
      );
    };
  });

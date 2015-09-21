'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, $rootScope, localStorageService, $timeout) {
    console.log($rootScope.session);
    $scope.unbind = localStorageService.bind($scope, 'toolBoxAnimated');
    $scope.pageLoaded = false;
    $scope.$watch('$viewContentLoaded', function() {
      $timeout(function (){
        $scope.pageLoaded = true;
      }, 500);

      if (!$scope.toolBoxAnimated) {
        $timeout(function () {
          $scope.toolBoxAnimated = true;
        }, 1600);
      }
    });
  });

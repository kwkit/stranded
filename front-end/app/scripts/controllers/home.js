'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, $rootScope, localStorageService, $timeout) {
    console.log($rootScope.session);
    $scope.unbind = localStorageService.bind($scope, 'toolBoxAnimated');
    // $scope.toolBoxAnimated = localStorageService.get('toolBoxAnimated');
    console.log($scope.toolBoxAnimated);
    if (!$scope.toolBoxAnimated) {
      $timeout(function () {
        $scope.toolBoxAnimated = true;
      }, 1100);
    }
  });

'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, $rootScope, localStorageService) {
    console.log($rootScope.session);

    console.log(localStorageService.get('ToolBoxAnimated'));
    if (!localStorageService.get('ToolBoxAnimated')) {
      console.log('should animate here');
    }

    localStorageService.set('ToolBoxAnimated', true);
  });

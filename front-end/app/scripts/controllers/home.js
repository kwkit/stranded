'use strict';

angular.module('stranded.controllers')
  .controller('HomeCtrl', function($scope, $rootScope){
    console.log($rootScope.session);
  });

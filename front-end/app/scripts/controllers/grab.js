'use strict';

angular.module('stranded.controllers')
  .controller('GrabCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, bottlesApi, $anchorScroll,
                                    $location, $timeout, $ionicScrollDelegate, localStorageService) {
    $scope.newMessageData = {};
    $scope.locationEnable = true;
    $scope.shouldAnimate = false;

    $scope.distanceBetween = function(lng1, lat1, lng2, lat2) {
      function toRad(number) {
        return number * Math.PI / 180;
      }

      var radius = 6371000; // metres
      var phi1 = toRad(lat1);
      var phi2 = toRad(lat2);
      var deltaPhi = toRad((lat2 - lat1));
      var deltaLamda = toRad((lng2 - lng1));

      var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLamda / 2) * Math.sin(deltaLamda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return radius * c;
    };

    $scope.setLocation = function (locationEnable) {
      $scope.locationEnable = locationEnable;
      if ($scope.locationEnable && $scope.currentBottle) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              $scope.newMessageData.latitude = position.coords.latitude;
              $scope.newMessageData.longitude = position.coords.longitude;
            },
            function (error) {
              $scope.$apply(function () {
                $scope.locationEnable = false;
              });
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  console.log('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  console.log('The request to get user location timed out.');
                  break;
                case error.UNKNOWN_ERROR:
                  console.log('An unknown error occurred.');
                  break;
              }
            }
          );
        } else {
          console.log('Geolocation is not supported by this browser.');
          $scope.$apply(function () {
            $scope.locationEnable = false;
          });
        }
      } else {
        $scope.newMessageData.latitude = null;
        $scope.newMessageData.longitude = null;
      }
    };

    $scope.getCurrentBottle = function() {
      if ($rootScope.online) {
        bottlesApi.getCurrentBottle().$promise.then(
          function (response) {
            $scope.shouldAnimate = false;
            $scope.currentBottle = response.bottle ? response.bottle : null;
            localStorageService.set('currentBottle', angular.toJson($scope.currentBottle));

            if ($scope.currentBottle) {
              $scope.setLocation($scope.locationEnable);
              $scope.getBottleMapData();
            } else {
              console.log('no available bottles to get');
            }
          },
          function (error) {
            if (error.status === 404) {
              $scope.shouldAnimate = true;
              console.log('aa');
              if (!$scope.currentBottle) {
                $timeout(function (){
                  $scope.grabBottle();
                }, 2000);
              }
            }
          }
        );
      } else {
        $scope.currentBottle = angular.fromJson(localStorageService.get('currentBottle'));
        if ($scope.currentBottle) {
          $scope.setLocation($scope.locationEnable);
          $scope.getBottleMapData();
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'You\'re offline!',
            template: 'You need a network connection to fish up a bottle!'
          }).then(function() {
            $state.go('home');
          });
        }
      }
    };

    $scope.grabBottle = function () {
      console.log('grabbing bottle');
      if ($scope.currentBottle) {
        console.log('you already have a bottle, this function shouldn\'t be called');
      } else {
        if ($rootScope.online) {
          $ionicLoading.show();
          bottlesApi.fishBottle().$promise.then(
            function (response) {
              $scope.shouldAnimate = false;
              $ionicLoading.hide();
              $scope.currentBottle = response.bottle;
              $scope.setLocation($scope.locationEnable);
              $scope.getBottleMapData();
            },
            function (error) {
              console.log('Error:', error.errors);
            }
          );
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'You\'re offline!',
            template: 'You need a network connection to fish up a bottle!'
          });
        }
      }
    };

    $scope.getBottleMapData = function () {
      $scope.currentBottle.locations = [];
      $scope.currentBottle.paths = [[]]; // this is a hack
      
      if ($scope.currentBottle.latitude) {
        $scope.currentBottle.paths.push([
          parseFloat($scope.currentBottle.latitude),
          parseFloat($scope.currentBottle.longitude)
        ]);
        $scope.currentBottle.locations.push($scope.currentBottle.latitude + ', ' + $scope.currentBottle.longitude);
      }

      $scope.currentBottle.messages.forEach(function(message) {
        if (message.latitude) {
          $scope.currentBottle.paths.push([
            parseFloat(message.latitude),
            parseFloat(message.longitude)
          ]);
          $scope.currentBottle.locations.push(message.latitude + ', ' + message.longitude);
        }
      });

      $scope.currentBottle.distance = 0;
      $scope.currentBottle.shouldShowMap = false;

      if ($scope.currentBottle.paths.length >= 2) {
        $scope.currentBottle.shouldShowMap = true;
      }

      for (var i = 2; i <= $scope.currentBottle.paths.length - 1; i++) {
        // this is a hack
        var location1 = $scope.currentBottle.paths[i];
        var location2 = $scope.currentBottle.paths[i - 1];
        $scope.currentBottle.distance += $scope.distanceBetween(location1[1], location1[0], location2[1], location2[0]);
      }

      if ($scope.currentBottle.distance === 0) {
        $scope.currentBottle.distanceMessage = 'there is no trail trackable for this bottle.';
      } else if ($scope.currentBottle.distance < 1000) {
        $scope.currentBottle.distanceMessage = 'the bottle has traveled ' + $scope.currentBottle.distance.toFixed(2) + 'm.';
      } else {
        $scope.currentBottle.distanceMessage = 'the bottle has traveled ' + ($scope.currentBottle.distance / 1000).toFixed(2) + 'km.';
      }
    };

    $scope.replyBottle = function (replyBottleForm) {
      function onlineReplyBottle() {
        $ionicLoading.show();
        bottlesApi.replyCurrentBottle($scope.newMessageData).$promise.then(
          function (response) {
            console.log(response);
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Reply successful!',
              template: 'Bottle thrown back into the sea.'
            }).then(function() {
              $state.go('home');
              $scope.currentBottle = null;
              $scope.newMessageData = {};
            });
          },
          function (error) {
            console.log('Error:', error.errors);
          }
        );
      }

      function offlineReplyBottle() {
        $ionicLoading.show();
        console.log('offline now, save user data to submit later');
        localStorageService.set('replyBottleFormData', angular.toJson($scope.newMessageData));
        $ionicLoading.hide();

        $ionicPopup.alert({
          title: 'Reply successful!',
          template: 'Bottle will be thrown into the sea when you are back online.'
        }).then(function() {
          $scope.newMessageData = {};
          $state.go('home');
        });
      }

      console.log('replying bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to reply, this function shouldn\'t be called');
      } else if (replyBottleForm.$valid) {
        if($rootScope.online) {
          onlineReplyBottle();
        } else {
          offlineReplyBottle();
        }
      }
    };

    $scope.releaseBottle = function () {
      console.log('releasing bottle');

      if (!$scope.currentBottle) {
        console.log('you don\'t have a bottle to release, this function shouldn\'t be called');
      } else {
        if ($rootScope.online) {
          $ionicLoading.show();
          bottlesApi.releaseBottle().$promise.then(
            function (response) {
              console.log(response);
              $ionicLoading.hide();

              $ionicPopup.alert({
                title: 'Return successful!',
                template: 'Bottle thrown back into the sea without a new reply.'
              }).then(function() {
                $scope.currentBottle = null;
                $scope.newMessageData = {};
                $state.go('home');
              });
            },
            function (error) {
              console.log('Error:', error.errors);
            }
          );
        } else {
          $ionicPopup.alert({
            title: 'You\'re offline!',
            template: 'You need a network connection to throw back a bottle!'
          });
        }
      }
    };

    $scope.toggleStarMessage = function (message) {
      if ($rootScope.online) {
        console.log(message);
        var request;
        $ionicLoading.show();
        if (!message.starred) {
          request = bottlesApi.starMessage(message.id);
        } else {
          request = bottlesApi.unstarMessage(message.id);
        }

        request.$promise.then(
          function (response) {
            $ionicLoading.hide();
            message.stars = response.message.stars;
            message.starred = response.message.starred;
          },
          function (error) {
            $ionicLoading.hide();
            console.log('Error:', error.errors);
          }
        );
      } else {
        $ionicPopup.alert({
          title: 'You\'re offline!',
          template: 'You need a network connection to star/unstar a message!!'
        });
      }
    };

    $scope.toggleStarBottle = function (bottle) {
      if ($rootScope.online) {
        console.log(bottle);
        var request;
        $ionicLoading.show();
        if (!bottle.starred) {
          request = bottlesApi.starBottle(bottle.id);
        } else {
          request = bottlesApi.unstarBottle(bottle.id);
        }
        request.$promise.then(
          function (response) {
            $ionicLoading.hide();
            bottle.stars = response.bottle.stars;
            bottle.starred = response.bottle.starred;
          },
          function (error) {
            $ionicLoading.hide();
            console.log('Error:', error.errors);
          }
        );
      } else {
        $ionicPopup.alert({
          title: 'You\'re offline!',
          template: 'You need a network connection to star/unstar a bottle!!'
        });
      }
    };

    $scope.goReply = function () {
      $location.hash('reply-form');
      $anchorScroll();
    };

    $scope.$on('$ionicView.enter', function() {
      $ionicScrollDelegate.scrollTop();

      if (!$scope.currentBottle) {
        $scope.getCurrentBottle();
      }
    });

  });

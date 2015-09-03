(function(mohican) {
  'use strict';

  angular
      .module('mohican')
      .provider('mnRouter', [mnRouter]);

  function mnRouter() {
    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;

    var provider = this;
    provider.routes = [];
    provider.stateChangeValidators = [];
    provider.transitionToValidarionAllreadyDone = false;

    provider.init = function($urlRouterProvider, $stateProvider) {
      $urlRouterProviderRef = $urlRouterProvider;
      $stateProviderRef = $stateProvider;
    };

    provider.addResouceRoute = function(definition) {
      provider.routes.push(definition);
    };

    provider.addSimpleRoute = function(definition) {
      provider.addResouceRoute(definition);
    };

    provider.addRedirecRoute = function(definition) {
      provider.routes.push({
        name:       definition.name,
        redirectTo: definition.redirectTo
      });
    };

    provider.$get = ['$stateParams', '$state', '$rootScope', '$q', '$urlRouter', '$window', function($stateParams, $state, $rootScope, $q, $urlRouter, $window) {
      function createAll() {
        var lcs = $rootScope.$on('$locationChangeStart', function (event, next, current) {
          if(provider.transitionToValidarionAllreadyDone === false) {
            var nextWithNoParams = next.split('?')[0];
            var currentWithNoParams = current.split('?')[0];
            var fullStateChanged = nextWithNoParams !== currentWithNoParams;

            var validationMessages = [];
            provider.stateChangeValidators.forEach(function(validator) {
              var validationObject = validator(fullStateChanged, next, current);
              if(validationObject) {
                validationMessages.push(validationObject.message);
              }
            });
            if(validationMessages.length > 0) {
              var allowTransition = $window.confirm(validationMessages.join('/n'));
              if(!allowTransition) {
                event.preventDefault();

                provider.stateChangeValidators.forEach(function(validator) {
                  var validationObject = validator(fullStateChanged, next, current);
                  if(validationObject) {
                    validationObject.reject();
                  }
                });
              }
              else {
                provider.stateChangeValidators.forEach(function(validator) {
                  var validationObject = validator(fullStateChanged, next, current);
                  if(validationObject) {
                    validationObject.resolve();
                  }
                });
              }
            }
          }
          else {
            provider.transitionToValidarionAllreadyDone = false;
          }
        });

        $urlRouterProviderRef.when('', '/');

        var has404 = false;
        provider.routes.forEach(function(route) {
          if(route.name === '404') { has404 = true; }
          mohican.defineMohicanRoute(route, $stateProviderRef);
        });

        if(!has404) {
          $stateProviderRef.state(mohican.toHyphen('404'), {
            url:         '/404',
            templateUrl: 'mohican/templates/404.html'
          });
        }

        var scr = $rootScope.$on('$stateChangeError', function() {
          $state.transitionTo('404', {});
        });

        $urlRouterProviderRef.otherwise('/404');
      }

      function redirectTo(routeName) {
        $state.transitionTo(routeName, $stateParams, {location: 'replace'});
      }

      function transitionTo(routeName, params, options) {
        var deffered  = $q.defer();

        var fullStateChanged = routeName !== this.currenRouteName();

        function resolveTransition(fullStateChanged, routeName, params, options) {
          provider.stateChangeValidators.forEach(function(validator) {
            var validationObject = validator(fullStateChanged, undefined, undefined, params);
            if(validationObject) {
              validationObject.resolve();
            }
          });
          if(options) {
            $state.transitionTo(routeName, params, options).then(function() {
              deffered.resolve();
            });
          }
          else {
            $state.transitionTo(routeName, params).then(function() {
              deffered.resolve();
            });
          }
        }

        var validationMessages = [];
        provider.stateChangeValidators.forEach(function(validator) {
          var validationObject = validator(fullStateChanged, undefined, undefined, params);
          if(validationObject) {
            validationMessages.push(validationObject.message);
          }
        });

        if(validationMessages.length > 0) {
          var allowTransition = $window.confirm(validationMessages.join('/n'));
          if(!allowTransition) {
            provider.stateChangeValidators.forEach(function(validator) {
              var validationObject = validator(fullStateChanged, undefined, undefined, params);
              if(validationObject) {
                validationObject.reject();
              }
              deffered.reject();
            });
          }
          else {
            resolveTransition(fullStateChanged, routeName, params, options);
          }
        }
        else {
          resolveTransition(fullStateChanged, routeName, params, options);
        }

        provider.transitionToValidarionAllreadyDone = true;

        return deffered.promise;
      }

      function pageNotFound() {
        $state.transitionTo('404', {}, {location: 'replace'});
      }

      function addStateChageValidator(validator) {
        provider.stateChangeValidators.push(validator);
      }

      function removeStateChageValidator(validator) {
        var index = provider.stateChangeValidators.indexOf(validator);
        provider.stateChangeValidators.splice(index, 1);
      }

      function currenRouteName() {
        return $state.current.name;
      }

      return {
        createAll:    createAll,
        redirectTo:   redirectTo,
        transitionTo: transitionTo,
        pageNotFound: pageNotFound,
        $stateParams: $stateParams,
        $state:       $state,

        currenRouteName: currenRouteName,

        addStateChageValidator:    addStateChageValidator,
        removeStateChageValidator: removeStateChageValidator
      };
    }];
  }

})(window.mohican);

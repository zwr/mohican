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

    provider.addRedirecRoute = function() {
      var definition = {};
      if(arguments.length === 1) {
        definition.routeName = arguments[0].routeName;
        definition.redirectTo = arguments[0].redirectTo;
      }
      else if(arguments.length === 2) {
        definition.routeName = arguments[0];
        definition.redirectTo = arguments[1];
      }
      else {
        throw 'invalid addRedirecRoute parameters';
      }
      provider.routes.push({
        routeName:  definition.routeName,
        redirectTo: definition.redirectTo
      });
    };

    provider.$get = ['$stateParams', '$state', '$rootScope', '$q', '$urlRouter', '$window', '$location', '$injector',
                    function($stateParams, $state, $rootScope, $q, $urlRouter, $window, $location, $injector) {
      function createAll() {
        $window.onbeforeunload = function(event) {
          if(provider.transitionToValidarionAllreadyDone === false) {
            var validationMessages = [];
            provider.stateChangeValidators.forEach(function(validator) {
              var validationObject = validator(true);
              if(validationObject) {
                validationMessages.push(validationObject.message);
              }
            });
            if(validationMessages.length > 0) {
              event.returnValue = validationMessages.join('\n');
            }
          }
        };
        var lcsuccess = $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
          $window.scrollTo(0,0);
        });
        var lcs = $rootScope.$on('$locationChangeStart', function (event, next, current) {
          if(provider.transitionToValidarionAllreadyDone === false) {
            var nextWithNoParams = next.split('?')[0];
            var currentWithNoParams = current.split('?')[0];
            var fullStateReload = nextWithNoParams !== currentWithNoParams;

            var validationMessages = [];
            provider.stateChangeValidators.forEach(function(validator) {
              var validationObject = validator(fullStateReload, next, current);
              if(validationObject) {
                validationMessages.push(validationObject.message);
              }
            });
            if(validationMessages.length > 0) {
              validationMessages.push('\nLeaving this page all unsaved data and selected document(s) will be lost.');
              var allowTransition = $window.confirm(validationMessages.join('\n'));
              if(!allowTransition) {
                event.preventDefault();

                provider.stateChangeValidators.forEach(function(validator) {
                  var validationObject = validator(fullStateReload, next, current);
                  if(validationObject) {
                    validationObject.reject();
                  }
                });
              }
              else {
                provider.stateChangeValidators.forEach(function(validator) {
                  var validationObject = validator(fullStateReload, next, current);
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
          mohican.defineMohicanRoute(route, $stateProviderRef, $injector);
        });

        if(!has404) {
          $stateProviderRef.state(mohican.toHyphen('404'), {
            url:         '/404',
            templateUrl: 'mohican/templates/404.html'
          });
        }

        var scr = $rootScope.$on('$stateChangeError', function() {
          $state.transitionTo('404', {}, {location: false});
          this.pageNotFound();
        });

        $urlRouterProviderRef.otherwise(function($injector, $location) {
          $state.transitionTo('404', {}, {location: false});
        });
      }

      function redirectTo(routeName) {
        $state.transitionTo(routeName, {}, {location: 'replace'});
      }

      function transitionTo(routeName, params, options) {
        //default values
        if(!params) {
          params = {};
        }
        var deffered  = $q.defer();

        var fullStateReload = routeName !== this.currentRouteName();

        //if backend filter is changed, we assume it is fullStateReload
        //(ex. selected items collection will be destroyed)
        if(params.documentfilter !== $state.params.documentfilter ||
           params.openfilters !== $state.params.openfilters) {
          fullStateReload = true;
        }

        var resolveTransition = function(fullStateReload, routeName, params, options) {
          provider.stateChangeValidators.forEach(function(validator) {
            var validationObject = validator(fullStateReload, undefined, undefined, params);
            if(validationObject) {
              validationObject.resolve();
            }
          });
          $state.transitionTo(routeName, params, options).then(function() {
            deffered.resolve();
          });
        };

        var validationMessages = [];
        provider.stateChangeValidators.forEach(function(validator) {
          var validationObject = validator(fullStateReload, undefined, undefined, params);
          if(validationObject) {
            validationMessages.push(validationObject.message);
          }
        });

        if(validationMessages.length > 0) {
          validationMessages.push('Leaving this page all unsaved data and selected document(s) will be lost.');
          var allowTransition = $window.confirm(validationMessages.join('\n'));
          if(!allowTransition) {
            provider.stateChangeValidators.forEach(function(validator) {
              var validationObject = validator(fullStateReload, undefined, undefined, params);
              if(validationObject) {
                validationObject.reject();
              }
            });
            deffered.reject();
          }
          else {
            resolveTransition(fullStateReload, routeName, params, options);
          }
        }
        else {
          resolveTransition(fullStateReload, routeName, params, options);
        }

        provider.transitionToValidarionAllreadyDone = true;

        return deffered.promise;
      }

      function pageNotFound() {
        $state.transitionTo('404', {}, {location: false});
      }

      function currentRouteType() {
        if(_.endsWith(currentRouteName(), '-doc')) {
          return 'doc';
        }
        else if(_.endsWith(currentRouteName(), '-new')) {
          return 'new';
        }
        else {
          return 'index';
        }
      }

      function addStateChageValidator(validator) {
        provider.stateChangeValidators.push(validator);
      }

      function removeStateChageValidator(validator) {
        var index = provider.stateChangeValidators.indexOf(validator);
        provider.stateChangeValidators.splice(index, 1);
      }

      function currentRouteName() {
        return $state.current.name;
      }

      function currentRouteIndex() {
        var returnValue = $state.current.name;
        if(_.endsWith($state.current.name, '-doc')) {
          returnValue = _.trimRight($state.current.name, '-doc');
        }
        if(_.endsWith($state.current.name, '-new')) {
          returnValue = _.trimRight($state.current.name, '-new');
        }
        return returnValue;
      }

      function currentRouteDoc() {
        return currentRouteIndex() + '-doc';
      }

      provider.setLastIndexStateMachine = function(routeName, stateMachine) {
        provider.lastIndexStateMachine = {};
        provider.lastIndexStateMachine[routeName] = _.cloneDeep(stateMachine);
      };
      provider.getLastIndexStateMachine = function(routeName) {
        if(provider.lastIndexStateMachine) {
          return provider.lastIndexStateMachine[routeName];
        }
        else {
          return undefined;
        }
      };

      return {
        createAll:    createAll,
        redirectTo:   redirectTo,
        transitionTo: transitionTo,
        pageNotFound: pageNotFound,
        $stateParams: function() {
          return $stateParams;
        },

        setLastIndexStateMachine: provider.setLastIndexStateMachine,
        getLastIndexStateMachine: provider.getLastIndexStateMachine,

        $stateParamsSetDocumentfilter: function(value) {
          $stateParams.documentfilter = value;
        },
        $stateParamsSetPage: function(value) {
          $stateParams.page = value;
        },
        $stateParamsSetLayout: function(value) {
          $stateParams.layout = value;
        },
        $stateParamsSetDirection: function(value) {
          $stateParams.direction = value;
        },
        $stateParamsSetActivetab: function(value) {
          $stateParams.activetab = value;
        },

        currentRouteName:  currentRouteName,
        currentRouteIndex: currentRouteIndex,
        currentRouteDoc:   currentRouteDoc,
        currentRouteType:  currentRouteType,

        addStateChageValidator:    addStateChageValidator,
        removeStateChageValidator: removeStateChageValidator
      };
    }];
  }

})(window.mohican);

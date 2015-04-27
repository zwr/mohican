(function(MohicanUtils) {
  'use strict';

  angular
      .module('mohican.routes', []);

  MohicanUtils.routes = [];

  MohicanUtils.makeDefaultServiceResolvers = function() {
    var resolve = {};

    MohicanUtils.routes.forEach(function(routeName) {
      resolve[routeName + 'ServiceResolve'] = [
        routeName + 'Service',
        function (service) {
          return service;
        },
      ];
    });

    return resolve;
  };

  MohicanUtils._mohicanRoute = function(routeName, controller) {
    MohicanUtils.routes.push(routeName);
    return function($stateProvider) {
      $stateProvider.state('base.' + routeName, {
        url: '/' + MohicanUtils.toHyphen(routeName) + '?page&layout',
        templateUrl: 'app/routes/' + routeName + 'Grid.html',
        controller: controller,
        controllerAs: 'ctrl',
      });
    };
  };

  MohicanUtils.defineMohicanRoute = function(routeName, controller, service) {
    angular.module('mohican.routes').
        config(['$stateProvider', MohicanUtils._mohicanRoute(routeName, controller)]);
    angular.module('mohican.services').
        factory(routeName + 'Service', ['mnBaseService', '$http', '$q', service]);
  };

  var _checkDefaultParams = function(params) {
    var newParams = _.clone(params);
    var dirty = false;
    if (newParams.page === '1') {
      newParams.page = undefined;
      dirty = true;
    }
    if (newParams.layout === 'default') {
      newParams.layout = undefined;
      dirty = true;
    }

    return {dirty: dirty, newParams: newParams};
  };

  MohicanUtils.escapeDefaultParameters = function(params) {
    var checkResult = _checkDefaultParams(params);
    return checkResult.newParams;
  };

  MohicanUtils.redirectDefaultParameters = function(params, state) {
    var checkResult = _checkDefaultParams(params);

    if(checkResult.dirty && state) {
      state.go(state.current.name, checkResult.newParams, {reload: true});
    }
  };

  MohicanUtils.injectDefaultParameters = function(params) {
    if (!params.page) {
      params.page = '1';
    }
    if (!params.layout) {
      params.layout = 'default';
    }

    return params;
  };

  MohicanUtils.checkPageParameter = function(page, pagesCount, state, params) {
    if(isNaN(page.toString()) || page < 1 || page > pagesCount) {
      var newRouteParams = _.clone(params);
      newRouteParams.page = '1';
      state.go(state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    }
    else {
      return true;
    }
    return false;
  };

  MohicanUtils.checkLayoutParameter = function(layout, layouts, state, params) {
    var isInList = false;
    layouts.forEach(function(lout) {
      if(layout === lout.name) {
        isInList = true;
        return;
      }
    });

    if(isInList) {
      return true;
    }
    else {
      var newRouteParams = _.clone(params);
      newRouteParams.layout = 'default';
      state.go(state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    }
    return false;
  };

  //HelloWorld -> hello-world
  MohicanUtils.toHyphen = function(string) {
    return _.kebabCase(string);
  };

  //hello-world -> helloWorld
  MohicanUtils.toCamel = function(string) {
    return _.camelCase(string);
  };

  //hello-world -> HelloWorld
  MohicanUtils.toCapitalCamel = function(string) {
    return _.chain(string).camelCase().capitalize().value();
  };

  //HelloWorld -> hello_world
  MohicanUtils.toSnake = function(string) {
    return _.snakeCase(string);
  };

}(window.MohicanUtils));

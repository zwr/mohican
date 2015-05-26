(function(MohicanUtils) {
  'use strict';

  angular
      .module('mohican.routes', []);

  MohicanUtils.routes = [];

  MohicanUtils._mohicanRoute = function(routeName, controller) {
    MohicanUtils.routes.push(routeName);
    return function($stateProvider) {
      $stateProvider.state('base.' + routeName, {
        url: '/' + MohicanUtils.toHyphen(routeName) + '?backendfilter&page&layout&column&direction&qf&filters',
        templateUrl: 'app/routes/' + routeName + 'Grid.html',
        controller: controller,
        controllerAs: 'ctrl',
      });
    };
  };

  MohicanUtils.defineMohicanRoute = function(definition) {
    if(definition.service) {
      angular.module('mohican.services').
          factory(definition.name + 'Service', definition.service);
    }
    angular.module('mohican.routes').
        config(['$stateProvider', MohicanUtils._mohicanRoute(definition.name, definition.controller)]);
  };

  var _checkDefaultParams = function(params) {
    var newParams = _.clone(params);
    var dirty = false;
    if (newParams.backendfilter === 'default') {
      newParams.backendfilter = undefined;
      dirty = true;
    }
    if (newParams.page === '1' || newParams.page === 1) {
      newParams.page = undefined;
      dirty = true;
    }
    if (newParams.layout === 'default') {
      newParams.layout = undefined;
      dirty = true;
    }
    if (newParams.direction === 'asc') {
      newParams.direction = undefined;
      dirty = true;
    }
    if (newParams.qf === 'false') {
      newParams.qf = undefined;
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
      state.go(state.current.name, checkResult.newParams);
    }
  };

  MohicanUtils.injectDefaultParameters = function(params) {
    if (!params.backendfilter) {
      params.backendfilter = 'default';
    }
    if (!params.page) {
      params.page = '1';
    }
    if (!params.layout) {
      params.layout = 'default';
    }
    if (!params.direction) {
      params.direction = 'asc';
    }

    return params;
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

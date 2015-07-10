(function(mohican) {
  'use strict';

  mohican._mohicanRoute = function(routeName, controller, $stateProvider, redirectTo, template) {
    var url = '/' + mohican.toHyphen(routeName) + '?backendfilter&page&layout&column&direction&qf&filters';
    var urlForm = '/' + mohican.toHyphen(routeName) + '/{itemPrimaryKeyId}?activetab';
    var templateUrl = 'app/routes/' + mohican.toHyphen(routeName) + '-grid.html';
    var templateUrlForm = 'app/routes/' + mohican.toHyphen(routeName) + '-form.html';

    if(redirectTo && angular.isUndefined(template) || template === null) {
      templateUrl = undefined;
    }

    if(redirectTo) {
      controller = ['mnRouter', function(mnRouter) {
        mnRouter.transitionTo('base.' + redirectTo, mnRouter.$stateParams, {location: 'replace'});
      }];
    }

    $stateProvider.state('base.' + mohican.toHyphen(routeName), {
      url:          url,
      templateUrl:  templateUrl,
      controller:   controller,
      controllerAs: 'ctrl'
    });

    $stateProvider.state('base.' + mohican.toHyphen(routeName) + '-form', {
      url:          urlForm,
      templateUrl:  templateUrlForm,
      controller:   controller,
      controllerAs: 'ctrl'
    });
  };

  var isArray = function(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; };
  mohican.defineMohicanRoute = function(definition, $stateProvider) {
    var i;
    if(definition.service) {
      if(definition.controller && isArray(definition.controller)) {
        for(i = 0; i < definition.controller.length; i++) {
          if(definition.controller[i] === 'service') {
            definition.controller[i] = definition.name + 'Service';
          }
        }
      }

      angular.module('mohican.services').register.
          factory(definition.name + 'Service', definition.service);
    }
    mohican._mohicanRoute(definition.name, definition.controller, $stateProvider, definition.redirectTo, definition.template);
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
    if (newParams.qf === 'false' || newParams.qf === false) {
      newParams.qf = undefined;
      dirty = true;
    }
    if (newParams.activetab === '0' || newParams.activetab === 0) {
      newParams.activetab = undefined;
      dirty = true;
    }

    return {dirty: dirty, newParams: newParams};
  };

  mohican.escapeDefaultParameters = function(params) {
    var checkResult = _checkDefaultParams(params);
    return checkResult.newParams;
  };

  mohican.redirectDefaultParameters = function(mnRouter) {
    var checkResult = _checkDefaultParams(mnRouter.$stateParams);

    if(checkResult.dirty && mnRouter.$state) {
      mnRouter.transitionTo(mnRouter.$state.current.name, checkResult.newParams);
    }
    else {
      //redirect to index resource route if form have no id passed
      if(_.endsWith(mnRouter.$state.current.name, '-form') && !mnRouter.$stateParams.itemPrimaryKeyId) {
        mnRouter.transitionTo(_.trimRight(mnRouter.$state.current.name, '-form'), {});
      }
    }
  };

  mohican.injectDefaultParameters = function(mnRouter) {
    if (!mnRouter.$stateParams.backendfilter) {
      mnRouter.$stateParams.backendfilter = 'default';
    }
    if (!mnRouter.$stateParams.page) {
      mnRouter.$stateParams.page = '1';
    }
    if (!mnRouter.$stateParams.layout) {
      mnRouter.$stateParams.layout = 'default';
    }
    if (!mnRouter.$stateParams.direction) {
      mnRouter.$stateParams.direction = 'asc';
    }
    if (!mnRouter.$stateParams.activetab) {
      mnRouter.$stateParams.activetab = '0';
    }

    return mnRouter.$stateParams;
  };

  //HelloWorld -> hello-world
  mohican.toHyphen = function(string) {
    return _.kebabCase(string);
  };

  //hello-world -> helloWorld
  mohican.toCamel = function(string) {
    return _.camelCase(string);
  };

  //hello-world -> HelloWorld
  mohican.toCapitalCamel = function(string) {
    return _.chain(string).camelCase().capitalize().value();
  };

  //HelloWorld -> hello_world
  mohican.toSnake = function(string) {
    return _.snakeCase(string);
  };

  mohican.jsonToUrlParam = function(filters, dataFields) {
    var filterObjects = [];
    for (var key in filters) {
      if (filters.hasOwnProperty(key)) {
        var field = mohican._getDataField(dataFields, key);
        if(field.quickfilter === 'date-range') {
          if(filters[key] instanceof Object &&
             filters[key].startDate !== null &&
             filters[key].endDate !== null) {
            var filterVal = filters[key].startDate.toString().split(' ').join('_') +
                            '---' +
                            filters[key].endDate.toString().split(' ').join('_');
            filterObjects.push(key + '$' + filterVal);
          }
        }
        else if(field.quickfilter === 'select') {
          if(filters[key].length > 0) {
            filterObjects.push(key + '$' + filters[key]);
          }
        }
        else {
          if(angular.isDefined(filters[key]) &&
                 filters[key] !== null
                 && filters[key] !== '') {
            filterObjects.push(key + '$' + filters[key]);
          }
        }
      }
    }
    return filterObjects.join('$$');
  };

  mohican.urlParamToJson = function(urlParamString, dataFields) {
    var filtersObject;

    if(urlParamString && urlParamString !== '') {
      filtersObject = {};
      var urlFilters = urlParamString.split('$$');
      urlFilters.forEach(function(urlFilter) {
        var keyValue = urlFilter.split('$');
        var field = mohican._getDataField(dataFields, keyValue[0]);
        if(field.quickfilter === 'date-range') {
          var rangeParams = keyValue[1].split('---');
          var startDate = new Date(rangeParams[0].split('_').join(' '));
          var endDate = new Date(rangeParams[1].split('_').join(' '));
          filtersObject[keyValue[0]] = {
            startDate: startDate,
            endDate:   endDate
          };
        }
        else if(field.quickfilter === 'select') {
          var selectParams = keyValue[1].split(',');
          filtersObject[keyValue[0]] = selectParams;
        }
        else {
          filtersObject[keyValue[0]] = keyValue[1];
        }
      });
    }

    return filtersObject;
  };

  mohican._getDataField = function(dataFields, name) {
    var field;
    dataFields.forEach(function(dField) {
      if(dField.name === name) {
        field = dField;
        return;
      }
    });
    return field;
  };

}(window.mohican));

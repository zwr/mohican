(function(mohican) {
  'use strict';
  trace_timestamp('Executing controller');
  var stateMachine = mohican.stateMachine;

  mohican.extendBaseController = function(ctrl, service, mnRouter) {
    _.assign(ctrl, mohican.mnBaseController);
    ctrl.initialize(service, mnRouter.$stateParams, mnRouter.$state);
    ctrl.loadData();
  };

  mohican.mnBaseController = {
    stateMachine: stateMachine,

    backendFilters: undefined,
    layouts:        undefined,
    layoutDefs:     undefined,
    service:        undefined,
    $stateParams:   undefined,
    $state:         undefined,
    fields:         undefined,
    pageCount:      undefined,

    clientViewLoadingNotification: undefined,

    initialize: function(service, $stateParams, $state) {
      mohican.redirectDefaultParameters($stateParams, $state);
      mohican.injectDefaultParameters($stateParams);

      this.$stateParams = $stateParams;
      this.$state = $state;

      this.stateMachine.stateMachineFromUrl($stateParams, service);

      if(angular.isDefined($stateParams.column) ||
            angular.isDefined($stateParams.qf) ||
            angular.isDefined($stateParams.filters)) {
        this.clientViewLoadingNotification = true;
      }
      else {
        this.clientViewLoadingNotification = false;
      }
      this.fullyLoaded = false;
      this.layouts = [];
      this.layoutDefs = [];
      this.backendFilters = [];
      this.service = service;
    },

    loadData: function() {
      var that = this;

      that.service.getPreviewDefinitions().
      then(function(definition) {
        that.layoutDefs = definition.layouts;
        that.layoutDefs.forEach(function(layout) {
          that.layouts.push({
            name:     layout.name,
            show:     'Layout: ' + layout.name,
            desc:     'Shows ' + layout.definition.length + ' fields',
            selected: layout.name === that.stateMachine.layout
          });
          if(layout.name === that.stateMachine.layout) {
            that.fields = layout.definition;
          }
        });
      }).
      then(function() {
        mohican.validateLayoutParameter(that.stateMachine.layout, that.layouts, that.$state, that.$stateParams);
        that.service.getBackendFilters().then(function(backendFilters) {
          backendFilters.forEach(function(backendFilter) {
            that.backendFilters.push({
              name:     backendFilter.name,
              show:     'Filter: ' + backendFilter.name,
              selected: backendFilter.name === that.stateMachine.backendFilter
            });
          });
          mohican.validateBackendFilterParameter(that.stateMachine.backendFilter, that.backendFilters, that.$state, that.$stateParams);
        });
        that.stateMachine.filters = mohican.urlParamToJson(that.$stateParams.filters, that.fields);

        that.fullyLoaded = false;

        that.service.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.backendFilter).then(function(pageCount) {
          that.pageCount = pageCount;
          if(mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams)) {
            that.service.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.backendFilter).then(function(items) {
              that.items = items;
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.service.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
                if(that.stateMachine.column || that.stateMachine.quickFilterShown) {
                  that.stateMachine.page = parseInt(angular.isUndefined(that.$state.params.page) ? 1 : parseInt(that.$state.params.page));

                  that.service.getClientPage(that.stateMachine.page,
                                             that.stateMachine.column,
                                             that.stateMachine.direction,
                                             that.stateMachine.filters,
                                             that.fields).then(function(data) {
                    that.items = data.items;
                    that.pageCount = data.pageCount;
                    mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams);
                  });
                }
              });
            });
          }
        });
      });
    },

    pageChanged: function(page) {
      var that = this;
      if(this.service.thePromise !== null) {
        this.stateMachine.page = parseInt(page);
        // this.stateMachine.layout = undefined;
        this.stateMachine.column = undefined;
        this.stateMachine.direction = undefined;
        this.stateMachine.quickFilterShown = false;
        this.stateMachine.filters = undefined;

        this.$state.go(this.$state.current.name,
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: true });
      }
      else {
        this.stateMachine.page = parseInt(page);
        this.$state.go(this.$state.current.name,
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false });
        this.service.getClientPage(this.stateMachine.page,
                                   this.stateMachine.column,
                                   this.stateMachine.direction,
                                   this.stateMachine.filters,
                                   this.fields).then(function(data) {
          that.items = data.items;
          that.pageCount = data.pageCount;
          mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams);
        });
      }
    },

    clientLayoutChanged: function(newLayoutName) {
      this.stateMachine.page = 1;
      var that = this;
      this.layoutDefs.forEach(function(layout) {
        if(layout.name === newLayoutName) {
          that.fields = layout.definition;
        }
      });
      this.$state.go(this.$state.current.name,
                     this.stateMachine.stateMachineToUrl(this.fields),
                     { notify: false });
    },

    getBackendFilters: function(backendFilter) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.backendfilter = backendFilter;
      this.$state.go(this.$state.current.name, mohican.escapeDefaultParameters(newRouteParams));
    },

    clientViewChanged: function(column, direction) {
      this.stateMachine.page = 1;//for all client side actions reset page to 1
      if(column) {
        this.stateMachine.column = column;
      }
      if(direction) {
        this.stateMachine.direction = direction;
      }

      this.$state.go(this.$state.current.name,
                     this.stateMachine.stateMachineToUrl(this.fields),
                     { notify: false });
       var that = this;
       that.service.getClientPage(that.stateMachine.page,
                                  that.stateMachine.column,
                                  that.stateMachine.direction,
                                  that.stateMachine.filters,
                                  that.fields).then(function(data) {
         that.items = data.items;
         that.pageCount = data.pageCount;
         mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams);
       });
    },

    toggleQuickFilter: function() {
      if(!this.stateMachine.quickFilterShown) {
        this.stateMachine.filters = undefined;
      }
      this.stateMachine.page = 1;//for all client side actions reset page to 1

      this.$state.go(this.$state.current.name,
                     this.stateMachine.stateMachineToUrl(this.fields),
                     { notify: true });
      //  var that = this;
      //  that.service.getClientPage(that.stateMachine.page,
      //                             that.stateMachine.column,
      //                             that.stateMachine.direction,
      //                             that.stateMachine.filters,
      //                             that.fields).then(function(data) {
      //    that.items = data.items;
      //    that.pageCount = data.pageCount;
      //    mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams);
      //  });
    },

    clearClientSortAndFilter: function() {
      this.stateMachine.page = undefined;
      // this.stateMachine.layout = undefined;
      this.stateMachine.column = undefined;
      this.stateMachine.direction = undefined;
      this.stateMachine.quickFilterShown = false;
      this.stateMachine.filters = undefined;

      this.$state.go(this.$state.current.name,
                     this.stateMachine.stateMachineToUrl(this.fields),
                     { notify: true });
    },

    onItemSelect: function(selectedItems) {
      console.log(selectedItems);
    }
  };
}(window.mohican));

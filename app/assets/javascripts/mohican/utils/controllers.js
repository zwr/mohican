(function(MohicanUtils) {
  'use strict';
  trace_timestamp('Executing controller');
  MohicanUtils.mnBaseController = {
    stateMachine: {
      page:             undefined,
      layout:           undefined,
      backendFilter:    undefined,
      column:           undefined,
      direction:        undefined,
      quickFilterShown: undefined,
      qfFocus:          undefined,
      filters:          undefined,

      _stateMachineFromUrl: function($stateParams, resolve) {
        //if we have qf or qs on, show first page from backend filter,
        //but after loading data is finished, page will be set to $stateParams.page
        //also check resolve.thePromise to see if user has changed page while eager loading
        if(($stateParams.qf || $stateParams.column) && resolve.thePromise === null) {
          this.page = 1;
        }
        else {
          this.page = $stateParams.page;
        }
        this.layout = $stateParams.layout;
        this.backendFilter = $stateParams.backendfilter;
        this.column = $stateParams.column;
        this.direction = $stateParams.direction;
        this.quickFilterShown = false;
        this.qfFocus = $stateParams.qf;
      },

      _stateMachineToUrl: function() {
        return {
          page:             this.page,
          layout:           this.layout,
          backendFilter:    this.backendFilter,
          column:           this.column,
          direction:        this.direction,
          quickFilterShown: this.quickFilterShown,
          qfFocus:          this.qfFocus,
        };
      },
    },

    backendFilters: undefined,
    layouts:        undefined,
    resolve:        undefined,
    $stateParams:   undefined,
    $state:         undefined,
    fields:         undefined,
    pageCount:      undefined,

    clientViewLoadingNotification: undefined,

    initialize: function(resolve, $stateParams, $state) {
      console.log('controller initialize');
      trace('Controller initialized');
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.$stateParams = $stateParams;
      this.$state = $state;

      this.stateMachine._stateMachineFromUrl($stateParams, resolve);

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
      this.backendFilters = [];
      this.resolve = resolve;
    },

    loadData: function() {
      var that = this;

      that.resolve.getPreviewDefinitions().then(function(definition) {
        definition.layouts.forEach(function(layout) {
          that.layouts.push({
            name:     layout.name,
            show:     'Layout: ' + layout.name,
            desc:     'Shows ' + layout.definition.length + ' fields',
            selected: layout.name === that.stateMachine.layout,
          });
          if(layout.name === that.stateMachine.layout) {
            that.fields = layout.definition;
          }
        });
        MohicanUtils.validateLayoutParameter(that.stateMachine.layout, that.layouts, that.$state, that.$stateParams);
        that.resolve.getBackendFilters().then(function(backendFilters) {
          backendFilters.forEach(function(backendFilter) {
            that.backendFilters.push({
              name:     backendFilter.name,
              show:     'Filter: ' + backendFilter.name,
              selected: backendFilter.name === that.stateMachine.backendFilter,
            });
          });
          MohicanUtils.validateBackendFilterParameter(that.stateMachine.backendFilter, that.backendFilters, that.$state, that.$stateParams);
        });
        that.stateMachine.filters = MohicanUtils.urlParamToJson(that.$stateParams.filters, that.fields);

        that.fullyLoaded = false;

        that.resolve.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.backendFilter).then(function(pageCount) {
          that.pageCount = pageCount;
          if(MohicanUtils.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams)) {
            that.resolve.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.backendFilter).then(function(items) {
              that.items = items;
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.resolve.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
                if(that.$stateParams.column || that.$stateParams.qf) {
                  that.stateMachine.page = that.$state.params.page;
                  that.stateMachine.quickFilterShown = that.$stateParams.qf ? true : false;

                  that.resolve.getClientPage(that.stateMachine.page,
                                             that.stateMachine.column,
                                             that.stateMachine.direction,
                                             that.stateMachine.filters,
                                             that.fields).then(function(data) {
                    that.items = data.items;
                    that.pageCount = data.pageCount;
                    MohicanUtils.validatePageParameter(that.stateMachine.page, that.pageCount, that.$state, that.$stateParams);
                  });
                }
              });
            });
          }
        });
      });
    },

    getPage: function(page) {
      var newRouteParams = _.clone(this.$stateParams);
      //if eager loading, go to requested page and clear all client selections
      if(this.resolve.thePromise !== null) {
        // newRouteParams.layout = undefined;
        newRouteParams.column = undefined;
        newRouteParams.direction = undefined;
        newRouteParams.qf = undefined;
        newRouteParams.filters = undefined;
      }
      newRouteParams.page = page;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getLayout: function(layout) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.layout = layout;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getBackendFilters: function(backendFilter) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.backendfilter = backendFilter;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getView: function(column, direction, filters, focus) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.page = 1;//for all client side actions reset page to 1
      if(column) {
        newRouteParams.column = column;
      }
      if(direction) {
        newRouteParams.direction = direction;
      }
      if(filters) {
        newRouteParams.filters = MohicanUtils.jsonToUrlParam(filters, this.fields);
      }
      if(focus) {
        //store focused field information in qf param
        newRouteParams.qf = focus;
      }
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    toggleQuickFilter: function() {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.qf = !this.stateMachine.quickFilterShown;
      if(!newRouteParams.qf) {
        newRouteParams.filters = undefined;
      }
      newRouteParams.page = 1;//for all client side actions reset page to 1
      this.$state.go(this.$state.current.name,
                     MohicanUtils.escapeDefaultParameters(newRouteParams),
                     {
                       notify: false,
                     });
    },

    clearClientSortAndFilter: function() {
      var newRouteParams = _.clone(this.$stateParams);

      newRouteParams.page = undefined;
      // newRouteParams.layout = undefined;
      newRouteParams.column = undefined;
      newRouteParams.direction = undefined;
      newRouteParams.qf = undefined;
      newRouteParams.filters = undefined;

      this.$state.go(this.$state.current.name, newRouteParams);
    },

    onItemSelect: function(selectedItems) {
      console.log(selectedItems);
    },
  };
}(window.MohicanUtils));

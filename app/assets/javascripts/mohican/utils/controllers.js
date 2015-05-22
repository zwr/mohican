(function(MohicanUtils) {
  'use strict';
  trace_timestamp('Executing controller');
  MohicanUtils.mnBaseController = {
    page: undefined,
    layout: undefined,
    backendFilter: undefined,
    column: undefined,
    direction: undefined,
    quickFilterShown: undefined,
    qfFocus: undefined,
    filters: undefined,
    layouts: undefined,
    backendFilters: undefined,
    resolve: undefined,
    mnGridFilterService: undefined,
    $stateParams: undefined,
    $state: undefined,
    fields: undefined,
    pageCount: undefined,
    item: undefined,
    clientViewLoadingNotification: undefined,

    initialize: function(resolve, mnGridFilterService, $stateParams, $state, $scope) {
      trace('Controller initialized');
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      //if we have qf or qs on, show first this.page from backend filter,
      //but after loading data is finished, this.page will be set to $stateParams.page
      if(($stateParams.qf || $stateParams.column) && resolve.thePromise === null) {
        this.page = 1;
      }
      else {
        this.page = $stateParams.page;
      }
      this.layout = $stateParams.layout;
      this.backendFilter = $stateParams.backendfilter;
      this.order = $stateParams.order;
      this.column = $stateParams.column;
      this.direction = $stateParams.direction;
      this.quickFilterShown = false;
      if(angular.isDefined($stateParams.column) ||
            angular.isDefined($stateParams.qf) ||
            angular.isDefined($stateParams.filters)) {
        this.clientViewLoadingNotification = true;
      }
      else {
        this.clientViewLoadingNotification = false;
      }
      this.fullyLoaded = false;
      this.qfFocus = $stateParams.qf;//read focused field information from qf param
      this.layouts = [];
      this.backendFilters = [];
      this.resolve = resolve;
      this.mnGridFilterService = mnGridFilterService;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$scope = $scope;
    },

    loadData: function() {
      var that = this;

      that.resolve.getPreviewDefinitions().then(function(definition) {
        definition.layouts.forEach(function(layout) {
          that.layouts.push({
            name: layout.name,
            show: 'Layout: ' + layout.name,
            desc: 'Shows ' + layout.definition.length + ' fields',
            selected: layout.name === that.layout,
          });
          if(layout.name === that.layout) {
            that.fields = layout.definition;
          }
        });
        MohicanUtils.validateLayoutParameter(that.layout, that.layouts, that.$state, that.$stateParams);
        that.resolve.getBackendFilters().then(function(backendFilters) {
          backendFilters.forEach(function(backendFilter) {
            that.backendFilters.push({
              name: backendFilter.name,
              show: 'Filter: ' + backendFilter.name,
              selected: backendFilter.name === that.backendFilter,
            });
          });
          MohicanUtils.validateBackendFilterParameter(that.backendFilter, that.backendFilters, that.$state, that.$stateParams);
        });
        that.filters = that.mnGridFilterService.urlParamToJson(that.$stateParams.filters, that.fields);

        that.fullyLoaded = false;

        that.resolve.getBackendPageCount(that.fields, that.page, that.backendFilter).then(function(pageCount) {
          that.pageCount = pageCount;
          if(MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams)) {
            that.resolve.getBackendPage(that.page, that.fields, that.backendFilter).then(function(items) {
              that.items = items;
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.resolve.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
                if(that.$stateParams.column || that.$stateParams.qf) {
                  that.page = that.$state.params.page;
                  that.quickFilterShown = that.$stateParams.qf ? true : false;

                  that.resolve.getClientPage(that.page,
                                             that.column,
                                             that.direction,
                                             that.filters,
                                             that.fields).then(function(data) {
                    that.items = data.items;
                    that.pageCount = data.pageCount;
                    MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams);
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
        newRouteParams.filters = this.mnGridFilterService.jsonToUrlParam(filters, this.fields);
      }
      if(focus) {
        //store focused field information in qf param
        newRouteParams.qf = focus;
      }
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    toggleQuickFilter: function(opened) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.qf = opened;
      if(!newRouteParams.qf) {
        newRouteParams.filters = undefined;
      }
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    clearClientSortAndFilter: function() {
      var newRouteParams = _.clone(this.$stateParams);

      newRouteParams.page = undefined;
      newRouteParams.layout = undefined;
      newRouteParams.column = undefined;
      newRouteParams.direction = undefined;
      newRouteParams.qf = undefined;
      newRouteParams.filters = undefined;

      this.$state.go(this.$state.current.name, newRouteParams);
    },
  };
}(window.MohicanUtils));

(function(MohicanUtils) {
  'use strict';

  MohicanUtils.mnBaseController = {
    page: undefined,
    layout: undefined,
    order: undefined,
    layouts: undefined,
    resolve: undefined,
    $stateParams: undefined,
    $state: undefined,
    $filter: undefined,
    fields: undefined,
    pagesCount: undefined,
    item: undefined,

    initialize: function(resolve, $stateParams, $state, $filter) {
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.page = $stateParams.page;
      this.layout = $stateParams.layout;
      this.order = $stateParams.order;
      this.layouts = [];
      this.resolve = resolve;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$filter = $filter;
    },

    loadData: function() {
      var that = this;

      that.resolve.getPageCount().then(function(pagesCount) {
        that.pagesCount = pagesCount;
        if(MohicanUtils.validatePageParameter(that.page, that.pagesCount, that.$state, that.$stateParams)) {
          that.resolve.getPage(that.page).then(function(items) {
            var orderBy = that.$filter('orderBy');
            that.items = orderBy(items, that.order, false);
          });
        }
      });

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

    getOrder: function(column) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.order = column;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },
  };
}(window.MohicanUtils));

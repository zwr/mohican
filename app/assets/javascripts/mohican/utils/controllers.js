(function(MohicanUtils) {
  'use strict';

  MohicanUtils.mnBaseController = {
    page: undefined,
    layout: undefined,
    layouts: undefined,
    resolve: undefined,
    $stateParams: undefined,
    $state: undefined,
    fields: undefined,
    pagesCount: undefined,
    item: undefined,

    initialize: function(resolve, $stateParams, $state) {
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.page = $stateParams.page;
      this.layout = $stateParams.layout;
      this.layouts = [];
      this.resolve = resolve;
      this.$stateParams = $stateParams;
      this.$state = $state;
    },

    loadInitialData: function() {
      var that = this;

      that.resolve.getPageCount().then(function(pagesCount) {
        that.pagesCount = pagesCount;
        if(MohicanUtils.validatePageParameter(that.page, that.pagesCount, that.$state, that.$stateParams)) {
          that.resolve.getPage(that.page).then(function(items) {
            that.items = items;
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
  };
}(window.MohicanUtils));

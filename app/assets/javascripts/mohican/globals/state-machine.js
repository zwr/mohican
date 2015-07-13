(function(mohican) {
  'use strict';

  mohican.createStateMachine = function() {
    return {
      page:             undefined,
      layout:           undefined,
      backendfilter:    undefined,
      column:           undefined,
      direction:        undefined,
      quickFilterShown: undefined,
      filters:          undefined,
      itemPrimaryKeyId: undefined,

      activetab: undefined,

      stateMachineFromUrl: function($stateParams, service) {
        if (!$stateParams.backendfilter) {
          this.backendfilter = 'default';
        }
        if (!$stateParams.page) {
          this.page = 1;
        }
        if (!$stateParams.layout) {
          this.layout = 'default';
        }
        if (!$stateParams.direction) {
          this.direction = 'asc';
        }
        if (!$stateParams.activetab) {
          this.activetab = 0;
        }

        //if we have qf or qs on, show first page from backend filter,
        //but after loading data is finished, page will be set to $stateParams.page
        //also check service.thePromise to see if user has changed page while eager loading
        if(($stateParams.qf || $stateParams.column) && service && service.thePromise === null) {
          this.page = 1;
        }
        else {
          this.page = parseInt($stateParams.page);
        }
        this.layout = $stateParams.layout;
        this.backendFilter = $stateParams.backendfilter;
        this.column = $stateParams.column;
        this.direction = $stateParams.direction;
        this.itemPrimaryKeyId = $stateParams.itemPrimaryKeyId;
        this.activetab = $stateParams.activetab;

        //filters and qf show will be available after fullyLoaded
        this.quickFilterShown = $stateParams.qf === 'true' ? true : false;
        this.filters = undefined;
      },

      stateMachineToUrl: function(fields) {
        // console.log(this.filters);
        return mohican.escapeDefaultParameters({
          page:             this.page,
          layout:           this.layout,
          backendfilter:    this.backendFilter,
          column:           this.column,
          direction:        this.direction,
          qf:               this.quickFilterShown,
          filters:          mohican.jsonToUrlParam(this.filters, fields),
          itemPrimaryKeyId: this.itemPrimaryKeyId,

          activetab: this.activetab
        });
      }
    };
  };
}(window.mohican));
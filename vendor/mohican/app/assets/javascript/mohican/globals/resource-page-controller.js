(function(mohican) {
  'use strict';

  mohican.extendResourcePageController = function(resourceName, routeName, ctrl, service, $injector) {
    mohican.extendBaseDriver(ctrl, $injector);
    _.assign(ctrl, mohican.createResourcePageController());
    ctrl.resourceName = resourceName;
    ctrl.routeName = routeName;
    ctrl.initialize(service, $injector);
    ctrl.loadData();
  };

  mohican.createResourcePageController = function() {
    return {
      documentFilters: undefined,
      layouts:         undefined,
      layoutDefs:      undefined,
      service:         undefined,
      fields:          undefined,
      pageCount:       undefined,
      totalQfCount:    undefined,
      primaryKeyName:  undefined,
      itemForm:        undefined,
      mnRouter:        undefined,

      onCurrentItemChanged: undefined,

      initialize: function(service, $injector) {
        var that = this;
        this.mnRouter = $injector.get('mnRouter');
        this.$q = $injector.get('$q');
        this.$http = $injector.get('$http');
        this.mnNotify = $injector.get('mnNotify');
        this.$location = $injector.get('$location');

        mohican.redirectDefaultParameters(this.mnRouter);
        mohican.injectDefaultParameters(this.mnRouter);

        this.stateMachine.loadFromUrl(this.mnRouter.$stateParams, service);

        this.fullyLoaded = false;
        this.layouts = [];
        this.layoutDefs = [];
        this.documentFilters = [];
        this.service = service;
        this.onCurrentItemChanged = [];
      },

      loadMnGridItems: function() {
        var that = this;
        that.mnNotify.controllerChanged(that.routeName);
        that.service.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(resolveValue) {
          var pageCount = resolveValue.pageCount;
          that.pageCount = pageCount;

          if(mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter)) {
            that.service.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(items) {
              that.items = items;
              if(that.startLoadingMessage) {
                that.startLoadingMessage.dismiss();
                that.startLoadingMessage = undefined;
                if(that.mnRouter.currentRouteName() === that.routeName) {
                  if(angular.isDefined(that.mnRouter.$stateParams.column) ||
                        angular.isDefined(that.mnRouter.$stateParams.qf) ||
                        angular.isDefined(that.mnRouter.$stateParams.filters)) {
                    var notif = that.mnNotify.warning({
                      message:   _.capitalize(that.resourceName) + ' data arriving, filtering postponed',
                      details:   'Click \'filter\ to apply filter and sorting to the arrived data, or \'clear\' to show all data',
                      actions:   ['filter', 'clear'],
                      ownerCtrl: that.routeName,

                      dismissable: false
                    });
                    that.eagerLoadingMessage = notif.message;
                    notif.promise.then(function(action) {
                      if(action === 'filter') {
                        console.log('filter');
                        that.service.getCurrentBufferSnapshot();
                      }
                      if(action === 'clear') {
                        console.log('clear');
                        that.clearClientSortAndFilter();
                      }
                    });
                  }
                  else {
                    var notif = that.mnNotify.info({
                      message: _.capitalize(that.resourceName) + ' data arriving...',
                      details: 'You will be able to see all data after eager loading finish',

                      dismissable: false
                    });
                    that.eagerLoadingMessage = notif.message;
                  }
                }
                else {
                  var notif = that.mnNotify.info({
                    message: _.capitalize(that.resourceName) + ' data arriving...',
                    // details: 'You will be able to see all data after eager loading finish',

                    dismissable: false
                  });
                  that.eagerLoadingMessage = notif.message;
                }
              }
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.service.waitFullyLoaded().then(function(resolveMessage) {
                if(that.eagerLoadingMessage && that.mnRouter.currentRouteName() !== that.routeName) {
                  that.eagerLoadingMessage.dismiss();
                  that.eagerLoadingMessage = undefined;
                }
                if(!that.moreDataLoadedMessage) {
                  that.mnNotify.success({
                    message:   _.capitalize(that.resourceName) + ' data has been loaded',
                    delay:     -1,
                    ownerCtrl: that.routeName
                  });
                  if(that.service.backendTotalCount !== that.service.totalCount) {
                    that.mnNotify.warning({
                      message:   _.capitalize(that.resourceName) + ' data has been partialy loaded',
                      details:   that.service.totalCount + ' of ' + that.service.backendTotalCount + ' documents loaded.',
                      ownerCtrl: that.routeName
                    });
                  }
                }
                else {
                  that.moreDataLoadedMessage.dismiss();
                  var notif = that.mnNotify.warning({
                    message: _.capitalize(that.resourceName) + ' loading is compelted',
                    details: _.capitalize(that.resourceName) + ' loading is compelted but not all the data is merged. Click \'apply\' to merge them in.',
                    actions: ['apply'],

                    dismissable: false
                  });
                  that.moreDataLoadedMessage = notif.message;
                  notif.promise.then(function(action) {
                    if(action === 'apply') {
                      that.moreDataLoadedMessage = undefined;
                      that.service.refreshCurrentBufferSnapshot();
                      if(that.eagerLoadingMessage) {
                        that.eagerLoadingMessage.dismiss();
                        that.eagerLoadingMessage = undefined;
                      }
                      that.fullyLoaded = true;
                      that.loadQuickFiltersAndSort(true);
                    }
                  });
                }
                if(that.eagerLoadingMessage) {
                  that.eagerLoadingMessage.dismiss();
                  that.eagerLoadingMessage = undefined;
                }
                that.fullyLoaded = true;
                if(that.$location.path().split('/').filter(function(n) { return n.length; }).length <= 1) {
                  that.loadQuickFiltersAndSort(false);
                }
              }, function(error) {
                console.log(error);
              }, function(notification) {
                if(that.mnRouter.currentRouteName() === that.routeName && !that.moreDataLoadedMessage && !that.eagerLoadingMessage) {
                  var notif = that.mnNotify.warning({
                    message: 'More data has arrived',
                    details: 'More data has arrived, click \'apply\' to load new arrived data to current filter.',
                    actions: ['apply'],

                    dismissable: false
                  });
                  that.moreDataLoadedMessage = notif.message;
                  notif.promise.then(function(action) {
                    if(action === 'apply') {
                      that.moreDataLoadedMessage = undefined;
                      that.service.refreshCurrentBufferSnapshot();
                      if(that.eagerLoadingMessage) {
                        that.eagerLoadingMessage.dismiss();
                        that.eagerLoadingMessage = undefined;
                      }
                      that.fullyLoaded = true;
                      that.loadQuickFiltersAndSort(true);
                    }
                  });
                }
              });
              that.service.waitSnapshotLoaded().then(function() {
                // console.log('snapshot loaded');
              }, function(error) {
                console.log(error);
              }, function() {
                if(that.mnRouter.currentRouteName() === that.routeName) {
                  if(that.eagerLoadingMessage) {
                    that.eagerLoadingMessage.dismiss();
                    that.eagerLoadingMessage = undefined;
                  }
                  that.fullyLoaded = true;
                  that.loadQuickFiltersAndSort(true);
                }
                else {
                  if(that.eagerLoadingMessage) {
                    that.eagerLoadingMessage.dismiss();
                    that.eagerLoadingMessage = undefined;
                  }
                }
              });
            }, function(error) {
              console.log(error);
            });
          }
        });
      },

      loadQuickFiltersAndSort: function(resetPage) {
        var that = this;
        if(that.stateMachine.column || that.stateMachine.quickFilterShown) {
          if(resetPage) {
            that.stateMachine.page = 1;
            that.mnRouter.transitionTo(that.mnRouter.currentRouteName(),
                           that.stateMachine.toUrl(that.fields),
                           { notify: false })
                         .then(function() {
              that.service.getClientPage(that.stateMachine.page,
                                         that.stateMachine.column,
                                         that.stateMachine.direction,
                                         that.stateMachine.filters,
                                         that.fields).then(function(data) {
                that.items = data.items;
                that.pageCount = data.pageCount;
                that.totalQfCount = data.totalQfCount;
                mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
              });
            });
          }
          else {
            that.stateMachine.page = parseInt(angular.isUndefined(that.mnRouter.$state.params.page) ? 1 : parseInt(that.mnRouter.$state.params.page));
            that.service.getClientPage(that.stateMachine.page,
                                       that.stateMachine.column,
                                       that.stateMachine.direction,
                                       that.stateMachine.filters,
                                       that.fields).then(function(data) {
              that.items = data.items;
              that.pageCount = data.pageCount;
              that.totalQfCount = data.totalQfCount;
              mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
            });
          }

        }
      },

      loadData: function() {
        var that = this;

        that.service.getPreviewDefinitions().
        then(function(definition) {
          that.primaryKeyName = definition.primaryKeyName;
          that.doctype = definition.doctype;
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
          if(_.endsWith(that.mnRouter.currentRouteName(), '-new')) {
            that.fullyLoaded = true;
            that.itemForm = {};
            that.onCurrentItemChanged.forEach(function(callback) {
              callback(that.itemForm);
            });
            that.service.prepareNewDoc(that.fields, that.$http, that.$q, that.resourceName,
                                      {primaryKeyName: that.primaryKeyName, doctype: that.doctype}, that.itemForm);
          }
          else if(that.stateMachine.itemPrimaryKeyId) {
            that.service.getDocument(that.stateMachine.itemPrimaryKeyId, that.fields)
            .then(function(items) {
              that.fullyLoaded = true;
              ///check is item exists
              if(items[0]) {
                that.itemForm = items[0];
                that.onCurrentItemChanged.forEach(function(callback) {
                  callback(that.itemForm);
                });
              }
              else {
                that.mnRouter.pageNotFound();
              }
            }, function() {
              that.mnRouter.pageNotFound();
            });
          }
          else {
            var notif = that.mnNotify.info({
              message: 'Loading ' + that.resourceName + '...',
              details: 'Loading ' + that.resourceName + '...',

              dismissable: false
            });
            that.startLoadingMessage = notif.message;

            mohican.validateLayoutParameter(that.stateMachine.layout, that.layouts, that.mnRouter);
            that.service.getBackendFilters().then(function(documentFilters) {
              documentFilters.forEach(function(documentFilter) {
                that.documentFilters.push({
                  name:     documentFilter.name,
                  show:     'Filter: ' + documentFilter.name,
                  selected: documentFilter.name === that.stateMachine.documentFilter
                });
              });
              mohican.validateBackendFilterParameter(that.stateMachine.documentFilter, that.documentFilters, that.mnRouter);
            });
            //we need to load only stateMachine.filters instead of whole stateMachine
            //because loadFromUrl is initialy designed to load qucik filter after
            //all eager data has been loaded
            that.stateMachine.filters = mohican.urlQfParamToJson(that.mnRouter.$stateParams.filters, that.fields);

            that.fullyLoaded = false;

            that.loadMnGridItems();
          }
        });
      },

      pageChanged: function(page) {
        var that = this;
        if(!this.fullyLoaded) {
          this.stateMachine.page = parseInt(page);
          // this.stateMachine.layout = undefined;
          this.stateMachine.column = undefined;
          this.stateMachine.direction = undefined;
          this.stateMachine.quickFilterShown = false;
          this.stateMachine.filters = undefined;

          this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                         this.stateMachine.toUrl(this.fields),
                         { notify: true });
        }
        else {
          var pageBefore = that.stateMachine.page;
          that.stateMachine.page = parseInt(page);
          this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                         this.stateMachine.toUrl(this.fields),
                         { notify: false })
                       .then(function() {
                         that.service.getClientPage(that.stateMachine.page,
                                                    that.stateMachine.column,
                                                    that.stateMachine.direction,
                                                    that.stateMachine.filters,
                                                    that.fields).then(function(data) {
                           that.stateMachine.page = parseInt(page);
                           that.items = data.items;
                           that.pageCount = data.pageCount;
                           that.totalQfCount = data.totalQfCount;
                           mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
                         });
                       }, function() {
                         //TODO: make it better
                         //if transitionTo validations is rejected,
                         //rollback stateMachine
                         that.stateMachine.page = pageBefore;
                       });
        }
      },

      clientLayoutChanged: function(newLayoutName) {
        var deffered = this.$q.defer();
        var that = this;

        var fieldsBefore = _.clone(that.fields);
        var layoutBefore = that.stateMachine.layout;

        that.layoutDefs.forEach(function(layout) {
          if(layout.name === newLayoutName) {
            that.stateMachine.layout = newLayoutName;
          }
        });

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.toUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.stateMachine.page = 1;
                        that.layoutDefs.forEach(function(layout) {
                          if(layout.name === newLayoutName) {
                            that.fields = layout.definition;
                            that.stateMachine.layout = newLayoutName;
                          }
                        });
                        deffered.resolve();
                      }, function() {
                        that.fields = _.clone(fieldsBefore);
                        that.stateMachine.layout = layoutBefore;
                        deffered.reject();
                      });

        return deffered.promise;
      },

      getBackendFilter: function(documentFilter, openfilters) {
        var that = this;
        console.log(openfilters);
        var deffered = this.$q.defer();

        // var newRouteParams = _.clone(this.mnRouter.$stateParams);
        // newRouteParams.page = undefined;
        // // newRouteParams.layout = undefined;
        // newRouteParams.column = undefined;
        // newRouteParams.direction = undefined;
        // newRouteParams.quickFilterShown = false;
        // newRouteParams.filters = undefined;
        // newRouteParams.documentfilter = documentFilter;
        // newRouteParams.openfilters = mohican.openfiltersToUrlParam(openfilters);
        // var transitionParams = mohican.escapeDefaultParameters(newRouteParams);
        // console.log(transitionParams, newRouteParams);

        that.stateMachine.page = undefined;
        // that.stateMachine.layout = undefined;
        that.stateMachine.column = undefined;
        that.stateMachine.direction = undefined;
        that.stateMachine.quickFilterShown = false;
        that.stateMachine.filters = undefined;
        that.stateMachine.documentfilter = documentFilter;
        that.stateMachine.openfilters = openfilters;

        console.log(that.stateMachine.toUrl(that.fields));

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(), that.stateMachine.toUrl(that.fields)).
                      then(function() {
                        deffered.resolve();
                      }, function() {
                        deffered.reject();
                      });

        return deffered.promise;
      },

      clientViewChanged: function(column, direction) {
        var deffered = this.$q.defer();
        var that = this;

        var columnBefore = that.stateMachine.column;
        var directionBefore = that.stateMachine.direction;
        var pageBefore = that.stateMachine.page;

        if(column) {
          that.stateMachine.column = column;
        }
        if(direction) {
          that.stateMachine.direction = direction;
        }
        that.stateMachine.page = 1;//for all client side actions reset page to 1

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.toUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.service.getClientPage(that.stateMachine.page,
                                                   that.stateMachine.column,
                                                   that.stateMachine.direction,
                                                   that.stateMachine.filters,
                                                   that.fields).then(function(data) {
                          that.items = data.items;
                          that.pageCount = data.pageCount;
                          that.totalQfCount = data.totalQfCount;
                          mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);

                          deffered.resolve();
                        });
                      }, function() {
                        //TODO: make it better
                        //if transitionTo validations is rejected,
                        //rollback stateMachine
                        // console.log(filtersBefore);
                        // that.stateMachine.filters = filtersBefore;
                        that.stateMachine.column = columnBefore;
                        that.stateMachine.direction = directionBefore;
                        that.stateMachine.page = pageBefore;

                        deffered.reject();
                      });
        return deffered.promise;
      },

      toggleQuickFilter: function() {
        var that = this;
        var quickFilterShownBefore = that.stateMachine.quickFilterShown;
        var pageBefore = that.stateMachine.page;
        var filtersBefore = _.cloneDeep(that.stateMachine.filters);

        that.stateMachine.page = 1;//for all client side actions reset page to 1
        that.stateMachine.quickFilterShown = !that.stateMachine.quickFilterShown;
        if(!that.stateMachine.quickFilterShown) {
          that.stateMachine.filters = undefined;
        }

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.toUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.service.getClientPage(that.stateMachine.page,
                                                   that.stateMachine.column,
                                                   that.stateMachine.direction,
                                                   that.stateMachine.filters,
                                                   that.fields).then(function(data) {
                          that.items = data.items;
                          that.pageCount = data.pageCount;
                          that.totalQfCount = data.totalQfCount;
                          mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
                        });
                      }, function() {
                        //TODO: make it better
                        //if transitionTo validations is rejected,
                        //rollback stateMachine
                        that.stateMachine.quickFilterShown = quickFilterShownBefore;
                        that.stateMachine.filters = filtersBefore;
                        that.stateMachine.page = pageBefore;
                      });
      },

      clearClientSortAndFilter: function() {
        this.stateMachine.page = undefined;
        // this.stateMachine.layout = undefined;
        this.stateMachine.column = undefined;
        this.stateMachine.direction = undefined;
        this.stateMachine.quickFilterShown = false;
        this.stateMachine.filters = undefined;

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.toUrl(this.fields),
                       { notify: true });
      },

      createSubDocsBasicDriver: function($injector, collectionName, fields) {
        var basicDrv = {};
        mohican.extendBasicDriver(basicDrv, $injector, collectionName, fields);
        _.assign(basicDrv, mohican.mixins.dataFieldsMixin);

        this.onCurrentItemChanged.push(function(newCurrentItem) {
          if(!newCurrentItem[basicDrv.collectionName]) {
            newCurrentItem[basicDrv.collectionName] = [];
          }
          basicDrv.items = newCurrentItem[basicDrv.collectionName];
        });

        return basicDrv;
      }
    };
  };
}(window.mohican));

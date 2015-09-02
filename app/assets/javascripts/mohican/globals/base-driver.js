(function(mohican) {
  'use strict';

  mohican.createBaseDriver = function($injector) {
    return {
      modal: $injector.get('$modal'),

      $q: $injector.get('$q'),

      stateMachine: mohican.createStateMachine(),

      currentItemChanged: function() {},

      initialize: function() {},

      loadData: function() {},

      pageChanged: function() {},

      clientLayoutChanged: function() { return $q.when(); },

      getBackendFilter: function() {},

      clientViewChanged: function() {},

      toggleQuickFilter: function() {},

      clearClientSortAndFilter: function() {},

      mnDialogVisible: false,

      popDialog: function(title, templateUrl, options) {
        if(!options) { options = {}; }
        if(!options.ctrl) { options.ctrl = this; }
        var modalInstance = this.modal.open({
          animation: true,

          template: '<div class="modal-header">                                   \
            <button type="button" class="close"                                   \
                    data-dismiss="modal" ng-if="!options.hideHeaderX"             \
                    ng-click="cancel(\'header x-ed\')">&times;</button>           \
            <h3 class="modal-title">{{mnDialogActiveTitle}}</h3>                  \
          </div>                                                                  \
          <div class="modal-body" modal-fit-in-window>                            \
            <ng-include src="mnDialogActiveTemplate"></ng-include>                \
          </div>                                                                  \
          <div class="modal-footer" ng-if="!options.hideFooter">                  \
            <button class="btn btn-primary" ng-click="ok()">OK</button>           \
            <button class="btn btn-warning" ng-click="cancel()">Cancel</button>   \
          </div>',

          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.ok = function(result) {
              $modalInstance.close(result);
            };
            $scope.cancel = function(reason) {
              $modalInstance.dismiss(reason);
            };
            $scope.mnDialogActiveTitle = title;
            $scope.mnDialogActiveTemplate = templateUrl;
            $scope.ctrl = options.ctrl;
            $scope.options = options;
          }],

          backdrop: options.backdrop || 'static',

          size: options.dialogSize || 'lg'
        });

        return modalInstance.result;
      },
    };
  };
}(window.mohican));

(function(mohican) {
  'use strict';

  mohican.createBaseDriver = function() {
    return {
      stateMachine: mohican.createStateMachine(),

      currentItemChanged: function() {},

      initialize: function() {},

      loadData: function() {},

      pageChanged: function() {},

      clientLayoutChanged: function() {},

      getBackendFilter: function() {},

      clientViewChanged: function() {},

      toggleQuickFilter: function() {},

      clearClientSortAndFilter: function() {},

      mnDialogVisible: false,

      popDialog: function(title, templateUrl, ctrl) {
        if(!ctrl) ctrl = this;
        var modalInstance = this.modal.open({
          // animation must stay off until the bug is fixed in 
          // angular-ui-bootstrap-rails, maybe version 13.2 fixes it but is not out.
          animation: false,
          template: '<div class="modal-header">                                   \
            <h3 class="modal-title">{{mnDialogActiveTitle}}</h3>                  \
          </div>                                                                  \
          <div class="modal-body">                                                \
            <p>I am the dialog</p>                                                \
            <ng-include src="mnDialogActiveTemplate"></ng-include>                \
          </div>                                                                  \
          <div class="modal-footer">                                              \
            <button class="btn btn-primary" ng-click="ok()">OK</button>           \
            <button class="btn btn-warning" ng-click="cancel()">Cancel</button>   \
          </div>',
          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.ok = function(result) {
              $modalInstance.close(result);
            };
            $scope.cancel = function(reason) {
              $modalInstance.dismiss(reason);
            };
            $scope.mnDialogActiveTitle = title;
            $scope.mnDialogActiveTemplate = templateUrl;
            $scope.ctrl = ctrl;
          }],
          backdrop: 'static',
          size: 'lg'
        });

        modalInstance.result.then(function () {
          console.log('Modal success at: ' + new Date());
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
        
        return modalInstance.result;
      },
      closeDialog: function() {
        this.mnDialogVisible = false;
      }
    };
  };
}(window.mohican));

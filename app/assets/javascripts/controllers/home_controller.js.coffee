@id5_module.controller 'HomeController', [
  '$scope', ($scope) ->
    $scope.criteria =
      criteria_text: null
    $scope.handle_search_criteria_change = ->
      console.log "Text change, now it is #{$scope.criteria.criteria_text}"
    $scope.handle_search_button_click = ->
      console.log "Search button clicked"
]
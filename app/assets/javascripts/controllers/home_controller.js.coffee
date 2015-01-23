@id5_module.controller 'HomeController', [
  '$scope', '$routeParams', '$location', '$window', '$timeout', 'actService', 
  ($scope, $routeParams, $location, $window, $timeout, actService) ->
    $scope.criteria =
      criteria_text: null
    $scope.handle_search_criteria_change = ->
      console.log "Text change, now it is #{$scope.criteria.criteria_text}"
    $scope.handle_search_button_click = ->
      console.log "Search button clicked"
    $scope.isCollapsed = true;
    $scope.alerts = []
    $scope.alertMe = ->
      $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
      ]
    $scope.addAlert = ->
      $scope.alerts.push({msg: 'Another alert!'});
    $scope.closeAlert = (index) ->
      $scope.alerts.splice(index, 1);
    $scope.pageNo = 1
    $scope.pageNo = $routeParams.pageNo
    if !$scope.pageNo or parseInt($scope.pageNo) < 0
      $location.path("1")
    $scope.handle_search_criteria_change = ->
      console.log "Text change, now it is #{$scope.criteria.criteria_text}"
    $scope.handle_search_button_click = ->
      console.log "Search button clicked"
    $scope.page_items = null
    $scope.page_count = null
    $scope.error_message = null
    $scope._rememberPageItems = (resp) ->
      $scope.page_items = resp.items
      $scope.page_count = resp.page_count
      $scope.error_message = null
      if parseInt($scope.pageNo) > $scope.page_count
        $location.path("#{$scope.page_count}")
    $scope._errorHandler = (error) ->
      $scope.error_message = "An error has occured."
    $scope.prevPage = parseInt($scope.pageNo) - 1
    $scope.nextPage = parseInt($scope.pageNo) + 1
    $scope.goToPage = (pageNumber) ->
      if pageNumber > 0 and pageNumber <= $scope.page_count and parseInt(pageNumber) != parseInt($scope.pageNo)
        $location.path("#{pageNumber}")
    $scope.is_first_page = ->
      parseInt($scope.pageNo) == 1
    $scope.is_last_page = ->
      parseInt($scope.pageNo) == $scope.page_count
    $scope.max_to_show = 11
    $scope.pagination_array = ->
      start_page = Math.max(1, $scope.pageNo - Math.max(Math.floor($scope.max_to_show / 2), $scope.max_to_show - $scope.page_count + parseInt($scope.pageNo) - 1))
      end_page = Math.min($scope.page_count, start_page + $scope.max_to_show - 1)
      for number in [start_page..end_page]
        (result = (result or new Array())).push number
      result
    $scope.showPageNumber = (page_number, index) ->
      if index == 0 and page_number > 1 or 
      index == $scope.max_to_show - 1 and page_number < $scope.page_count
        "..."
      else
        page_number
    $scope.sort_by = (field_name) ->
      actService.sort_by(field_name)
      actService.page_items(decodeURIComponent($scope.pageNo))
      .then($scope._rememberPageItems,$scope._errorHandler)

    $scope.listLayouts = [
      { name: "Default", show: "Layout: Default", desc: "Shows most important fields", selected: true  },
      { name: "Full view", show: "Layout: Full", desc: "All available fields (requires scrolling)", selected: false  },
      { name: "Simple view", show: "Layout: Simple", desc: "View orders and customers", selected: false  },
    ]
    $scope.listFitlers = [
      { name: "Show all", show: "Filter: none (show all)", desc: "Shows all available documents", selected: true  },
      { name: "Today", show: "Filter: today", desc: "Shows only documents to be handled today", selected: false  },
      { name: "Tomorrow", show: "Filter: tomorrow", desc: "Shows only documents to be handled tomorrow", selected: false  },
      { name: "This week", show: "Filter: this week", desc: "Shows only documents to be handled this week, including today", selected: false  },
    ]
    $scope.listSorting = [
      { name: "Order ID", show: "Sort by: ID", desc: "Sort by Order ID", selected: true  },
      { name: "RPL_City", show: "Sort by: Lähtöos. kaupunki", desc: "Sort by Lähtöosoitteen kaupunki", selected: false  },
      { name: "RPU_ZipCode", show: "Sort by: Määräos. postinumero", desc: "Sort by Määräosoitteen postinumero", selected: false  },
      { name: "RPU_City", show: "Sort by: Määräos. kauppunki", desc: "Sort by Määräosoitteen kauppunki", selected: false  },
    ]
    actService.page_items(decodeURIComponent($scope.pageNo))
    .then($scope._rememberPageItems,$scope._errorHandler)
]

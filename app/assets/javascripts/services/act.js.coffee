@id5_module.service 'actService', [
  'mnBaseService',
  actService = (mnBaseService) ->
    mnBaseService.extends_to(this)
    @front_end_buffer_size = 5000
    @eagerness = 30
    @page_size = 20
    @identifier = 'Order_ID'
    @resource_url = 'activities'
    @resource_name = 'tag'
    @use_dotjson_suffix = false
    @currently_sorted_by = null
    @sort_by = (field_name) ->
      start = +new Date();
      console.log "Sorting by #{field_name}, array length #{@front_end_buffer.length}"
      @front_end_buffer.sort (a,b) ->
        if a.copy[field_name] < b.copy[field_name]
          return -1
        if a.copy[field_name] > b.copy[field_name]
          return 1
        return 0
      @currently_sorted_by = field_name
      console.log "Done sorting #{(+new Date()) - start}ms."
    this]
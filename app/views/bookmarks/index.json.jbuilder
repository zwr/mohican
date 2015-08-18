json.array!(@bookmarks) do |bookmark|
  json.extract! bookmark, :id, :name, :url, :bookmark_order, :panel_index
  json.url bookmark_url(bookmark, format: :json)
end

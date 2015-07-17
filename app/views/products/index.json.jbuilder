json.array!(@products) do |product|
  json.extract! product, :id, :name, :ean
  json.url product_url(product, format: :json)
end

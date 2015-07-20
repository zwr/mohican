json.array!(@orders) do |order|
  json.extract! order, :id, :order_number, :user_id, :status, :total, :items
  json.url order_url(order, format: :json)
end

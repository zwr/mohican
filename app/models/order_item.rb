class OrderItem
  include Mongoid::Document
  field :quantity, type: Integer
  belongs_to :product
  embedded_in :order
end

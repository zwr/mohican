class Product
  include Mongoid::Document
  field :name, type: String
  field :ean, type: String
end

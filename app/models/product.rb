class Product
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  include Mohican::Document

  field :name, type: String
  field :ean, type: String
end

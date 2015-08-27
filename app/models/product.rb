class Product
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  field :name, type: String
  field :ean, type: String

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j
  end
end

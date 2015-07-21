class Order
  include Mongoid::Document
  include Mongoid::Timestamps
  field :order_number, type: Integer
  field :status, type: String
  field :total, type: Integer
  field :items, type: Array
  belongs_to :creator, class_name: 'User'
  has_and_belongs_to_many :handlers, class_name: 'User'
  embeds_many :order_items

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j
  end
end

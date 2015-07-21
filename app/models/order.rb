class Order
  include Mongoid::Document
  include Mongoid::Timestamps
  field :order_number, type: Integer
  field :status, type: String
  field :total, type: Integer
  field :items, type: Array
  belongs_to :creator, class_name: 'User'
  has_and_belongs_to_many :handlers, class_name: 'User'
  has_and_belongs_to_many :__products, class_name: 'Product'
  embeds_many :order_items
  before_save :remember_products

  def remember_products
    self.__products = order_items.map(&:product)
  end

  def build_object
    {
      creator: creator,
      handlers: handlers,
      order_items: order_items.map.with_index do |item, i|
        res = item.as_json.merge product: __products[i].as_json
        res.reject { |k, _v| k == 'order_ids' } unless res.nil?
      end
    }
  end

  def as_json(options = nil)
    j = super.as_json(options)
    j.merge! build_object
    j[:_mnid] = id.to_s
    j.reject! { |k, _v| k.to_s.starts_with? '__' }
    j
  end
end

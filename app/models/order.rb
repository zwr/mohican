class OrderHandler
  include Mongoid::Document
  field :user_name
  belongs_to :user
end

class OrderItem
  include Mongoid::Document
  field :quantity, type: Integer
  field :product_name, type: String
  field :product_ean, type: String
  field :product_id, type: String
  belongs_to :product
  embedded_in :order
end

class Order
  include Mongoid::Document
  include Mongoid::Timestamps
  field :order_number, type: Integer
  field :status, type: String
  field :total, type: Integer
  field :items, type: Array
  belongs_to :creator, class_name: 'User'
  field :creator_name, type: String
  has_and_belongs_to_many :__handlers, class_name: 'User'
  has_and_belongs_to_many :__products, class_name: 'Product'
  embeds_many :order_items
  embeds_many :order_handlers

  before_create :remember_referenced_object_data
  before_save :remember_references

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j.reject! { |k, _v| k.to_s.starts_with? '__' }
    j
  end

  private

  def remember_references
    self.__products = order_items.map(&:product)
    self.__handlers = order_handlers.map(&:user)
  end

  def remember_referenced_object_data
    rails RuntimeError, 'Creator not specified' unless creator.present?
    self.creator_name = creator.name
    order_handlers.each do |handler|
      handler.user_name = handler.user.name
      handler.user_id = handler.user.id
    end
    order_items.each do |item|
      item.product_name = item.product.name
      item.product_ean = item.product.ean
      item.product_id = item.product.id
    end
  end
end

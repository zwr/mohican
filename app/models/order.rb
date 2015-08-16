class OrderHandler
  include Mongoid::Document
  field :user_name, type: String
  field :user_ref, type: String
  belongs_to :user
end

class OrderItem
  include Mongoid::Document
  field :quantity, type: Integer
  field :product_name, type: String
  field :product_ean, type: String
  field :product_ref, type: String
  belongs_to :product
  embedded_in :order
end

class Order
  include Mongoid::Document
  include Mongoid::Timestamps

  field :order_number, type: Integer
  field :status, type: String
  field :total, type: Integer
  field :delivery_date, type: Date
  field :actual_delivery_date, type: Date

  # Status field must be exactly one of the STATUS values
  STATUS = [:open, :processing, :delivered, :deferred]
  field :status, type: String

  # Delvivery tag field is a string of comma-separated values of none, one or
  # more of the DELIVERY_TAG values
  DELIVERY_TAGS = [:standard, :urgent, :insured, :fragile, :flammable,
                   :tax_free, :export, :import, :secret, :poison,
                   :large, :heavy]
  field :delivery_tag, type: String

  belongs_to :creator, class_name: 'User'
  field :creator_name, type: String
  field :creator_ref, type: String
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
    self.creator_ref = creator.id.to_s
    order_handlers.map! do |handler|
      handler.user_name = handler.user.name
      handler.user_ref = handler.user.id.to_s
      handler
    end
    order_items.map! do |item|
      item.product_name = item.product.name
      item.product_ean = item.product.ean
      item.product_ref = item.product.id.to_s
      item
    end
  end
end

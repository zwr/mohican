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
  include Mohican::Document

  field :order_number, type: Integer
  field :status, type: String
  field :total, type: Integer
  field :delivery_date, type: Date
  field :actual_delivery_date, type: Date
  field :cell_id, type: BSON::ObjectId
  field :next_cells, type: Array

  include_into_json :cell_name, label: :cell

  def cell_name
    cell.name if cell.present?
  end

  def cell
    ProductionLine.cells.select { |c| c.id == cell_id }[0]
  end

  def cell=(cell)
    self.cell_id = cell.id
  end

  def production_cell
    ProductionLine.cells.select { |c| c.id == cell_id }[0]
  end

  # Status field must be exactly one of the STATUS values
  STATUS = [:created, :avoinna, :valmis, :deferred, :tuotannossa, :delivered]
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
  after_save :create_order_for_next_step

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

  def create_order_for_next_step
    return unless status_changed? && (status_was == 'tuotannossa') &&
                  (status == 'valmis') && next_cells.present?
    x = dup
    x.status = 'avoinna'
    x.cell_id = x.next_cells.slice!(0)
    x.save!
    puts "Closed order in cell #{cell.name}"
    puts "Created a new order for cell #{x.cell.name}"
  end
end

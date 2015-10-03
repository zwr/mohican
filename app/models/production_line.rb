class ProductionCell
  include Mongoid::Document
  field :name, type: String
  embedded_in :production_line
end

class ProductionLine
  include Mongoid::Document
  include Mohican::Document

  field :name, type: String
  embeds_many :production_cells

  def self.seed
    lines = {
      'Line 1': ['Sahaus', 'Oksien poisto', 'Höyläys', 'Maalaus'],
      'Trukit ja varastot': ['Trukki 1', 'Trukki 2', 'Trukki 3', 'Varasto'],
      'Line 2': %w(Kuorinta Särmäys Rajaus Lajittelu),
      'Line 3': ['Heino Sahaus', 'Pintaan valmistelu', 'Kuivaus', 'Pakkaus']
    }
    ProductionLine.delete_all
    lines.each do |name, cells|
      p = ProductionLine.new name: name
      cells.each { |c| p.production_cells.new name: c }
      p.save!
    end
  end

  def self.lines_order_status
    this_week = Date.today.prev_week..(Date.today.next_week - 1.day)
    all.map do |line|
      {
        id: line.id,
        name: line.name,
        cells: line.production_cells.map do |cell|
          {
            name: cell.name,
            today: {
              kaikki: Order.where(cell_id: cell.id, delivery_date: Date.today).count,
              avoinna: Order.where(cell_id: cell.id, delivery_date: Date.today, status: :avoinna).count,
              valmis: Order.where(cell_id: cell.id, delivery_date: Date.today, status: :valmis).count,
              tuotannossa: Order.where(cell_id: cell.id, delivery_date: Date.today, status: :tuotannossa).count
            },
            week: {
              kaikki: Order.where(cell_id: cell.id, delivery_date: this_week).count,
              avoinna: Order.where(cell_id: cell.id, delivery_date: this_week, status: :avoinna).count,
              valmis: Order.where(cell_id: cell.id, delivery_date: this_week, status: :valmis).count,
              tuotannossa: Order.where(cell_id: cell.id, delivery_date: this_week, status: :tuotannossa).count
            }
          }
        end
      }
    end
  end

  def update(params)
    self.name = params[:name] if params[:name]
    params[:production_cells].each do |cell_params|
      production_cells.find(cell_params[:_id][:$oid]).name = cell_params[:name]
    end if params[:production_cells]
    save
  end

  def self.lines
    all
  end

  def self.cells
    ProductionLine.all.map(&:production_cells).flatten
  end
end

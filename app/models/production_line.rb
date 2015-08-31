class ProductionLine
  def self.all
    {
      'Line 1': ['Sahaus', 'Oksien poisto', 'Höyläys', 'Maalaus'],
      'Line 2': %w(Kuorinta Särmäys Rajaus Lajittelu),
      'Line 3': ['Heino Sahaus', 'Pintaan valmistelu', 'Kuivaus', 'Pakkaus']
    }
  end

  def self.lines_order_status
    this_week = Date.today.prev_week..(Date.today.next_week - 1.day)
    all.map do |line, cell_list|
      {
        name: line,
        cells: cell_list.map do |cell_name|
          {
            name: cell_name,
            today: {
              kaikki: Order.where(cell: cell_name, delivery_date: Date.today).count,
              avoinna: Order.where(cell: cell_name, delivery_date: Date.today, status: :avoinna).count,
              valmis: Order.where(cell: cell_name, delivery_date: Date.today, status: :valmis).count,
              tuotannossa: Order.where(cell: cell_name, delivery_date: Date.today, status: :tuotannossa).count
            },
            week: {
              kaikki: Order.where(cell: cell_name, delivery_date: this_week).count,
              avoinna: Order.where(cell: cell_name, delivery_date: this_week, status: :avoinna).count,
              valmis: Order.where(cell: cell_name, delivery_date: this_week, status: :valmis).count,
              tuotannossa: Order.where(cell: cell_name, delivery_date: this_week, status: :tuotannossa).count
            }
          }
        end
      }
    end
  end

  def self.lines
    all
  end

  def self.cells
    lines.values.flatten
  end
end

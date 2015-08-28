class ProductionLine
  def self.all
    {
      'Line 1': ['Sahaus', 'Oksien poisto', 'Höyläys', 'Maalaus'],
      'Line 2': %w(Kuorinta Särmäys Rajaus Lajittelu),
      'Line 3': ['Heino Sahaus', 'Pintaan valmistelu', 'Kuivaus', 'Pakkaus']
    }
  end

  def self.lines
    all
  end

  def self.cells
    lines.values.flatten
  end
end

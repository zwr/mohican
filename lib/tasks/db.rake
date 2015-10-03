require 'random_hash'

SEED_ORDER_COUNT = 1127
HANDLERS_COUNT = { '10': (1..3) }
ORDER_ITEMS_COUNT = { '10': (1..3) }
ITEM_PRODUCT_COUNT = { '1': (1..12), '9': (1..5000) }

namespace :db do
  namespace :seed do
    desc 'Seed the wood products and orders, delete others'
    task wood: :environment do
      unless ENV['skip_products']
        Product.delete_all
        Nokogiri::HTML(File.open(Rails.root.join 'puut', 'puutavara-k--rauta.fi.html'))
          .css('div.product div.image a')
          .each do |link_element|
            p = Nokogiri::HTML(open(link_element.attribute('href').value))
            pinfo = p.css('h3.sku')
                    .text
                    .gsub(/[\n\t]+/, ' ')
                    .match(/Tuotenumero: (\d+) EAN: (\d+)/)
            pr = Product.create! name: p.css('h1').first.text,
                                 product_id: pinfo[1],
                                 ean: pinfo[2]
            puts "Created product #{pr.name}, #{pr.product_id}, #{pr.ean}"
          end
      end
      Order.delete_all
      orders = []
      # Now will seed 100 oders, or however many are specified by the environment var order_count
      order_count = (ENV['order_count'] || 1000).to_i
      (1..order_count).each do
        x = Order.new
        x.total = rand 1..1000
        x.delivery_date  = Date.today.beginning_of_week + rand(30).days
        if x.delivery_date < Date.today
          x.status = :valmis
        elsif x.delivery_date < 2.days.from_now
          x.status = [:avoinna, :valmis, :tuotannossa][rand 0..2]
        else
          x.status = :avoinna
        end
        x.order_number = rand 10_000..99_999
        x.creator = (random User).id
        x.delivery_tag = Order::DELIVERY_TAGS.sample(HANDLERS_COUNT.random).join ','

        (1..HANDLERS_COUNT.random).each do
          x.order_handlers << OrderHandler.new(user: random(User))
        end

        (1..ORDER_ITEMS_COUNT.random).each do
          y = OrderItem.new
          y.product = random(Product)
          y.quantity = ITEM_PRODUCT_COUNT.random
          x.order_items << y
        end

        trukit = ProductionLine.all[1].production_cells[0..2]
        varasto = ProductionLine.all[1].production_cells[3]
        nontrukit = ProductionLine.cells - trukit - [varasto]

        # Start in a random cell
        x.cell = ProductionLine.cells.sample

        x.next_cells = []
        # if cell is a trukki, add (not trukki) (trukki) (varasto)
        if trukit.include? x.cell
          x.next_cells << nontrukit.sample.id << (trukit - [x.cell]).sample.id << varasto.id
        else
          next_cells_rule = rand(10)
          if next_cells_rule < 4
            # for 40 percent: Select 2 more cells: (trukki) (varasto)
            x.next_cells << trukit.sample.id << varasto.id
          elsif next_cells_rule < 7
            # for 30 percent, select 5 more cells: (not trukki) (trukki) (not trukki) (trukki) (varasto)
            x.next_cells << (nontrukit - [x.cell]).sample.id <<
              trukit.sample.id <<
              (nontrukit - [x.cell] - x.next_cells).sample.id <<
              (trukit - x.next_cells).sample.id <<
              varasto.id
          else
            # for 30 remaining percent, select 4 more cells: (trukki) (not trukki) (trukki) (varasto)
            x.next_cells << trukit.sample.id <<
              (nontrukit - [x.cell] - x.next_cells).sample.id <<
              (trukit - x.next_cells).sample.id <<
              varasto.id
          end
        end
        orders << x
      end

      puts 'Created order seeds, saving...'
      orders.each(&:save!)
      puts "Seeded #{Order.count} orders with many products."
    end
  end
end

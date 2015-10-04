require 'random_hash'

Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

puts 'Clearing the database'

Layout.delete_all
User.delete_all
Product.delete_all
Order.delete_all

User.create! email: 'mohican@zwr.fi',
             password: 'mohican123',
             name: 'Jessica Mongo'

ProductionLine.seed

array_of_users = []
File.open(Rails.root.join 'db', 'seeds', 'users.csv').each do |line|
  u = line.split ','
  array_of_users << {
    name: "#{u[1]} #{u[2]}",
    gender: u[0],
    address_street: u[3],
    address_city: u[4].capitalize,
    address_post_number: u[5],
    email: u[6],
    username: u[7],
    password: u[8],
    date_of_birth: Date.strptime(u[9], '%m/%d/%Y'),
    cc_type: u[10],
    cc_number: u[11],
    cc_cvc: u[12],
    cc_exp: u[13],
    telnum: u[14]
  }
end
User.collection.insert array_of_users
puts "Seeded #{User.count} users."

array_of_products = []
File.open(Rails.root.join 'db', 'seeds', 'products.csv').each do |line|
  u = line.split(/,(?=(?:[^"]|"[^"]*")*$)/).map { |x| x.gsub /^\"|\"?$/, '' }
  array_of_products << { name: u[0], ean: u[1] }
end
Product.collection.insert array_of_products
puts "Seeded #{Product.count} products."

SEED_ORDER_COUNT = 1127
HANDLERS_COUNT = { '8': (1..5), '1': (0..0), '1_': (6..20) }
ORDER_ITEMS_COUNT = { '8': (3..12), '1': (1..2), '1_': (3..200) }
ITEM_PRODUCT_COUNT = { '9': (1..12), '1': (1..5000) }
TAG_COUNT = { '1': (0..0), '8': (1..5), '1_': (6..Order::DELIVERY_TAGS.length) }

orders = []
(1..SEED_ORDER_COUNT).each do
  x = Order.new
  x.total = rand 1..1000
  x.status = [:created, :open, :closed][rand 0..2]
  x.order_number = rand 10_000..99_999
  x.creator = (random User).id
  x.delivery_tag = Order::DELIVERY_TAGS.sample(TAG_COUNT.random).join ','

  x.delivery_date = (rand(30) - 5).days.ago
  x.status = if x.delivery_date > Date.today
               :open
             elsif x.delivery_date < 15.days.ago
               :delivered
             else
               Order::STATUS.sample
             end

  x.actual_delivery_date = rand(23).days.ago if x.status == :delivered

  (1..HANDLERS_COUNT.random).each do
    x.order_handlers << OrderHandler.new(user: random(User))
  end

  (1..ORDER_ITEMS_COUNT.random).each do
    y = OrderItem.new
    y.product = random(Product)
    y.quantity = ITEM_PRODUCT_COUNT.random
    x.order_items << y
  end

  orders << x
end

puts 'Created order seeds, saving...'
orders.each(&:save!)
puts "Seeded #{Order.count} orders with many products."

puts 'Seeding bookmarks...'
Bookmark.create! name: 'Open Orders',
                 url: 'orders?qf=true&filters=status$open',
                 bookmark_order: 1,
                 panel_index: nil

Bookmark.create! name: 'Current Products',
                 url: 'products',
                 bookmark_order: 2

Bookmark.create! name: 'Employees',
                 url: 'users',
                 bookmark_order: 3

# puts 'Seeding 2000 production orders, this can take up to 1o sedonds'
# `rake db:seed:wood skip_products=yes order_count=2000`

puts 'Seeded.'

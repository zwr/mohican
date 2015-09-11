Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

activities = JSON.parse(IO.read(Rails.root.join('db', 'seeds', 'activities.json')))

puts 'Clearing the database'

Activity.delete_all
Layout.delete_all
User.delete_all
Product.delete_all
Order.delete_all

User.create! email: 'mohican@zwr.fi',
             password: 'mohican123',
             name: 'Jessica Mongo'

puts "Seeding #{activities['items'].length} activities"

activities['items'].each_with_index do |a, index|
  # We want to store as date those fields that are dates
  a.as_json.each do |key, value|
    next unless value.class == String && value.length > 12
    begin
      maybe_date = DateTime.zone.parse(value)
      a[key] = maybe_date
      # rubocop:disable HandleExceptions
    rescue
      # rubocop:enable HandleExceptions
      # we are fine, it is not a date
    end
  end
  if (rand(847) != 33) # this is awesome
    a['RPL_MinTime'] = (rand(100).days.ago + 50.days).to_datetime
  end
  if index == 3
    a[:products] = [
      { name: 'Pirkka suomalainen kirsikkatomaatti 250g', ean: '6410402024018' },
      { name: 'Pirkka miniluumutomaatti 250g ulkomainen 1lk', ean: '6410405060457' },
      { name: 'Avomaankurkku Suomi', ean: '2000600000002' },
      { name: 'Tomaatti Suomi', ean: '2000614400003' },
      { name: 'Kurkku   Suomi', ean: '2000604700007' },
      { name: 'Terttutomaatti punainen ulkomainen', ean: '2000625700000' },
      { name: 'Kirsikkatomaattirasia 250g Suomi 1lk', ean: '6415350000305' },
      { name: 'Kurkku Suomi', ean: '2000643200001' },
      { name: 'Pirkka luomu tomaatti 400 g Suomi 1lk', ean: '6410405041708' },
      { name: 'Pirkka suomalainen luumutomaatti 500 g', ean: '6408641034011' },
      { name: 'Pirkka suomalainen tomaatti 500g', ean: '6410402025701' },
      { name: 'Pirkka kirsikkatomaatti 250 g ulkomainen', ean: '6410405043047' },
      { name: 'Pirkka luomu kirsikkatomaatti Suomi', ean: '6410405095145' },
      { name: 'Luumutomaatti keltainen 500g Suomi 1lk', ean: '6415350005997' },
      { name: 'Miniluumutomaattirasia 250g NL 1lk', ean: '8436012121082' },
      { name: 'Pirkka valkosipulikurkku 900/400g', ean: '6410405112569' },
      { name: 'Myrttisen suolakurkut 2kpl/180g Suomi', ean: '6430025256900' },
      { name: 'Peruna jauhoinen', ean: '2000680800004' },
      { name: 'Pirkka suomalainen pesty ruokaperuna keltainen 2 kg', ean: '6410402008773' },
      { name: 'Pesty peruna', ean: '2000680900001' },
      { name: 'Pirkka suomalainen pesty Siikli-peruna 1kg', ean: '6410405082725' },
      { name: 'Pirkka Luomu suomalainen pesty ruokaperuna 1,5 kg', ean: '6408641199536' },
      { name: 'Pirkka suomalainen pesty Rosamunda-uuniperuna 1,5 kg', ean: '6410402008834' },
      { name: 'Pirkka suomalainen pesty ruokaperuna sopivasti kiinteä ja jauhoinen 1 kg', ean: '6410405082763' },
      { name: 'Pirkka suomalainen pesty ruokaperuna vihreä 2 kg', ean: '6410402008797' },
      { name: 'Peruna 5kg keltainen Suomi', ean: '6415350004235' },
      { name: 'Pirkka suomalainen pesty puikulaperuna 1 kg', ean: '6410405082749' },
      { name: 'Pirkka Juhlaperuna 1kg', ean: '6410405103017' },
      { name: 'Peruna Roosa nauha 2kg Suomi', ean: '6411040033011' },
      { name: 'Pirkka suomalainen pesty ruokaperuna punainen 2 kg', ean: '6410402008636' },
      { name: 'Pirkka kypsä pariisinperuna 700g', ean: '6410405123688' },
      { name: 'Fazer Puikula Täysjyväruis 9 kpl/500 g', ean: '6411402202208' },
      { name: 'Oululainen Reissumies Tosi Tumma 8 kpl/560g', ean: '6413466101503' },
      { name: 'VAASAN Ruispalat 660 g 12 kpl täysjyväruisleipä', ean: '6437002001454' },
      { name: 'Oululainen Reissumies 4 kpl / 235g täysjyväruisleipä', ean: '6411402197108' },
      { name: 'VAASAN Isopaahto graham 500 g', ean: '6437005040986' },
      { name: 'Perheleipurit Ruisvarras 230g', ean: '6405506106111' },
      { name: 'Oululainen reissumies tumma 4kpl/280g', ean: '6413466080204' },
      { name: 'Maalahden Limppu 325 g viipaloitu', ean: '6416120000600' },
      { name: 'Pågen Oivallus! Kuitupalat 600g vehnäpalaleipä', ean: '7311071336206' },
      { name: 'Oululainen Luomu Jälkiuunipalat 4 kp/240 g täysjyväruisleipä', ean: '6413466018009' },
      { name: 'Fazer Real Ruis 420 g täysjyväruisleipä', ean: '6411402117700' },
      { name: 'Vaasan isopaahto D+ kaurapaahtoleipä 500g', ean: '6437005074899' },
      { name: 'VAASAN Isopaahto monivilja 525g paahtoleipä', ean: '6437005041020' },
      { name: 'VAASAN 100 % Kaura 400 g kaurapalaleipä', ean: '6437005058516' },
      { name: 'Sinuhe Jälkiuuni Ruisneppari 295g / 9kpl ruisleipä', ean: '6433500002993' },
      { name: 'Vaasan ruispalat tumma herkku täysjyväruisleipä 9kpl 450g', ean: '6437005075421' },
      { name: 'Oululainen Äitimuorin Herkkulimppu 450 g', ean: '6411402156006' },
      { name: 'Fazer Paahto Viisi Vijaa 520 g paahtoleipä', ean: '6411402159403' }
    ]
    a[:handlers] = [
      { name: 'Arvid,Somervuori', address: 'Kartanomäenkatu 22', city: 'VARKAUS', postno: '78400', email: 'ArvidSomervuori@teleworm.us' },
      { name: 'Julia,Holopainen', address: 'Rörgrunsvägen 78', city: 'VAASA', postno: '65200', email: 'JuliaHolopainen@fleckens.hu' },
      { name: 'Ilmari,Sainio', address: 'Pesolantie 87', city: 'KALAJOKI', postno: '85100', email: 'IlmariSainio@rhyta.com' },
      { name: 'Paula,Seppälä', address: 'Kangasmoisionkatu 90', city: 'UURAINEN', postno: '41230', email: 'PaulaSeppala@gustr.com' }
    ]
  end
  Activity.collection.insert(a)
end

puts 'Seeding activities layouts'

activities_layout  = JSON.parse(
  IO.read(Rails.root.join('db', 'seeds', 'activities_layout.json')))
activities_layout['layouts'].each do |layout|
  new_definition = []
  layout['definition'].each do |a|
    b = {}
    a.each do |old_key, value|
      b[:name] = value if old_key == 'Name'
      b[:header] = value if old_key == 'HeaderText'
      b[:width] = value if old_key == 'ColumnWidth'
      b[old_key.to_sym] = value if old_key == old_key.downcase
    end
    new_definition << b
  end
  layout['definition'] = new_definition
end

Layout.collection.insert(
  doctype: :activity,
  layout: activities_layout
)

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

class Hash
  def random
    random_group = rand(1..10)
    current_sum = 0
    keys.each do |key|
      current_sum += key.to_s.to_i
      return rand self[key] if random_group <= current_sum
    end
    # return something is someone defined it wrong
    rand values.first
  end
end

def random(c)
  @class_hash ||= {}
  @class_hash[c] = c.all.to_ary if @class_hash[c].nil?
  @class_hash[c][rand(0..@class_hash[c].count - 1)]
end

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

puts 'Seeded.'

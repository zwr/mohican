Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

activities = JSON.parse(IO.read(Rails.root.join('db','seeds','activities.json')))

puts "Seeding #{activities['items'].length} activities"

activities['items'].each do |a|
  Activity.collection.insert(a)
end
puts "Seeded."

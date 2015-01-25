Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

activities = JSON.parse(IO.read(Rails.root.join('db','seeds','activities.json')))

puts "Clearing the database"

Activity.delete_all
Layout.delete_all

puts "Seeding #{activities['items'].length} activities"

activities['items'].each do |a|
  Activity.collection.insert(a)
end

puts "Seeding activities layouts"

activities_layout  = JSON.parse(IO.read(Rails.root.join('db','seeds','activities_layout.json')))

Layout.collection.insert({
    doctype: :activity,
    layout: activities_layout
  })

puts "Seeded."

Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

activities = JSON.parse(IO.read(Rails.root.join('db','seeds','activities.json')))

puts "Seeding #{activities['items'].length} activities"

Activity.delete_all
Layout.delete_all

activities['items'].each do |a|
  Activity.collection.insert(a)
end

activities_layout  = JSON.parse(IO.read(Rails.root.join('db','seeds','activities_layout.json')))

Layout.collection.insert({
    doctype: :activity,
    layout: activities_layout
  })

puts "Seeded."

Dir[Rails.root.join('db/seeds/*.rb')].each { |file| load file }

activities = JSON.parse(IO.read(Rails.root.join('db','seeds','activities.json')))

puts "Clearing the database"

Activity.delete_all
Layout.delete_all

puts "Seeding #{activities['items'].length} activities"

activities['items'].each do |a|
  # We want to store as date those fields that are dates
  a.as_json.each do |key, value|
    if value.class == String
      begin
        maybe_date = DateTime.parse(value)
        a[key] = maybe_date
      rescue
        # we are fine, it is not a date
      end
    end
  end
  Activity.collection.insert(a)
end

puts "Seeding activities layouts"

activities_layout  = JSON.parse(IO.read(
  Rails.root.join('db','seeds','activities_layout.json')))
  new_definition = []
activities_layout["layouts"][0]["definition"].each do |a|
  b = {}
  a.each do |old_key, value|
    b[:name] = value if old_key == "Name"
    b[:header] = value if old_key == "HeaderText"
    b[:width] = value if old_key == "ColumnWidth"
    b[old_key.to_sym] = value if old_key == old_key.downcase
  end
  new_definition << b
end
activities_layout["layouts"][0]["definition"] = new_definition

Layout.collection.insert({
    doctype: :activity,
    layout: activities_layout
  })

puts "Seeded."

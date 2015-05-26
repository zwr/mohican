require 'rest_client'
require 'json'

namespace :seed do
  desc 'Create activities seed from Celesta'
  task activities: :environment do
    # We need to login first, most likely, and store that session
    address = '192.168.6.103'
    p 'useing address #{address}'
    p 'authenticating...'
    resp = RestClient.get("http://#{address}/Celesta/z/login/?username=identoi&password=identoi")
    p 'authenticated. querying activities...'
    resp2 = RestClient.get("http://#{address}/Celesta/z/activities",
                           cookies: resp.cookies, accept: :json)

    hash_response = JSON.parse(resp2.body)

    puts "RECEIVED #{hash_response['items'].count} OBJECTS!"

    # remove all null fields, to save space.
    # also flatten custom fields
    hash_response['items'].each do |i|
      i.delete_if { |_key, value| value.nil? }
      i['CustomFields'].each do |custom_field|
        i[custom_field['Name']] = custom_field['Value']
      end
      i.delete 'CustomFields'
    end

    resp_string = JSON.pretty_generate hash_response
    resp_string.force_encoding('UTF-8')
    File.open(Rails.root.join('db', 'seeds', 'activities.json'), 'w') { |f| f.write(resp_string) }
    puts 'Data saved to /db/seeds/activities.json'

    p 'authenticated. querying layouts...'
    resp3 = RestClient.get('http://#{address}/Celesta/z/activities/layout',
                           cookies: resp.cookies, accept: :json)
    hash_response = JSON.parse(resp3.body)
    resp_string = JSON.pretty_generate hash_response
    resp_string.force_encoding('UTF-8')
    File.open(Rails.root.join('db', 'seeds', 'activities_layout.json'), 'w') do |f|
      f.write(resp_string)
    end
    puts 'Data saved to /db/seeds/activities_layout.json'
  end
end

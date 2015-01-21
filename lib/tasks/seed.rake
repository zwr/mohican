require 'rest_client'
require 'json'

namespace :seed do
  desc "Create seed from Celesta"
  task activities: :environment do
    # We need to login first, most likely, and store that session
    address = "192.168.6.103"
    p "useing address #{address}"
    p "authenticating..."
    resp = RestClient.get("http://#{address}/Celesta/z/login/?username=identoi&password=identoi")
    p "authenticated. querying activities..."
    resp2 = RestClient.get("http://#{address}/Celesta/z/activities", cookies: resp.cookies, accept: :json)
    
    resp_string = resp2.body
    
    hash_response = JSON.parse(resp2.body)
    
    puts "RECEIVED #{hash_response['items'].count} OBJECTS!"
    
    resp_string.force_encoding('UTF-8')
    
    File.open(Rails.root.join('db','seeds','activities.json'), 'w') {|f| f.write(resp2.body) }
    puts "Data saved to /db/seeds/activities.json"
  end
end


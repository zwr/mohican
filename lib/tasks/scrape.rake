require 'open-uri'

def search(start_url, existing_list = [])
  start_url = "http://www.cramo.fi#{start_url}" unless start_url.include? 'http://www.cramo.fi'
  doc = Nokogiri::HTML(open(start_url))

  # find all 'li.has-children a.has-children' and get all subpages
  doc.css('li.has-children a.has-children').each do |item_node|
    new_link = item_node.attribute('href').value
    new_link = "http://www.cramo.fi#{new_link}" unless new_link.include? 'http://www.cramo.fi'
    next if existing_list.include? new_link
    puts "adding #{new_link}"
    existing_list << new_link
    existing_list = search new_link, existing_list
  end
  existing_list
end
namespace :db do
  namespace :seed do
    desc 'Searches the cramo products and seeds them'
    task tools: :environment do
      start_url = 'http://www.cramo.fi/Web/Core/Pages/BusinessAreaStartPage.aspx?id=8920&epslanguage=FI'
      product_url_list = []
      product_data_list = []
      search(start_url).each do |url|
        doc = Nokogiri::HTML(open(url))
        doc.css('table.webDepotProductTable tr').each do |product|
          begin
            product_url = product.css('td a')[2].attribute('href').value
          rescue
            puts "Not found good product url at #{url}"
            next
          end
          product_url = "http://www.cramo.fi#{product_url}" unless product_url.include? 'http://www.cramo.fi'
          product_url_list << product_url unless product_url_list.include? product_url
          puts "Now processing product at #{product_url}"
          pdoc = Nokogiri::HTML(open(product_url))
          begin
            pname = pdoc.css('.product-group h1').text
            product_data_list << { name: pname }
            puts "   found product: #{pname}"
          rescue
            puts '   Not found any product data.'
          end
        end
      end
      binding.pry
      # here should save the list
    end
  end
end

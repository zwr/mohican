namespace :db do
  namespace :seed do
    desc 'Seed the wood products, delete others'
    task wood: :environment do
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
  end
end

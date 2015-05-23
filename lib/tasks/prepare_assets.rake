require 'pathname'

namespace :zwr do
  task undigest_assets: :environment  do
    assets = Dir.glob(File.join(Rails.root, 'public/assets/**/*'))
    regex = /(-{1}[a-z0-9]{32}*\.{1}){1}/
    assets.each do |file|
      next if File.directory?(file) || file !~ regex

      source = file.split('/')
      source.push(source.pop.gsub(regex, '.'))

      non_digested = File.join(source)
      puts "Undigesting #{non_digested}"
      FileUtils.cp(file, non_digested)
    end
    `cd #{Rails.root.join('public', 'assets')} && tar -zcvf #{Rails.root.join('tmp', 'assets.tar.gz')} .`
  end
end

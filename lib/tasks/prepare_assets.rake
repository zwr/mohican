require 'pathname'

namespace :zwr do 
  task prepare_assets: :environment  do
    manifest_path = Dir.glob(File.join(Rails.root, 'public/assets/manifest-*.json')).first
    manifest_data = JSON.load(File.new(manifest_path))
        
    manifest_data["assets"].each do |logical_path, digested_path|
      logical_pathname = Pathname.new logical_path
    
      if ["*.*"].any? {|testpath| logical_pathname.fnmatch?(testpath, File::FNM_PATHNAME) }
        full_digested_path    = File.join(Rails.root, 'public/assets', digested_path)
        full_nondigested_path = File.join(Rails.root, 'public/assets/clean', logical_path)

        puts "(Umlaut) Copying to #{full_nondigested_path}"

        # Use FileUtils.copy_file with true third argument to copy
        # file attributes (eg mtime) too, as opposed to FileUtils.cp
        # Making symlnks with FileUtils.ln_s would be another option, not
        # sure if it would have unexpected issues. 
        FileUtils.copy_file full_digested_path, full_nondigested_path, true      
      end
    end
  end
end

  
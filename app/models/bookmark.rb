class Bookmark
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :url, type: String
  field :bookmark_order, type: Integer
  field :panel_index, type: Integer

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j.reject! { |k, _v| k.to_s.starts_with? '__' }
    j
  end
end

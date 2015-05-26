class Layout
  include Mongoid::Document
  field :doctype, type: String

  index doctype: 1
end

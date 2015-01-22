class Activity
  include Mongoid::Document
  field :Order_ID, type: Integer

  index Order_ID: 1
  index RPL_City: 1
  index RPU_ZipCode: 1
  index RPU_City: 1
end

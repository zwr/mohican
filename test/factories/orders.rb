FactoryGirl.define do
  factory :order do
    order_number 1
    user nil
    status 'MyString'
    total 1
    items ''
  end
end

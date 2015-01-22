Rails.application.routes.draw do
  resources :activities, defaults: { format: 'json' } do
    get 'layout', on: :collection
  end

  devise_for :users
  scope '/admin' do
    resources :users, as: 'users'
  end

  root to: 'home#index'
end

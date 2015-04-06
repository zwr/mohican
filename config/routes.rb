Rails.application.routes.draw do
  resources :activities, defaults: { format: 'json' } do
    get 'layout', on: :collection
  end

  devise_for :users
  scope '/admin' do
    resources :users, as: 'users'
  end

  get 'index_old', to: 'home#index_old'
  root to: 'home#index'
end

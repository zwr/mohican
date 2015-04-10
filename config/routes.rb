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

  #angular routes
  get '/start', to: 'home#index'
  get '/map', to: 'home#index'
  get '/design', to: 'home#index'
  get '/history', to: 'home#index'
  get '/customers', to: 'home#index'
  #end angular routes
end

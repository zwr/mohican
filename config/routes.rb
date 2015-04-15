Rails.application.routes.draw do
  scope '/api' do
    resources :activities, defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
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
  get '/deliveries', to: 'home#index'
  get '/activities', to: 'home#index'
  get '/routes', to: 'home#index'
  get '/resources', to: 'home#index'
  get '/timetables', to: 'home#index'
  get '/links', to: 'home#index'
  get '/groups', to: 'home#index'
  get '/hours-reports', to: 'home#index'
  get '/hours-accounting', to: 'home#index'

  get '/start/:page', to: 'home#index'
  get '/map/:page', to: 'home#index'
  get '/design/:page', to: 'home#index'
  get '/history/:page', to: 'home#index'
  get '/customers/:page', to: 'home#index'
  get '/deliveries/:page', to: 'home#index'
  get '/activities/:page', to: 'home#index'
  get '/routes/:page', to: 'home#index'
  get '/resources/:page', to: 'home#index'
  get '/timetables/:page', to: 'home#index'
  get '/links/:page', to: 'home#index'
  get '/groups/:page', to: 'home#index'
  get '/hours-reports/:page', to: 'home#index'
  get '/hours-accounting/:page', to: 'home#index'
  #end angular routes
end

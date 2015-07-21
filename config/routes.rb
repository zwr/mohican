Rails.application.routes.draw do
  resources :orders

  devise_for :users
  scope '/admin' do
    resources :users, as: 'users'
    resources :products, as: 'products'
  end

  scope '/api' do
    resources :orders, defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
    resources :activities, defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
    resources :users, as: 'users', defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
    resources :products, as: 'products', defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
  end

  get 'index_old', to: 'home#index_old'
  root to: 'home#index'
end

Rails.application.routes.draw do
  devise_for :users
  scope '/admin' do
    resources :bookmarks, as: 'bookmarks'
    resources :orders, as: 'orders'
    resources :users, as: 'users'
    resources :products, as: 'products'
  end

  scope '/api' do
    get 'production_lines', to: 'production_lines#index'
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
    resources :bookmarks, as: 'bookmarks', defaults: { format: 'json' } do
      get 'layout', on: :collection
    end
  end

  get 'index_old', to: 'home#index_old'
  root to: 'home#index'
end

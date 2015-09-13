require 'api_constraints'

Rails.application.routes.draw do

  root 'pages#home'
  devise_for :users, :controllers => { registrations: 'registrations'}

  namespace :api, defaults: { format: :json }, constraints: { subdomain: 'api' }, path: '/' do

    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :users, :only => [:show, :create, :update, :destroy]
      resources :sessions, :only => [:create, :destroy]
      resources :bottles, :only => [:create]
      get "bottles/fish" => "bottles#fish"
    end

  end
end

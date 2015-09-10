require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users, controllers: { registrations: "api/v1/registrations" }
  root 'pages#home'

  namespace :api, defaults: { format: :json }, constraints: { subdomain: 'api' }, path: '/' do

    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :users, :only => [:show, :create, :update, :destroy]
    end

  end
end

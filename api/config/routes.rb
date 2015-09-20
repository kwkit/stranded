require 'api_constraints'

Rails.application.routes.draw do

  root 'pages#home'
  get 'testing/abc' => 'pages#home'
  devise_for :users, :controllers => { registrations: 'registrations'}

  namespace :api, defaults: { format: :json }, path: '/api' do

    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :users, :only => [:show, :create, :update, :destroy]
      resources :sessions, :only => [:create, :destroy]
      resources :bottles, :only => [:create]
      get "bottles/fish" => "bottles#fish"
      put "bottles/release" => "bottles#release"
      post "bottles/reply" => "bottles#reply"
    end

  end
end

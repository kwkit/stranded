require 'api_constraints'

Rails.application.routes.draw do

  root 'pages#home'
  get 'testing/abc' => 'pages#home'
  devise_for :users, :controllers => { registrations: 'registrations'}

  namespace :api, defaults: { format: :json }, path: '/api' do

    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      resources :users, :only => [:create, :update, :destroy]
      resources :sessions, :only => [:create, :destroy]
      resources :bottles, :only => [:create]
      get "sessions/verify" => "sessions#verify"
      get "bottles/fish" => "bottles#fish"
      put "bottles/release" => "bottles#release"
      post "bottles/reply" => "bottles#reply"
      get "bottles/current_bottle" => "bottles#current_bottle"
      get "bottles/my_bottles" => "bottles#my_bottles"
      get "bottles/view/:id" => "bottles#view"
      get "stars/message/:message_id" => "stars#message"
      get "stars/bottle/:bottle_id" => "stars#bottle"
      get "stars/unstar_message/:message_id" => "stars#unstar_message"
      get "stars/unstar_bottle/:bottle_id" => "stars#unstar_bottle"
    end

  end
end

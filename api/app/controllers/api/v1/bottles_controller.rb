class Api::V1::BottlesController < ApplicationController
  before_action :authenticate_with_token!, only: [:create]
  respond_to :json

  def create
    bottle = current_user.bottles.build(bottle_params)
    bottle.opened = false
    if bottle.save
      render json: bottle, status: 201
    else
      render json: { errors: bottle.errors }, status: 422
    end
  end

  private

  def bottle_params
    params.require(:bottle).permit(:message)
  end
end

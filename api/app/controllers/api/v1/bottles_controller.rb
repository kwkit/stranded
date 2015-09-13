class Api::V1::BottlesController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :fish]
  respond_to :json

  def fish
    bottle = Bottle.where(opened: false).order("RANDOM()").first
    bottle.update(opened: true)
    respond_with bottle
  end

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

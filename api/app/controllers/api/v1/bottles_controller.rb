class Api::V1::BottlesController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :fish]
  respond_to :json

  def fish
    if current_user.open_bottle_id
      Bottle.find(current_user.open_bottle_id).update(opened: false)
    end
    bottle = Bottle.where(opened: false).order("RANDOM()").first
    if bottle
      bottle.update(opened: true)
      current_user.update(open_bottle_id: bottle.id)
      respond_with bottle
    else
      current_user.update(open_bottle_id: nil)
      render json: { errors: "failed to get a bottle"}
    end
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

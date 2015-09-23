class Api::V1::StarsController < ApplicationController
  before_action :authenticate_with_token!, only: [:message, :bottle]
  respond_to :json

  def message
    star = Star.new(user_id: current_user.id, message_id: params[:message_id])
    if star.save
      output = MessageSerializer.new(star.message)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      render json: { errors: star.errors }, status: 422
    end
  end

  def bottle
    bottle_star = BottleStar.new(user_id: current_user.id, bottle_id: params[:bottle_id])
    if bottle_star.save
      output = BottleSerializer.new(bottle_star.bottle)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      render json: { errors: bottle_star.errors }, status: 422
    end
  end
end
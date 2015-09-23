class Api::V1::StarsController < ApplicationController
  before_action :authenticate_with_token!, only: [:add]
  respond_to :json

  def add
    star = Star.new(user_id: current_user.id, message_id: params[:message_id])
    if star.save
      render json: MessageSerializer.new(star.message).as_json
    else
      render json: { errors: star.errors }, status: 422
    end
  end
end
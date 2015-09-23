class Api::V1::StarsController < ApplicationController
  before_action :authenticate_with_token!, only: [:add]
  respond_to :json

  def add
    star = Star.new(user_id: current_user.id, message_id: params[:message_id])
    if star.save
      output = MessageSerializer.new(star.message)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      render json: { errors: star.errors }, status: 422
    end
  end
end
class Api::V1::BottlesController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :fish, :release, :reply, :current_bottle, :my_bottles]
  respond_to :json

  def reply
    if current_user.open_bottle_id
      bottle = Bottle.find(current_user.open_bottle_id)
      message = bottle.messages.build(reply_params)
      message.user_id = current_user.id
      bottle.opened = false
      if bottle.save
        current_user.update(open_bottle_id: nil)
        render json: { response: 'success', message: 'reply posted'}
      else
        render json: { errors: bottle.errors }
      end
    else
      render json: { errors: 'not holding any bottles'}, status: 404
    end
  end

  def fish
    if current_user.open_bottle_id
      Bottle.find(current_user.open_bottle_id).update(opened: false)
    end
    bottle = Bottle.where(opened: false).order("RANDOM()").first
    if bottle
      bottle.update(opened: true)
      current_user.update(open_bottle_id: bottle.id)
      output = BottleSerializer.new(bottle)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      current_user.update(open_bottle_id: nil)
      render json: { errors: 'failed to get a bottle'}, status: 404
    end
  end

  def current_bottle
    if current_user.open_bottle_id
      bottle = Bottle.find(current_user.open_bottle_id)
      output = BottleSerializer.new(bottle)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      render json: {errors: 'not holding any bottle'}, status: 404
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

  def my_bottles
    bottles = current_user.bottles
    messages = current_user.bottle_sub
    tracks = bottles | messages
    render json: {bottles: tracks}, status: 200
  end

  def view
    bottle = Bottle.find_by(id: params[:id])
    if bottle
      output = BottleSerializer.new(bottle)
      output.current_user_id = current_user.id
      render json: output.as_json
    else
      render json: {errors: 'no such bottle'}, status: 404
    end
  end

  def release
    if current_user.open_bottle_id
      Bottle.find(current_user.open_bottle_id).update(opened: false)
      current_user.update(open_bottle_id: nil)
      render json: {response: 'success', message: 'released bottle'}
    else
      render json: { errors: 'not holding any bottle' }, status: 404
    end
  end
  private

  def bottle_params
    params.require(:bottle).permit(:message, :author, :latitude, :longitude)
  end

  def reply_params
    params.require(:reply).permit(:message, :author, :latitude, :longitude)
  end
end
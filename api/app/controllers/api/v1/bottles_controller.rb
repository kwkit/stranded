class Api::V1::BottlesController < ApplicationController
  before_action :authenticate_with_token!, only: [:create, :fish, :release, :reply]
  respond_to :json

  def reply
    if current_user.open_bottle_id
      bottle = Bottle.find(current_user.open_bottle_id)
      conversation = bottle.build_conversation
      conversation.conversation_participations.build(user_id: bottle.user_id,
                                                     conversation_name: 'Talk to responder')
      responder = conversation.conversation_participations.build(user_id: current_user.id,
                                                                 conversation_name: 'Talk to sender')
      responder.messages.build(reply_params)
      if bottle.save
        current_user.update(open_bottle_id: nil)
        render json: { response: 'success', message: 'conversation created'}
      else
        render json: { errors: bottle.errors }
      end
    else
      render json: { errors: 'not holding any bottles'}
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
      respond_with bottle
    else
      current_user.update(open_bottle_id: nil)
      render json: { errors: 'failed to get a bottle'}
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

  def release
    if current_user.open_bottle_id
      Bottle.find(current_user.open_bottle_id).update(opened: false)
      current_user.update(open_bottle_id: nil)
      render json: {response: 'success', message: 'released bottle'}
    else
      render json: {response: 'success', message: 'not holding any bottle'}
    end
  end
  private

  def bottle_params
    params.require(:bottle).permit(:message)
  end

  def reply_params
    params.require(:reply).permit(:message)
  end
end
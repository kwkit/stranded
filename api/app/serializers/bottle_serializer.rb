class BottleSerializer < ActiveModel::Serializer
  attr_accessor :current_user_id
  attributes :message, :author, :latitude, :longitude, :created_at, :messages
  def messages
    object.messages.map do |message|
      output = MessageSerializer.new(message, scope: scope, root: false, event: object)
      output.current_user_id = current_user_id
      output
    end
  end
end

class MessageSerializer < ActiveModel::Serializer
  attr_accessor :current_user_id
  attributes :id, :message, :author, :created_at, :latitude, :longitude
  def attributes
    data = super
    data[:stars] = object.stars.count
    data[:starred] = object.check_starred(current_user_id)
    data
  end
end

class MessageSerializer < ActiveModel::Serializer
  attributes :message, :author, :created_at, :latitude, :longitude, :stars
  def stars
    Star.where(message_id: :message_id).count
  end
end

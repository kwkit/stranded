class MessageSerializer < ActiveModel::Serializer
  attributes :message, :author, :created_at, :latitude, :longitude
end

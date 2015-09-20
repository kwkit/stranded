class BottleSerializer < ActiveModel::Serializer
  attributes :message, :author, :latitude, :longitude, :created_at, :messages
  has_many :messages, class_name: 'Message'
end

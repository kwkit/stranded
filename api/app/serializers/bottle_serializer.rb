class BottleSerializer < ActiveModel::Serializer
  attributes :message, :author, :created_at, :messages
  has_many :messages, class_name: 'Message'
end

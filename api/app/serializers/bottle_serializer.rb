class BottleSerializer < ActiveModel::Serializer
  attributes :message, :messages
  has_many :messages, class_name: 'Message'
end

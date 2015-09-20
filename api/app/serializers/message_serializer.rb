class MessageSerializer < ActiveModel::Serializer
  attributes :message, :author, :created_at
end

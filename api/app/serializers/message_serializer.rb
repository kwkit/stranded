class MessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :author, :created_at, :latitude, :longitude
  def attributes
    data = super
    data[:stars] = object.stars.count
    data
  end
end

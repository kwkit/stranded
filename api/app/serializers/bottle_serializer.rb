class BottleSerializer < ActiveModel::Serializer
  attr_accessor :current_user_id
  attributes :id, :message, :author, :latitude, :longitude, :created_at
  def attributes
    data = super
    data[:stars] = object.bottle_stars.count
    data
  end
end

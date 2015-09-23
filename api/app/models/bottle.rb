class Bottle < ActiveRecord::Base
  validates :message, presence: true
  validates :author, presence: true
  belongs_to :user
  has_many :messages
  validates_associated :messages
  has_many :bottle_stars
  attr_accessor :commented
  def check_starred user_id
    BottleStar.where(user_id: user_id, bottle_id: id).count > 0
  end
end

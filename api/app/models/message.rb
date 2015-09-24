class Message < ActiveRecord::Base
  validates :message, presence: true
  validates :author, presence: true
  belongs_to :bottle
  has_many :stars
  attr_accessor :commented

  def check_starred user_id
    Star.where(user_id: user_id, message_id: id).count > 0
  end
end

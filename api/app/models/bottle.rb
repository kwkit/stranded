class Bottle < ActiveRecord::Base
  validates :message, presence: true
  belongs_to :user
  has_many :messages
  validates_associated :messages
end

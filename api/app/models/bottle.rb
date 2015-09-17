class Bottle < ActiveRecord::Base
  validates :message, presence: true
  validates_associated :conversation
  belongs_to :user
  has_one :conversation
end

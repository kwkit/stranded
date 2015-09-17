class Bottle < ActiveRecord::Base
  validates :message, presence: true
  belongs_to :user
  has_one :conversation
end

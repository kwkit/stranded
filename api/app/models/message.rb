class Message < ActiveRecord::Base
  validates :message, presence: true
  validates :author, presence: true
  belongs_to :bottle
end

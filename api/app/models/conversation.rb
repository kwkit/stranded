class Conversation < ActiveRecord::Base
  validates_associated :conversation_participations
  belongs_to :bottle
  has_many :conversation_participations
end

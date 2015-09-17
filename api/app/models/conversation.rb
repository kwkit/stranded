class Conversation < ActiveRecord::Base
  belongs_to :bottle
  has_many :conversation_participations
  has_many :messages
end

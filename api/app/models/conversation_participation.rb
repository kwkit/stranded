class ConversationParticipation < ActiveRecord::Base
  belongs_to :conversation
  belongs_to :user
  has_many :messages
end

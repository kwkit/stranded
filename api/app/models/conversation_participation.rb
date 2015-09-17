class ConversationParticipation < ActiveRecord::Base
  validates :conversation_name, presence: true
  validates_associated :messages
  belongs_to :conversation
  belongs_to :user
  has_many :messages
end

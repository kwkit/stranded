class RenameParticipationIdToConversationParticipationIdInMessages < ActiveRecord::Migration
  def change
    rename_column :messages, :participation_id, :conversation_participation_id
  end
end

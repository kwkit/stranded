class CreateConversationParticipations < ActiveRecord::Migration
  def change
    create_table :conversation_participations do |t|
      t.integer :user_id
      t.integer :conversation_id
      t.string :conversation_name

      t.timestamps null: false
    end
  end
end

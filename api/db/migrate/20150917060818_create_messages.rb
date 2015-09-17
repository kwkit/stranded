class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :message
      t.integer :conversation_id
      t.integer :participation_id

      t.timestamps null: false
    end
  end
end

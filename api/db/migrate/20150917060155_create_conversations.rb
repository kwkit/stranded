class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.integer :bottle_id

      t.timestamps null: false
    end
  end
end

class CreateBottles < ActiveRecord::Migration
  def change
    create_table :bottles do |t|
      t.string :message
      t.boolean :opened
      t.integer :sender_id

      t.timestamps null: false
    end
  end
end

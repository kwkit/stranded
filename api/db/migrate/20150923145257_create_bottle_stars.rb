class CreateBottleStars < ActiveRecord::Migration
  def change
    create_table :bottle_stars do |t|
      t.integer :user_id
      t.integer :bottle_id

      t.timestamps null: false
    end
  end
end

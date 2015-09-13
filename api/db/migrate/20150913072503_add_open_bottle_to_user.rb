class AddOpenBottleToUser < ActiveRecord::Migration
  def change
    add_column :users, :open_bottle_id, :integer
  end
end

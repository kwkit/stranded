class AddBottleIdToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :bottle_id, :integer
  end
end

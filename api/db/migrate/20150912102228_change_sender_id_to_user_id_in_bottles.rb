class ChangeSenderIdToUserIdInBottles < ActiveRecord::Migration
  def change
    rename_column :bottles, :sender_id, :user_id
  end
end

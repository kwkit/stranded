class AddAuthorToBottles < ActiveRecord::Migration
  def change
    add_column :bottles, :author, :string
  end
end

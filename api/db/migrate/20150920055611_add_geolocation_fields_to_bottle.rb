class AddGeolocationFieldsToBottle < ActiveRecord::Migration
  def change
    add_column :bottles, :latitude, :string
    add_column :bottles, :longitude, :string
  end
end

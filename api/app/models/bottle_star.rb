class BottleStar < ActiveRecord::Base
  belongs_to :bottle
  validates_presence_of :bottle
  belongs_to :user
  validates_presence_of :user
end

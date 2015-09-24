class Star < ActiveRecord::Base
  belongs_to :message
  validates_presence_of :message
  belongs_to :user
  validates_presence_of :user
end

class User < ActiveRecord::Base
  validates :auth_token, uniqueness: true
  before_create :generate_authentication_token!

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :bottles
  has_many :messages
  has_many :bottle_sub, -> { distinct }, through: :messages, source: :bottle
  has_many :stars

  def generate_authentication_token!
    begin
      self.auth_token = Devise.friendly_token
    end while self.class.exists?(auth_token: auth_token)
  end
end

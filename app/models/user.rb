class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  ## ZWR generated fields
  field :name,               type: String, default: ''
  field :admin,              type: Boolean, default: false

  ## Database authenticatable
  field :email,              type: String, default: ''
  field :encrypted_password, type: String, default: ''

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count,      type: Integer, default: 0
  field :current_sign_in_at, type: Time
  field :last_sign_in_at,    type: Time
  field :current_sign_in_ip, type: String
  field :last_sign_in_ip,    type: String

  ## Confirmable
  # field :confirmation_token,   type: String
  # field :confirmed_at,         type: Time
  # field :confirmation_sent_at, type: Time
  # field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time

  # Additional non-devise fields
  field :gender, type: String
  field :address_street, type: String
  field :address_city, type: String
  field :address_post_number, type: String
  field :cc_type, type: String
  field :cc_number, type: String
  field :cc_cvc, type: String
  field :cc_exp, type: String
  field :telnum, type: String
  field :username, type: String
  field :date_of_birth, type: Date

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j
  end
end

class UsersController < ApplicationController
  include Mohican::Controller
  before_action :authenticate_user!

  private

  def request_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :admin)
  end
end

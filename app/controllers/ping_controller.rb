class PingController < ApplicationController
  before_action :authenticate_user!
  respond_to :html, :json

  def index
    respond_to do |format|
      format.json { render json: { status: :ok } }
      format.html { render text: 'Status OK' }
    end
  end
end

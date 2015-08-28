class ProductionLinesController < ApplicationController
  respond_to :json
  def index
    respond_to do |format|
      format.json { render json: ProductionLine.all }
    end
  end
end

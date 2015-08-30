class ProductionLinesController < ApplicationController
  respond_to :json
  def index
    respond_to do |format|
      format.json { render json: ProductionLine.all }
    end
  end

  def stats
    respond_to do |format|
      format.json { render json: ProductionLine.lines_order_status }
    end
  end
end

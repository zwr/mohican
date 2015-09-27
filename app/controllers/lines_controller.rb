class LinesController < ApplicationController
  include Mohican::Controller

  def stats
    respond_to do |format|
      format.json { render json: ProductionLine.lines_order_status }
    end
  end

  def model
    ProductionLine
  end

  private

  def request_params
    params.require(:line).permit(production_cells: [{ _id: :$oid }, :name])
  end
end

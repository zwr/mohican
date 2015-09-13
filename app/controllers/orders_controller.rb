class OrdersController < ApplicationController
  include Mohican::Controller

  private

  def request_params
    params.require(:order).permit(:delivery_tag, :delivery_date, :actual_delivery_date,
                                  :created_at, :order_items, :order_handlers,
                                  :order_number, :cell, :status, :total, :creator_name,
                                  :creator_ref)
  end
end

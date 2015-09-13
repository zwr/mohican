class OrdersController < ApplicationController
  include Mohican::Controller

  def layout
    respond_to do |format|
      format.json do
        render json: {
          layout: {
            doctype: 'order',
            primaryKeyName: '_mnid',
            layouts: [{
              name: 'default',
              definition: [
                {
                  name: :order_number,
                  header: 'Order No.',
                  width: 130,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :delivery_date,
                  header: 'Delivery date',
                  width: 210,
                  quicksort: true,
                  quickfilter: 'date-range',
                  view: :date
                },
                {
                  name: :cell,
                  header: 'Cell',
                  width: 130,
                  quicksort: true,
                  values: ProductionLine.cells,
                  quickfilter: :select,
                  view: 'select-single'
                },
=begin
                {
                  name: :actual_delivery_date, # Note that this fate cn be null
                  header: 'Delivered on',
                  width: 210,
                  quicksort: true,
                  quickfilter: 'date-range',
                  view: :date
                },
=end
                {
                  name: :status,
                  header: :Status,
                  width: 90,
                  quicksort: true,
                  values: Order::STATUS,
                  quickfilter: :select,
                  view: 'select-single'
                },
=begin
                {
                  name: :delivery_tag,
                  header: 'Delivery Tags',
                  width: 320,
                  quicksort: true,
                  values: [:standard, :urgent, :insured, :fragile, :flammable,
                           :tax_free, :export, :import, :secret, :poison, :large,
                           :heavy],
                  quickfilter: :select, # here should be select zero, one or more
                  view: :select
                },
                {
                  name: :total,
                  header: :Total,
                  width: 80,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                }
=end
              ]
            },
            {
              name: 'short',
              definition: [
                {
                  name: :order_number,
                  header: 'Order No.',
                  width: 130,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :delivery_date,
                  header: 'Delivery date',
                  width: 210,
                  quicksort: true,
                  quickfilter: 'date-range',
                  view: :date
                }
              ]
            }]
          },
          filter: []
        }
      end
    end
  end

  def new
    @order = Order.new
    respond_with(@order)
  end

  def edit
  end

  def create
    @order = Order.new(order_params)
    @order.creator = current_user
    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: 'Order was successfully created.' }
        format.json { render json: @order.as_json }
      else
        format.html { render :new }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
        format.json { render json: @order.as_json }
      else
        format.html { render :new }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @order.destroy
        format.json { render json: @order.as_json }
        format.html { respond_with(@order) }
      else
        format.json { render json: @order.errors, status: :unprocessable_entity }
        format.html { respond_with(@order) }
      end
    end
  end

  private

  def order_params
    params.require(:order).permit(:delivery_tag, :delivery_date, :actual_delivery_date,
                                  :created_at, :order_items, :order_handlers,
                                  :order_number, :cell, :status, :total, :creator_name,
                                  :creator_ref)
  end
end

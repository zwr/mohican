class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @orders = Order.all
    limit = params[:limit] || params[:count] || 5000
    offset = params[:offset] || params[:skip] || 0
    # filter = params[:filter] || ''
    # sort = params[:sort] || ''

    limit = limit.to_i
    offset = offset.to_i

    offset = [0, params[:index].to_i - limit / 2].max if params[:index] && offset == 0

    total_count = Order.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    @orders = Order
              .limit(limit)
              .skip(offset)
              .order_by(id: :asc)

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @orders.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@orders) }
    end
  end

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
                  name: :actual_delivery_date, # Note that this fate cn be null
                  header: 'Delivered on',
                  width: 210,
                  quicksort: true,
                  quickfilter: 'date-range',
                  view: :date
                },
                {
                  name: :status,
                  header: :Status,
                  width: 90,
                  quicksort: true,
                  values: [:created, :open, :closed, :deferred, :processing, :delivered],
                  quickfilter: :select, # here should be select one
                  view: :select
                },
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
              ]
            }]
          },
          filter: []
        }
      end
    end
  end

  def show
    respond_to do |format|
      format.json { render json: @order }
      format.html { respond_with(@order) }
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
    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: 'Order was successfully created.' }
        format.json { render :show, status: :created, location: @order }
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

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:delivery_tag, :delivery_date, :actual_delivery_date,
                                  :created_at, :order_items, :order_handlers,
                                  :order_number, :status, :total, :creator_name,
                                  :creator_ref)
  end
end

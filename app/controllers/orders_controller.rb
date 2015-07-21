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
              .includes(:handlers, :creator, :__products)

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
                  width: 160,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :status,
                  header: :Status,
                  width: 420,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :total,
                  header: :Total,
                  width: 420,
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
    params.require(:order).permit(:order_number, :status, :total)
  end
end

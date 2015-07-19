class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    limit = params[:limit] || params[:count] || 5000
    offset = params[:offset] || params[:skip] || 0
    # filter = params[:filter] || ''
    # sort = params[:sort] || ''

    limit = limit.to_i
    offset = offset.to_i

    offset = [0, params[:index].to_i - limit / 2].max if params[:index] && offset == 0

    total_count = Product.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    @products = Product
                .limit(limit)
                .skip(offset)
                .order_by(id: :asc)

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @products.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@product) }
    end
  end

  def layout
    respond_to do |format|
      format.json do
        render json: {
          layout: {
            doctype: 'product',
            primaryKeyName: '_mnid',
            layouts: [{
              name: 'default',
              definition: [
                {
                  name: :id,
                  header: :id,
                  width: 80,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :name,
                  header: :name,
                  width: 420,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :ean,
                  header: :EAN,
                  width: 130,
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
      format.json { render json: Product.find(params[:id]) }
      format.html { respond_with(@product) }
    end
  end

  def new
    @product = Product.new
    respond_with(@product)
  end

  def edit
  end

  def create
    @product = Product.new(product_params)
    @product.save
    respond_with(@product)
  end

  def update
    respond_to do |format|
      if @product.update(product_params)
        format.json { render json: @product.as_json }
        format.html { respond_with(@product) }
      else
        format.json { render json: @product.errors, status: :unprocessable_entity }
        format.html { respond_with(@product) }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @product.destroy
        format.json { render json: @product.as_json }
        format.html { respond_with(@product) }
      else
        format.json { render json: @product.errors, status: :unprocessable_entity }
        format.html { respond_with(@product) }
      end
    end
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :ean)
  end
end

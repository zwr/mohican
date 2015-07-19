class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    # @products = Product.all
    # respond_with(@products)

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
      format.json do
        render json: {
          items: @products.as_json,
          offset: offset,
          total_count: total_count
        }
      end
      format.html { respond_with(@product) }
    end
  end

  def layout
    respond_to do |format|
      format.json do
        render json: {
          doctype: 'product',
          layout: {
            primaryKeyName: 'id',
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
    respond_with(@product)
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
    @product.update(product_params)
    respond_with(@product)
  end

  def destroy
    @product.destroy
    respond_with(@product)
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :ean)
  end
end

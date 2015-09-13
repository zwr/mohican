class ProductsController < ApplicationController
  include Mohican::Controller

  private

  def request_params
    params.require(:product).permit(:name, :ean)
  end
end

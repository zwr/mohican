class ProductsController < ApplicationController
  include Mohican::Controller

  private

  def document_params
    params.require(:product).permit(:name, :ean)
  end
end

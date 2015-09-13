require 'active_support/concern'

module Mohican::Controller
  extend ActiveSupport::Concern

  included do
    respond_to :html, :json
    before_action :set_document, only: [:show, :edit, :update, :destroy]
  end

  def the_model
    self.class.name.remove('Controller').singularize.constantize
  end

  def index_documents
  end

  def index
    limit = params[:limit] || params[:count] || 20
    offset = params[:offset] || params[:skip] || 0
    # filter = params[:filter] || ''
    # sort = params[:sort] || ''

    limit = limit.to_i
    offset = offset.to_i

    offset = [0, params[:index].to_i - limit / 2].max if params[:index] && offset == 0

    total_count = the_model.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    instance_variable_set "@#{self.class.name.remove('Controller').downcase}",
                          the_model.limit(limit).skip(offset).order_by(id: :asc)

    index_documents

    @documents = instance_variable_get "@#{self.class.name.remove('Controller').downcase}"

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @documents.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@documents) }
    end
  end

  def show
    @document = instance_variable_get "@#{self.class.name.remove('Controller').downcase.singularize}"
    respond_to do |format|
      format.json { render json: @order }
      format.html { respond_with(@order) }
    end
  end

  def set_document
    @document = Order.find(params[:id])
    instance_variable_set "@#{self.class.name.remove('Controller').downcase.singularize}", @document
  end
end

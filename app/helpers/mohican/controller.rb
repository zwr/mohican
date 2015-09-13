require 'active_support/concern'

module Mohican::Controller
  extend ActiveSupport::Concern

  included do
    respond_to :html, :json
    before_action :set_document, only: [:show, :edit, :update, :destroy]
  end

  def resource_name
    self.class.name.remove('Controller')
  end

  def doc_name
    resource_name.singularize
  end

  def model
    doc_name.constantize
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

    total_count = model.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    instance_variable_set "@#{resource_name.downcase}",
                          model.limit(limit).skip(offset).order_by(id: :asc)

    index_documents

    @documents = instance_variable_get "@#{resource_name.downcase}"

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @documents.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@documents) }
    end
  end

  def layout
    respond_to do |format|
      format.json do
        render json: YAML.load(File.read(Rails.root.join('app', 'layouts', "#{resource_name.downcase}.yml")))
      end
    end
  end

  def show
    @document = instance_variable_get "@#{doc_name.downcase}"
    respond_to do |format|
      format.json { render json: @document }
      format.html { respond_with @document }
    end
  end

  def new
    @document = model.new
    instance_variable_set "@#{doc_name.downcase}", @document
    respond_with(@document)
  end

  def edit
  end

  def create
    @document = model.new(request_params)
    @document.creator = current_user
    respond_to do |format|
      if @document.save
        format.html { redirect_to @document, notice: "#{doc_name} was successfully created." }
        format.json { render json: @document.as_json }
      else
        format.html { render :new }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @document.update(request_params)
        format.html { redirect_to @document, notice: "#{doc_name} was successfully updated." }
        format.json { render json: @document.as_json }
      else
        format.html { render :new }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @document.destroy
        format.json { render json: @document.as_json }
        format.html { respond_with(@document) }
      else
        format.json { render json: @document.errors, status: :unprocessable_entity }
        format.html { respond_with(@document) }
      end
    end
  end

  # private

  def set_document
    @document = model.find(params[:id])
    instance_variable_set "@#{doc_name.downcase}", @document
  end
end

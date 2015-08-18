class BookmarksController < ApplicationController
  before_action :set_bookmark, only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @bookmarks = Bookmark.all
    limit = params[:limit] || params[:count] || 5000
    offset = params[:offset] || params[:skip] || 0
    # filter = params[:filter] || ''
    # sort = params[:sort] || ''

    limit = limit.to_i
    offset = offset.to_i

    offset = [0, params[:index].to_i - limit / 2].max if params[:index] && offset == 0

    total_count = Bookmark.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    @bookmarks = Bookmark
                 .limit(limit)
                 .skip(offset)
                 .order_by(id: :asc)

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @bookmarks.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@bookmarks) }
    end
  end

  def layout
    respond_to do |format|
      format.json do
        render json: {
          layout: {
            doctype: 'bookmark',
            primaryKeyName: '_mnid',
            layouts: [{
              name: 'default',
              definition: [
                { name: :name, header: 'Bookmark Name', width: 160, quicksort: true, quickfilter: :text, view: :text },
                { name: :url, header: 'Bookmark Url', width: 160, quicksort: true, quickfilter: :text, view: :text },
                { name: :bookmark_order, header: 'Order within bookmarks', width: 160, quicksort: true, quickfilter: :text, view: :text },
                { name: :panel_index, header: 'Panel position', width: 160, quicksort: true, quickfilter: :text, view: :text }
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
    @bookmark = Bookmark.new
    respond_with(@bookmark)
  end

  def edit
  end

  def create
    @order = Order.new(order_params)
    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: 'Bookmark was successfully created.' }
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
        format.html { redirect_to @order, notice: 'Bookmark was successfully updated.' }
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

  def set_bookmark
    @bookmark = Bookmark.find(params[:id])
  end

  def bookmark_params
    params.require(:bookmark).permit(:name, :url, :bookmark_order, :panel_index)
  end
end

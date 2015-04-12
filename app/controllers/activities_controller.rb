class ActivitiesController < ApplicationController
  before_action :set_activity, only: [:show, :edit, :update, :destroy]

  # GET /activities
  # GET /activities.json
  # GET /activities/?filter=xxxx&sort=gggg
  def index
    limit = params[:limit] || params[:count] || 5000
    offset = params[:offset] || params[:skip] || 0
    filter = params[:filter] || ""
    sort = params[:sort] || ""

    limit = limit.to_i
    offset = offset.to_i

    offset = [0,params[:index].to_i - limit / 2].max if params[:index] and offset == 0

    total_count = Activity.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    respond_to do |format|
      format.json do
        render json: { 
          items: Activity
            .limit(limit)
            .skip(offset)
            .order_by(Order_ID: 1)
            .as_json,
          offset: offset,
          total_count: total_count
        }
      end
    end
  end

  # GET /activities/layout
  # GET /activities/layout.json
  def layout
    respond_to do |format|
      format.json do
        render json: Layout.where(doctype: :activity)[0].as_json
      end
    end
  end

  # GET /activities/1
  # GET /activities/1.json
  def show
    puts "trying to find #{params[:id]}"
    respond_to do |format|
      format.json do
        render json: Activity.where('Order_ID' => params[:id].to_i).first.as_json
      end
    end
  end

  # GET /activities/new
  def new
    @activity = Activity.new
  end

  # GET /activities/1/edit
  def edit
  end

  # POST /activities
  # POST /activities.json
  def create
    @activity = Activity.new(activity_params)

    respond_to do |format|
      if @activity.save
        format.html { redirect_to @activity, notice: 'Activity was successfully created.' }
        format.json { render :show, status: :created, location: @activity }
      else
        format.html { render :new }
        format.json { render json: @activity.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /activities/1
  # PATCH/PUT /activities/1.json
  def update
    respond_to do |format|
      if @activity.update(activity_params)
        format.html { redirect_to @activity, notice: 'Activity was successfully updated.' }
        format.json { render :show, status: :ok, location: @activity }
      else
        format.html { render :edit }
        format.json { render json: @activity.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /activities/1
  # DELETE /activities/1.json
  def destroy
    @activity.destroy
    respond_to do |format|
      format.html { redirect_to activities_url, notice: 'Activity was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      puts "Looking for 'Order_ID' => #{params[:id]}"
      @activity = Activity.where(:'Order_ID' => params[:id]).all
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def activity_params
      params[:activity]
    end
end

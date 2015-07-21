class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  respond_to :html, :json

  # GET /users
  # GET /users.json
  def index
    @users = User.all
    limit = params[:limit] || params[:count] || 5000
    offset = params[:offset] || params[:skip] || 0
    # filter = params[:filter] || ''
    # sort = params[:sort] || ''

    limit = limit.to_i
    offset = offset.to_i

    offset = [0, params[:index].to_i - limit / 2].max if params[:index] && offset == 0

    total_count = User.all.count

    # Make sure you do return something
    limit = [limit, total_count].min
    offset = [offset, total_count - limit].min

    @users = User
             .limit(limit)
             .skip(offset)
             .order_by(id: :asc)

    respond_to do |format|
      format.json { render json: { # rubocop:disable all
        items: @users.as_json,
        offset: offset,
        total_count: total_count
      }}
      format.html { respond_with(@users) }
    end
  end

  def layout
    respond_to do |format|
      format.json do
        render json: {
          layout: {
            doctype: 'user',
            primaryKeyName: '_mnid',
            layouts: [{
              name: 'default',
              definition: [
                {
                  name: :name,
                  header: :Name,
                  width: 160,
                  quicksort: true,
                  quickfilter: :text,
                  view: :text
                },
                {
                  name: :email,
                  header: :Email,
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

  # GET /users/1
  # GET /users/1.json
  def show
    respond_to do |format|
      format.json { render json: @user }
      format.html { respond_with(@user) }
    end
  end

  # user GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.json { render json: @user.as_json }
        format.html { respond_with(@user) }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
        format.html { respond_with(@user) }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    respond_to do |format|
      if @user.destroy
        format.json { render json: @user.as_json }
        format.html { respond_with(@user) }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
        format.html { respond_with(@user) }
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :admin)
  end
end

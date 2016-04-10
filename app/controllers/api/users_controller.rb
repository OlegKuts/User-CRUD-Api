class Api::UsersController < ApplicationController

	respond_to :json

	def index
	   respond_with User.all    
 	end

	def show
	   respond_with User.find(params[:id])
	end

	def create
		@user = User.new(user_params)
	    if @user.save
	      render json: @user
	    else
	      render json: @user.errors, status: :unprocessable_entity
	    end   
	end	

	def update
	    @user = User.find(params[:id])
	    if @user.update_attributes(user_params)
	        render json: @user
	    else
	        render json: @user.errors, status: :unprocessable_entity
	    end 
	end

	def destroy
	   respond_with User.destroy(params[:id])
	end
	

	private

   	def user_params
    	params.permit(:name, :surname, :country, :age)
  	end

end
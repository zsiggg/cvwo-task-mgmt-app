class Api::CategoriesController < ApplicationController
  def create
    categories = Category.create!(category_params)
    if categories
      render json: categories
    else
      render json: categories.errors
    end
  end

  def read
    categories = Category.all.order(created_at: :desc)
    render json: categories
  end

  def update
    categories = category&.update!(category_params)

    if categories
      render json: {message: 'Category updated!'}
    else 
      render json: categories.errors
    end
  end

  def delete
    category&.destroy
    render json: {message: 'Category deleted!'}
  end

  def show
    if category
      render json: category
    else
      render json: category.errors
    end
  end

  private

  def category_params
    params.permit(:id, :name, :task_id)
  end

  def category
    @category ||= Category.find(params[:id])
  end
end
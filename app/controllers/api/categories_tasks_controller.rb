class Api::CategoriesTasksController < ApplicationController
    def tag_category
        for obj in params[:body]
            @task ||= Task.find(obj[:id])
            category_id_arr = Array.new(@task.categories.length)
            i = 0
            for category in @task.categories
                category_id_arr[i] = category.id
                i = i + 1
            end
            unless category_id_arr.include?(obj[:category_id])
                @category = Category.find(obj[:category_id])
                @task.categories << @category
            end
        end
        render json: {message: 'Tagged!'}
    end

    def untag_category
        for obj in params[:body]
            @task ||= Task.find(obj[:id])
            @category = Category.find(obj[:category_id])
            @task.categories.delete(@category)
        end
        render json: {message: 'Untagged!'}
    end
    
    def read
        @categories = Task.find(params[:id]).categories
        render json: @categories
    end

end
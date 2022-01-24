class Api::TasksController < ApplicationController
  def create
    tasks = Task.create!(task_params)
    if tasks
      render json: tasks
    else
      render json: tasks.errors
    end
  end

  def read
    tasks = Task.all.order(created_at: :desc)
    render json: tasks
  end

  def update
    tasks = task&.update!(task_params)

    if tasks
      render json: {message: 'Task updated!'}
    else 
      render json: tasks.errors
    end
  end

  def delete
    task&.destroy
    render json: {message: 'Task deleted!'}
  end

  def show
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  private

  def task_params
    params.permit(:id, :name, :deadline, :category_id)
  end

  def task
    @task ||= Task.find(params[:id])
  end

end
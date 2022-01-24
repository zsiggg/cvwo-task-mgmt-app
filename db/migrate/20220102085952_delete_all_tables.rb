require_relative "20211231111302_create_categories"
require_relative "20220101072927_create_tasks"

class DeleteAllTables < ActiveRecord::Migration[6.1]
  def change
    revert CreateTasks
    revert CreateCategories
  end
end

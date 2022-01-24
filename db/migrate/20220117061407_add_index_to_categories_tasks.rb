class AddIndexToCategoriesTasks < ActiveRecord::Migration[6.1]
  def change
    add_index :categories_tasks, [:category_id, :task_id], unique: true
  end
end

class ChangeDefaultPrimaryKeyTasksCategories < ActiveRecord::Migration[6.1]
  def change
    change_table :categories, id: true do |t|
      t.remove :category_id
    end
    change_table :tasks, id: true do |t|
      t.remove :task_id
    end
  end
end

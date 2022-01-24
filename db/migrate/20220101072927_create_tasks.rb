class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks, id: false, primary_key: :task_id do |t|
      t.integer :task_id, null: false
      t.string :name, null: false
      t.date :deadline, null: false

      t.timestamps
    end
  end
end

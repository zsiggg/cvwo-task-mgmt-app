class TaskCategoriesPrimaryKeyDefault < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.date :deadline
      t.timestamps
    end
    
    create_table :categories do |t|
      t.string :name, null: false
      t.timestamps
    end
    
    create_join_table :categories, :tasks do |t|
      t.timestamps
    end
  end
end

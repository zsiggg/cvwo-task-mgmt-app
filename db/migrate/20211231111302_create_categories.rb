class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories, id: false, primary_key: :category_id do |t|
      t.integer :category_id, null: false
      t.string :name, null: false
      t.timestamps
    end
  end
end

class Task < ApplicationRecord
    validates :name, presence: true
    has_many :categories_tasks
    has_many :categories, through: :categories_tasks
end

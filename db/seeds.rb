# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Task.create(name: "Finish this app", deadline: DateTime.new(2022, 1, 25))
Task.create(name: "Modreg Round 2", deadline: DateTime.new(2022, 1, 5))

Category.create(name: "Homework")
Category.create(name: "To Do")
Category.create(name: "Important")
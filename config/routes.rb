Rails.application.routes.draw do
  namespace :api do
    post 'tasks/create'
    get 'tasks/read'
    post '/tasks/update', to:'tasks#update'
    delete '/tasks/delete/:id', to:'tasks#delete'
    get '/tasks/show/:id', to:'tasks#show'
  end
  namespace :api do
    post 'categories/create'
    get 'categories/read'
    post '/categories/update', to:'categories#update'
    delete '/categories/delete/:id', to: 'categories#delete'
    get '/categories/show/:id', to: 'categories#show'
  end
  namespace :api do
    post 'categories_tasks/tag_category'
    post 'categories_tasks/read'
    post 'categories_tasks/untag_category'
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

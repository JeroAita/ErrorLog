Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "errors/summary" => "errors#summary", as: :errors_summary, defaults: { format: :json }
  get "errors/meta" => "errors#meta", as: :errors_meta, defaults: { format: :json }
  resources :errors, only: %i[index show update], defaults: { format: :json }

  # Defines the root path route ("/")
  # root "posts#index"
end

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_17_161722) do
  create_table "error_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "error_type", null: false
    t.text "message", null: false
    t.json "metadata"
    t.datetime "occurred_at", null: false
    t.string "service_name", null: false
    t.string "severity", null: false
    t.text "stack_trace"
    t.datetime "updated_at", null: false
    t.index ["occurred_at"], name: "index_error_logs_on_occurred_at"
    t.index ["service_name"], name: "index_error_logs_on_service_name"
  end
end

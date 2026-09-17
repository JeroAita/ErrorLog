class CreateErrorLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :error_logs do |t|
      t.datetime :occurred_at, null: false
      t.string :service_name, null: false
      t.string :error_type, null: false
      t.text :message, null: false
      t.text :stack_trace
      t.string :severity, null: false
      t.json :metadata

      t.timestamps
    end

    add_index :error_logs, :service_name
    add_index :error_logs, :occurred_at
  end
end

class AddStatusToErrorLogs < ActiveRecord::Migration[8.1]
  def change
    add_column :error_logs, :status, :string, null: false, default: "open"
    add_index :error_logs, :status
  end
end

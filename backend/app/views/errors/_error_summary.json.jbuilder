json.extract! error, :id, :service_name, :error_type, :message, :severity, :status
json.occurred_at error.occurred_at.iso8601
json.created_at error.created_at.iso8601
json.updated_at error.updated_at.iso8601

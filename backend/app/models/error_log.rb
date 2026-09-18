# frozen_string_literal: true

# Persiste un evento del tópico "error-logs" (ver docs/error_log_event.schema.json).
class ErrorLog < ApplicationRecord
  VALID_SEVERITIES = %w[debug info warning error critical].freeze
  STATUSES = %w[open investigating resolved ignored].freeze

  validates :occurred_at, presence: true
  validates :service_name, presence: true
  validates :error_type, presence: true
  validates :message, presence: true
  validates :severity, presence: true, inclusion: { in: VALID_SEVERITIES }
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :search, lambda { |term|
    pattern = "%#{term}%"
    where("message LIKE ? OR error_type LIKE ? OR service_name LIKE ?", pattern, pattern, pattern)
  }

  # Recibe un mensaje de Karafka (con #payload como Hash de claves string) y lo
  # persiste. Si el payload no cumple el contrato loguea un warning y devuelve
  # nil sin cortar el batch: un mensaje inválido no debe frenar el tópico.
  def self.ingest!(message)
    payload = message.payload

    return nil unless payload.is_a?(Hash) # tombstone o payload no JSON

    create!(
      occurred_at: Time.iso8601(payload.fetch("timestamp")),
      service_name: payload.fetch("service_name"),
      error_type: payload.fetch("error_type"),
      message: payload.fetch("message"),
      stack_trace: payload["stack_trace"],
      severity: payload.fetch("severity"),
      metadata: payload["metadata"] || {}
    )
  rescue KeyError, ArgumentError, ActiveRecord::RecordInvalid => e
    Rails.logger.warn("ErrorLog: evento descartado (#{e.message}). Payload: #{payload.inspect}")
    nil
  end
end

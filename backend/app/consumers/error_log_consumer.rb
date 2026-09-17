# frozen_string_literal: true

# Consumer del tópico "error-logs": persiste cada evento recibido en SQLite vía
# ErrorLog.ingest!. Los payloads que no cumplen el contrato no cortan el batch:
# se loguean y se saltean.
class ErrorLogConsumer < Karafka::BaseConsumer
  def consume
    messages.each do |message|
      Rails.logger.info("Error recibido en error-logs: #{message.payload['service_name'] || 'desconocido'}")
      ErrorLog.ingest!(message)
    end
  end
end

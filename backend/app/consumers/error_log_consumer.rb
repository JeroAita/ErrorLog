# frozen_string_literal: true

# Consumer del tópico "error-logs". Por ahora es un stub: loguea los mensajes
# recibidos para que "karafka server" pueda arrancar. La persistencia real en
# la base de datos SQLite es un trabajo posterior.
class ErrorLogConsumer < Karafka::BaseConsumer
  def consume
    messages.each do |message|
      Rails.logger.info("Error recibido en error-logs: #{message.payload}")
    end
  end
end

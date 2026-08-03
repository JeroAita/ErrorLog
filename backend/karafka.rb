# frozen_string_literal: true

# Este archivo vive en la raíz de la app Rails (backend/karafka.rb) y es
# el punto de entrada que usa tanto "bundle exec karafka server" como
# la propia app Rails para saber a qué cluster de Kafka conectarse.

require "karafka"
require_relative "config/environment"

class KarafkaApp < Karafka::App
  setup do |config|
    # Dirección del broker. En docker-compose los contenedores se resuelven
    # por nombre de servicio, por eso "kafka:9092" y no "localhost:9092".
    # Afuera de Docker (corriendo la app a mano) usarías localhost:9092.
    config.kafka = {
      "bootstrap.servers": ENV.fetch("KAFKA_BROKER", "localhost:9092")
    }

    # Nombre que identifica a este grupo de consumers ante Kafka.
    # Kafka usa esto para llevar el registro de qué mensajes ya se leyeron.
    config.client_id = "error_logs_backend"

    # En development conviene ver los logs de Karafka en la consola
    config.logger = Rails.logger

    # Formato de serialización de los mensajes que llegan al tópico.
    # Los productores Python van a mandar JSON, así que deserializamos igual.
    config.deserializers.payload = Karafka::Serialization::Json::Deserializer.new

    # Cuántos mensajes puede procesar en paralelo cada proceso consumer.
    # Con 1 tópico y fines de demostración, alcanza y sobra con un worker.
    config.concurrency = 2
  end

  # Rutas: qué consumer procesa qué tópico.
  # Acá es donde se conecta el tópico "error-logs" (definido en arquitectura.md)
  # con la clase que va a insertar cada error en la base de datos.
  routes.draw do
    topic "error-logs" do
      consumer ErrorLogConsumer
    end
  end
end
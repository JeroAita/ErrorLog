# README

Este backend es una aplicación **Ruby on Rails 8 (API-only)** con **SQLite** como
base de datos. Incluye un consumer de **Karafka** para el tópico `error-logs`.

Rails: 8.1.3.1 · Ruby: 3.3.12 (ver `backend/.ruby-version`) · BD: SQLite
(`storage/development.sqlite3`).

## Setup (sin Docker)

Requisitos: Ruby 3.3.12, Bundler y un Ruby con la gema `sqlite3` instalada.

~~~bash
cd backend
bundle install
bin/rails db:prepare    # crea storage/development.sqlite3 + schema
bin/rails server        # API en http://localhost:3000
~~~

### Consumer Karafka

~~~bash
bundle exec karafka server    # consume el tópico "error-logs"
~~~

La ruta del broker se toma de la variable `KAFKA_BROKER` (por defecto `localhost:9092`).
Los mensajes son JSON y los parsea el deserializer por defecto de Karafka.

## Testing, lint y seguridad

~~~bash
bin/rails test      # Minitest
bin/rubocop         # estilo
bin/brakeman        # análisis estático de seguridad
bin/bundler-audit   # auditoría de dependencias
~~~

## Arquitectura

Ver [docs/arquitectura.md](../docs/arquitectura.md) (diagrama + componentes:
productores Python → Kafka → consumer Rails → SQLite → frontend React).

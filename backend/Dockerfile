FROM ruby:3.3-slim

# Dependencias del sistema:
# - build-essential, libpq-dev: compilar gemas nativas (pg, etc.)
# - libyaml-dev: requerido por Ruby/psych
# - librdkafka-dev: requerido por la gema rdkafka que usa Karafka por debajo
# - curl, git: utilidades varias para bundler
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    libyaml-dev \
    librdkafka-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos primero solo el Gemfile para aprovechar la cache de Docker:
# si el código cambia pero las gemas no, no vuelve a correr bundle install.
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Ahora sí copiamos el resto del código de la app
COPY . .

# Puerto en el que corre el servidor Rails
EXPOSE 3000

# El comando real de arranque lo define el "command" de cada servicio
# en docker-compose.yaml (server para "backend", karafka server para "karafka-consumer")
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
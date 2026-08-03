
# Arquitectura

## Módulos lógicos

La base del sistema consiste en tres partes:

1. Productores
2. Instancia de Kafka
3. Sistema log de errores

Los **productores** son los programas o aplicaciones que tendrán errores y los comunicarán al sistema central de este proyecto.
Con motivo de demostración, en este repositorio se incluirán programas Python que generan errores a propósito: uno que intenta dividir por cero, otro que exceda el largo de un arreglo, etc.

La **instancia de Kafka** actúa como la base de datos que recibe los errores de los productores, y provee una interfaz con la que el sistema central consultará los errores existentes.

El **sistema log de errores** es el sistema central de este proyecto. Debe leer los errores existentes en la base de Kafka y proveer una interfaz web para que los desarrolladores de los productores puedan gestionar los errores.
El mismo consistirá en una aplicación web SPA: backend REST Ruby + frontend React.

## Sistema de Archivos

Directorios separados por responsabilidad:

~~~
docker-compose.yaml # Levantar imágenes de Kafka, base de datos y Ruby

docs/ # Documentación del proyecto

producers/ # Scripts Python que comandarán errores a Kafka
    producer_division_by_cero.py
    producer_index_error.py
    requirements.txt

backend/ # Aplicación Ruby on Rails
    app/
    config/
    db/
    Gemfile

frontend/ # Aplicación React
    src/
    package.json
~~~
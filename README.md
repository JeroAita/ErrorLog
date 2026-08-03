
# Bases de datos: TP Final - Sistema Log de errores

**Alumnos**

- Aita Jerónimo
- Condo Kevin

**Cátedra**

- Administración de Bases de datos
- Universidad Tecnológica Nacional, Facultad Regional Delta
- Junio 2026
- Profesor Vidal Jorge

## TP Final

**La consigna:** desarrollar una aplicación que utilice Apache Kafka.

### Apache Kafka

Plataforma de transmisión de datos distribuída, diseñada para manejar flujos de datos en tiempo real de manera escalable y de alto rendimiento.

Basado en mensajería publicador/suscriptor y registro de eventos: las aplicaciones publicadoras envían datos a Kafka, y las aplicaciones suscriptoras los consumen.

[Sitio web de Apache Kafka](https://kafka.apache.org/documentation/)

## Propuesta: Sistema log de errores

Como resolución al trabajo práctico, desarrollamos un sistema de monitoreo de errores de aplicaciones distribuídas.

**Tecnologías** utilizadas:

- Apache Kafka
- Ruby / Ruby on Rails / Karafka
- Javascript / React
- Docker
- PostgreSQL
- Python
- Programación dirigida por especificaciones / Agentes de IA

### Funcionamiento

Cuando una de las **aplicaciones principales** encuentra errores en tiempo de ejecución, las comunica a **nuestro sistema** para que los ingenieros de software analicen las incidencias (bugs) de forma cómoda y con herramientas poderosas.

~~~
[App principal]{datos de error} > [Kafka (Tópico: "error-logs")] > [Sistema de logs]{interfaz para devs}
~~~

### Ventajas

Principales ventajas del uso de nuestro sistema:

- **Desacoplamiento:** la app principal no necesita saber cómo se procesan los logs.
- **Persistencia:** los logs no se pierden por más que la app principal falle.
- **Orden:** los errores se procesan en el orden en el que ocurrieron.
- **Flexibilidad:** pueden desarrollarse más consumidores, como uno para notificaciones, otro para análisis de datos.

## Documentación

- [Arquitectura del proyecto](docs/arquitectura.md)
- (backend, frontend...)
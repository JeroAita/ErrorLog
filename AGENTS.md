
# AGENTS

Este repositorio contiene un proyecto para presentar en la universidad.

La documentación principal se encuentra distribuída:

- `README.md`
- `backend/README.md`
- `frontend/README.md`
- `docs/*` 

Para contextualizarse, el agente puede leer commits y *planes*, que se encuentran en `.opencode/plans`.

## Propósito del repositorio e idea general

Desarrollar un sistema que utilice Apache Kafka para demostrar su funcionamiento.

El sistema a desarrollar es un sistema que permite ver y gestionar los bugs que otros sistemas hayan reportado enviando mensajes vía Kafka. Para este trabajo los sistemas externos se simularán con scripts Python.

## Convenciones

Límites para los agentes de IA

- No realizar commits.
- No modificar ni borrar archivos sin leerlos antes.
- Cuando serán realizados cambios o adiciones a los archivos, siempre generar un archivo markdown en `.opencode/plans`, con nombre `"YYYY-MM-DD_contexto"` (siendo `contexto` una cadena relacionada con los cambios a realizar). El mismo debe contener:
    - Un objetivo, una descripción general de los cambios a realizar y el motivo.
    - Detalles relevantes al respecto, contexto.
    - El paso a paso técnico que se llevará a cabo, como modificaciones de archivos.
    - Los pasos a realizar para verificar que las modificaciones fueron efectivas.
- Luego de redactado el plan, el agente debe esperar la orden de implementarlo.
- Apenas se concluye la implementación del plan, deben realizarse las verificaciones y diagnosticar sus resultados.

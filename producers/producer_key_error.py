import os
import traceback
from datetime import datetime, timezone

from kafka import KafkaProducer
from kafka.serializer import JsonSerializer


def main():
    kafka_broker = os.getenv('KAFKA_BROKER', 'localhost:9092')
    payload = None
    try:
        data = {'name': 'test', 'value': 42}
        # Intencionalmente genera KeyError
        _ = data['missing_key']
    except Exception as e:
        payload = {
            'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'service_name': 'producer_key_error',
            'error_type': type(e).__name__,
            'message': str(e) if str(e) else 'key not found',
            'stack_trace': traceback.format_exc(),
            'severity': 'warning',
            'metadata': {
                'environment': 'development',
                'missing_key': 'missing_key',
                'context_keys': ['name', 'value']
            }
        }

    try:
        producer = KafkaProducer(
            bootstrap_servers=kafka_broker,
            value_serializer=JsonSerializer(),
            max_block_ms=10000,
            bootstrap_timeout_ms=5000,
            request_timeout_ms=10000
        )
        producer.send(
            'error-logs',
            key=payload['service_name'].encode('utf-8'),
            value=payload
        )
        producer.flush()
        producer.close()
        print(f'Sent error-log to Kafka: {payload["service_name"]} - {payload["error_type"]}')
    except Exception as send_err:
        print(f'Failed to send error-log to {kafka_broker}: {send_err}', flush=True)
        print(
            'Check that Kafka is running (docker compose up -d) and that '
            'KAFKA_BROKER points to the right broker.',
            flush=True
        )
        raise


if __name__ == '__main__':
    main()

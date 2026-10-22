import os
import traceback
from datetime import datetime, timezone

from kafka import KafkaProducer
from kafka.serializer import JsonSerializer


def main():
    kafka_broker = os.getenv('KAFKA_BROKER', 'localhost:9092')
    payload = None
    try:
        # Intencionalmente genera ZeroDivisionError
        _ = 1 / 0
    except Exception as e:
        payload = {
            'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'service_name': 'producer_division_by_zero',
            'error_type': type(e).__name__,
            'message': str(e) if str(e) else 'division by zero',
            'stack_trace': traceback.format_exc(),
            'severity': 'error',
            'metadata': {
                'environment': 'development',
                'request_id': 'req-001',
                'operation': 'division'
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

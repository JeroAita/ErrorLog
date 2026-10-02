import json
import os
import traceback
from datetime import datetime, timezone

from kafka import KafkaProducer


def main():
    kafka_broker = os.getenv('KAFKA_BROKER', 'localhost:9092')
    payload = None
    try:
        items = []
        # Intencionalmente genera IndexError
        _ = items[10]
    except Exception as e:
        payload = {
            'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'service_name': 'producer_index_error',
            'error_type': type(e).__name__,
            'message': str(e) if str(e) else 'list index out of range',
            'stack_trace': traceback.format_exc(),
            'severity': 'error',
            'metadata': {
                'environment': 'development',
                'list_length': 0,
                'attempted_index': 10
            }
        }

    try:
        producer = KafkaProducer(
            bootstrap_servers=kafka_broker,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
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
        print(f'Failed to send error-log: {send_err}', flush=True)
        raise


if __name__ == '__main__':
    main()

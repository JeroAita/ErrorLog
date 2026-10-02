import json
import os
import traceback
from datetime import datetime, timezone

from kafka import KafkaProducer


def main():
    kafka_broker = os.getenv('KAFKA_BROKER', 'localhost:9092')
    payload = None
    try:
        # Intencionalmente genera FileNotFoundError
        with open('nonexistent_file_xyz.txt', 'r') as f:
            _ = f.read()
    except Exception as e:
        payload = {
            'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'service_name': 'producer_file_not_found',
            'error_type': type(e).__name__,
            'message': str(e) if str(e) else 'No such file or directory',
            'stack_trace': traceback.format_exc(),
            'severity': 'critical',
            'metadata': {
                'environment': 'development',
                'path_attempted': 'nonexistent_file_xyz.txt',
                'mode': 'r'
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

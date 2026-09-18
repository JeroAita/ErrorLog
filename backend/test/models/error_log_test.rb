# frozen_string_literal: true

require "test_helper"

class ErrorLogTest < ActiveSupport::TestCase
  FakeMessage = Struct.new(:payload)

  def valid_payload(overrides = {})
    {
      "timestamp" => "2026-09-17T14:30:00Z",
      "service_name" => "producer_division_by_cero",
      "error_type" => "ZeroDivisionError",
      "message" => "division by zero",
      "stack_trace" => "Traceback (most recent call last):\n  ...",
      "severity" => "error",
      "metadata" => { "environment" => "development" }
    }.merge(overrides)
  end

  test "persiste un payload válido" do
    assert_difference("ErrorLog.count", 1) do
      ErrorLog.ingest!(FakeMessage.new(valid_payload))
    end

    log = ErrorLog.last
    assert_equal Time.iso8601("2026-09-17T14:30:00Z"), log.occurred_at
    assert_equal "producer_division_by_cero", log.service_name
    assert_equal "ZeroDivisionError", log.error_type
    assert_equal "division by zero", log.message
    assert_equal "Traceback (most recent call last):\n  ...", log.stack_trace
    assert_equal "error", log.severity
    assert_equal "open", log.status
    assert_equal({ "environment" => "development" }, log.metadata)
  end

  test "no persiste payload sin stack_trace ni metadata" do
    payload = valid_payload.except("stack_trace", "metadata")

    assert_difference("ErrorLog.count", 1) do
      ErrorLog.ingest!(FakeMessage.new(payload))
    end

    log = ErrorLog.last
    assert_nil log.stack_trace
    assert_equal({}, log.metadata)
  end

  test "descarto payloads que no son Hash (tombstone)" do
    assert_no_difference("ErrorLog.count") do
      ErrorLog.ingest!(FakeMessage.new(nil))
    end
  end

  test "descarto payload sin campo requerido" do
    payload = valid_payload.except("message")

    assert_no_difference("ErrorLog.count") do
      ErrorLog.ingest!(FakeMessage.new(payload))
    end
  end

  test "descarto payload con timestamp mal formado" do
    payload = valid_payload("timestamp" => "no es una fecha")

    assert_no_difference("ErrorLog.count") do
      ErrorLog.ingest!(FakeMessage.new(payload))
    end
  end

  test "descarto payload con severity inválida" do
    payload = valid_payload("severity" => "fatal")

    assert_no_difference("ErrorLog.count") do
      ErrorLog.ingest!(FakeMessage.new(payload))
    end
  end

  test "validaciones de presencia" do
    %i[occurred_at service_name error_type message severity].each do |attr|
      log = ErrorLog.new(
        occurred_at: Time.iso8601("2026-09-17T14:30:00Z"),
        service_name: "svc",
        error_type: "Err",
        message: "msg",
        severity: "error"
      )
      log[attr] = nil
      assert_not log.valid?, "#{attr} debería validar presencia"
      assert_includes log.errors[attr], "can't be blank"
    end
  end

  test "severity solo acepta el enum del contrato" do
    assert ErrorLog.new(valid_error_log_attrs("error")).valid?

    %w[debug info warning error critical].each do |severity|
      log = ErrorLog.new(valid_error_log_attrs(severity))
      assert log.valid?, "severity '#{severity}' debería ser válida"
    end

    assert_not ErrorLog.new(valid_error_log_attrs("fatal")).valid?
  end

  private

  def valid_error_log_attrs(severity)
    {
      occurred_at: Time.iso8601("2026-09-17T14:30:00Z"),
      service_name: "svc",
      error_type: "Err",
      message: "msg",
      severity: severity
    }
  end
end

# frozen_string_literal: true

require "test_helper"

class ErrorsApiTest < ActionDispatch::IntegrationTest
  test "index devuelve todos con envelope y paginación por defecto" do
    get "/errors"

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal ErrorLog.count, body["data"].length
    assert_equal ({ "page" => 1, "per_page" => 100, "total" => ErrorLog.count, "total_pages" => 1 }),
                 body["meta"]

    first = body["data"].first
    assert_nil first["stack_trace"]
    assert_nil first["metadata"]
  end

  test "index filtra por severity" do
    get "/errors", params: { severity: "critical" }

    body = JSON.parse(response.body)
    assert_equal [ error_logs(:index_error).id ], body["data"].map { |e| e["id"] }
  end

  test "index filtra por status" do
    error_logs(:division_by_zero).update!(status: "resolved")

    get "/errors", params: { status: "open" }

    body = JSON.parse(response.body)
    assert_equal [ error_logs(:index_error).id ], body["data"].map { |e| e["id"] }
  end

  test "index filtra por service_name" do
    get "/errors", params: { service_name: "producer_division_by_cero" }

    body = JSON.parse(response.body)
    assert_equal [ error_logs(:division_by_zero).id ], body["data"].map { |e| e["id"] }
  end

  test "index filtra por q en message" do
    get "/errors", params: { q: "division" }

    body = JSON.parse(response.body)
    assert_equal [ error_logs(:division_by_zero).id ], body["data"].map { |e| e["id"] }
  end

  test "index filtra por rango de fechas" do
    get "/errors", params: { from: "2026-09-17T14:45:00Z" }

    body = JSON.parse(response.body)
    assert_equal [ error_logs(:index_error).id ], body["data"].map { |e| e["id"] }
  end

  test "index pagina" do
    get "/errors", params: { page: 1, per_page: 1 }

    body = JSON.parse(response.body)
    assert_equal 1, body["data"].length
    assert_equal error_logs(:index_error).id, body["data"].first["id"]
    assert_equal ({ "page" => 1, "per_page" => 1, "total" => ErrorLog.count, "total_pages" => ErrorLog.count }),
                 body["meta"]
  end

  test "index ordena por service_name descendente" do
    get "/errors", params: { sort: "service_name", order: "asc" }

    body = JSON.parse(response.body)
    names = body["data"].map { |e| e["service_name"] }
    assert_equal names.sort, names
  end

  test "index responde 400 con fechas inválidas" do
    get "/errors", params: { from: "no-es-una-fecha" }

    assert_response :bad_request
  end

  test "show devuelve el detalle completo" do
    error = error_logs(:division_by_zero)

    get "/errors/#{error.id}", as: :json

    assert_response :success
    data = JSON.parse(response.body)["data"]
    assert_equal error.id, data["id"]
    assert_equal "error", data["severity"]
    assert_equal "Traceback (most recent call last):\n  ...", data["stack_trace"]
    assert_equal({ "environment" => "development", "user_id" => 42 }, data["metadata"])
    assert_equal "open", data["status"]
  end

  test "show responde 404 para un id inexistente" do
    get "/errors/999999", as: :json

    assert_response :not_found
    assert_equal({ "error" => "error_log not found" }, JSON.parse(response.body))
  end

  test "update cambia el status" do
    error = error_logs(:division_by_zero)

    patch "/errors/#{error.id}", as: :json, params: { status: "investigating" }

    assert_response :success
    data = JSON.parse(response.body)["data"]
    assert_equal "investigating", data["status"]
    assert_equal "investigating", error.reload.status
  end

  test "update responde 422 con un status inválido" do
    patch "/errors/#{error_logs(:division_by_zero).id}", as: :json, params: { status: "bogus" }

    assert_response :unprocessable_entity
  end

  test "update responde 400 sin parámetro status" do
    patch "/errors/#{error_logs(:division_by_zero).id}", as: :json, params: {}

    assert_response :bad_request
  end

  test "update responde 404 para un id inexistente" do
    patch "/errors/999999", as: :json, params: { status: "resolved" }

    assert_response :not_found
  end

  test "summary agrupa por status, severity, service y error_type" do
    get "/errors/summary"

    assert_response :success
    data = JSON.parse(response.body)["data"]
    assert_equal ErrorLog.count, data["total"]
    assert_equal({ "open" => ErrorLog.count }, data["by_status"])
    assert_equal error_logs(:division_by_zero).severity.to_s, data["by_severity"].keys.max
    assert_equal 2, data["by_service"].length
    assert_equal 2, data["by_error_type"].length
  end

  test "summary filtra por service_name" do
    get "/errors/summary", params: { service_name: "producer_index_error" }

    data = JSON.parse(response.body)["data"]
    assert_equal 1, data["total"]
  end

  test "meta devuelve los enums y valores presentes" do
    get "/errors/meta"

    assert_response :success
    data = JSON.parse(response.body)["data"]
    assert_equal %w[debug info warning error critical], data["severities"]
    assert_equal %w[open investigating resolved ignored], data["statuses"]
    assert_includes data["services"], "producer_division_by_cero"
    assert_includes data["error_types"], "ZeroDivisionError"
  end
end

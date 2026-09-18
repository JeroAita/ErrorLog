# frozen_string_literal: true

# Expone el contrato REST que consume el frontend React: listado con filtros,
# detalle, actualización de status y endpoints de apoyo (summary/meta).
class ErrorsController < ApplicationController
  SORTABLE_COLUMNS = %w[occurred_at service_name error_type severity status created_at].freeze
  PER_PAGE_MAX = 100

  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: "error_log not found" }, status: :not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { error: e.record.errors.full_messages.to_sentence }, status: :unprocessable_entity
  end

  rescue_from ActionController::BadRequest do |e|
    render json: { error: e.message }, status: :bad_request
  end

  def index
    @logs = filtered_logs.order(sort_clause).offset(offset).limit(per_page_param)
    @page = page_param
    @per_page = per_page_param
    @total = filtered_logs.count
    @total_pages = (@total.to_f / @per_page).ceil
  end

  def show
    @error = ErrorLog.find(params[:id])
  end

  def update
    @error = ErrorLog.find(params[:id])
    @error.update!(status: params.fetch(:status))
  end

  def summary
    from, to = date_range
    scope = ErrorLog.all
    scope = scope.where(service_name: params[:service_name]) if params[:service_name].present?
    scope = scope.where(occurred_at: from..to) if from.present?

    @summary = {
      total: scope.count,
      by_status: group_counts(scope, :status),
      by_severity: group_counts(scope, :severity),
      by_service: group_counts(scope, :service_name),
      by_error_type: group_counts(scope, :error_type)
    }
  end

  def meta
    @data = {
      severities: ErrorLog::VALID_SEVERITIES,
      statuses: ErrorLog::STATUSES,
      services: distinct_values(:service_name).sort,
      error_types: distinct_values(:error_type).sort
    }
  end

  private

  def filtered_logs
    scope = ErrorLog.all
    scope = scope.where(service_name: params[:service_name]) if params[:service_name].present?
    scope = scope.where(error_type: params[:error_type]) if params[:error_type].present?
    scope = scope.where(severity: params[:severity]) if params[:severity].present?
    scope = scope.where(status: params[:status]) if params[:status].present?
    scope = scope.search(params[:q]) if params[:q].present?

    from, to = date_range
    scope = scope.where(occurred_at: from..to) if from.present?
    scope
  end

  def date_range
    from = params[:from].present? ? Time.iso8601(params[:from]) : nil
    to = params[:to].present? ? Time.iso8601(params[:to]) : nil
    [ from, to ]
  rescue ArgumentError
    raise ActionController::BadRequest, "from/to deben ser fechas ISO-8601"
  end

  def sort_clause
    column = SORTABLE_COLUMNS.include?(params[:sort]) ? params[:sort] : "occurred_at"
    direction = params[:order] == "asc" ? "ASC" : "DESC"
    "#{column} #{direction}"
  end

  def offset
    (page_param - 1) * per_page_param
  end

  def page_param
    page = params[:page].to_i
    page.positive? ? page : 1
  end

  def per_page_param
    per_page = params[:per_page].to_i
    per_page.positive? ? [ per_page, PER_PAGE_MAX ].min : PER_PAGE_MAX
  end

  def distinct_values(column)
    ErrorLog.distinct.pluck(column).compact
  end

  def group_counts(scope, column)
    scope.group(column).count
  end
end

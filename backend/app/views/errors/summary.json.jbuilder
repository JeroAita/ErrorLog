json.data do
  json.total @summary[:total]
  json.by_status @summary[:by_status]
  json.by_severity @summary[:by_severity]
  json.by_service @summary[:by_service]
  json.by_error_type @summary[:by_error_type]
end

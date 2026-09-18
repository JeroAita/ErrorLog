json.data do
  json.severities @data[:severities]
  json.statuses @data[:statuses]
  json.services @data[:services]
  json.error_types @data[:error_types]
end

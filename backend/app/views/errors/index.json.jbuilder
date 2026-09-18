json.data @logs, partial: "error_summary", as: :error
json.meta do
  json.page @page
  json.per_page @per_page
  json.total @total
  json.total_pages @total_pages
end

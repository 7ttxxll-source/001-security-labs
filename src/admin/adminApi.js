export async function adminApi(path, options = {}) {
  const headers = { Accept: "application/json", ...(options.headers || {}) }
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json"

  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers,
  })

  let data = null
  try { data = await response.json() } catch { data = null }
  if (!response.ok) {
    const error = new Error(data?.error || `HTTP_${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export function formatDate(value) {
  if (!value) return "—"
  try {
    return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  } catch {
    return value
  }
}

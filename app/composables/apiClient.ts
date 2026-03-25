interface FetchOptions {
  method: string
  headers?: Record<string, string>
  body?: any
}

function statusErrorHandler(error: any) {
  console.error(error)
}

function getFetchOptions({ method, headers, body }: FetchOptions) {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  const options: any = {
    method,
    headers: { ...defaultHeaders, ...headers }
  }

  if (method !== 'GET' && body) {
    options.body = JSON.stringify(body)
  }

  return options
}

interface FetchClientParams {
  baseUrl?: string
  endpoint?: string
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

async function apiClient<T = unknown>({
  baseUrl = '',
  endpoint = '',
  method = 'POST',
  headers = {},
  body = null
}: FetchClientParams): Promise<T> {
  const initData = getFetchOptions({ method, headers, body })

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, initData)

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP ${response.status}: ${text}`)
    }

    const result: T = await response.json()
    return result
  } catch (error) {
    statusErrorHandler(error)
    throw error
  }
}

export default apiClient

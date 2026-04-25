import { isAxiosError } from 'axios'

export function getApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (Array.isArray(detail)) return detail[0]?.msg ?? 'Validation error'
    if (typeof detail === 'string') return detail
    return error.response?.data?.message ?? error.message
  }
  return 'An unexpected error occurred'
}

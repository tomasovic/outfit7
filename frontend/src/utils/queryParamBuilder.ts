import {UrlParams} from '@/utils/types'

export function buildQueryString(params: UrlParams) {
  let searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}

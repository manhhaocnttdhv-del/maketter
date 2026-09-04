const csrfStorageKey = 'tnth-editor-csrf-token'

interface EditorSessionResponse {
  authenticated: boolean
  csrfToken?: string
}

interface UploadResponse {
  url: string
}

export interface UploadedImage {
  path: string
  url: string
  name: string
  source: 'uploads'
  updatedAt: number
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null) as (T & { message?: string }) | null
  if (!response.ok || !data) {
    throw new Error(data?.message || 'Máy chủ không xử lý được yêu cầu.')
  }
  return data
}

export const getEditorSession = async (): Promise<EditorSessionResponse> => {
  const response = await fetch('/api/editor-auth.php', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
  const data = await parseResponse<EditorSessionResponse>(response)
  if (data.csrfToken) sessionStorage.setItem(csrfStorageKey, data.csrfToken)
  return data
}

export const loginEditor = async (password: string): Promise<void> => {
  const response = await fetch('/api/editor-auth.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
  const data = await parseResponse<EditorSessionResponse>(response)
  if (!data.authenticated || !data.csrfToken) throw new Error('Không thể tạo phiên đăng nhập editor.')
  sessionStorage.setItem(csrfStorageKey, data.csrfToken)
}

export const logoutEditor = async (): Promise<void> => {
  const csrfToken = sessionStorage.getItem(csrfStorageKey) ?? ''
  sessionStorage.removeItem(csrfStorageKey)
  await fetch('/api/editor-auth.php', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': csrfToken,
    },
  }).catch(() => undefined)
}

export const uploadEditorImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file, file.name)
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  })
  const data = await parseResponse<UploadResponse>(response)
  return data.url
}

export const fetchUploadedImages = async (): Promise<UploadedImage[]> => {
  const response = await fetch(`/api/images?v=${Date.now()}`, {
    headers: { Accept: 'application/json' },
  })
  const data = await parseResponse<{ images: UploadedImage[] }>(response)
  return Array.isArray(data.images) ? data.images : []
}

export const saveSiteContentApi = async (content: unknown): Promise<void> => {
  const response = await fetch('/api/site-content', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  await parseResponse<{ success: boolean }>(response)
}

export const fetchSiteContentApi = async (): Promise<unknown> => {
  const response = await fetch(`/api/site-content?v=${Date.now()}`, {
    headers: {
      Accept: 'application/json',
    },
  })
  return parseResponse<unknown>(response)
}


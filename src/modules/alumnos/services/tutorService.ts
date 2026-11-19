import type { CrearTutor, Tutor } from '../types/Tutor'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'
const ESCUELA_ID = Number(import.meta.env.VITE_ESCUELA_ID ?? 1)

export class TutorApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'TutorApiError'
    this.status = status
  }
}

async function respuesta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Error HTTP ${response.status}`
    try {
      const body = (await response.json()) as { message?: string | string[] }
      message = Array.isArray(body.message) ? body.message.join(' ') : body.message ?? message
    } catch {
      // La API puede responder sin JSON en errores inesperados.
    }
    throw new TutorApiError(response.status, message)
  }
  return (await response.json()) as T
}

export async function crearTutor(datos: Omit<CrearTutor, 'escuelaId'>): Promise<Tutor> {
  const response = await fetch(`${API_URL}/tutores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, escuelaId: ESCUELA_ID }),
  })
  return respuesta<Tutor>(response)
}

export async function consultarTutores(search = ''): Promise<Tutor[]> {
  const params = new URLSearchParams({ escuelaId: String(ESCUELA_ID) })
  if (search.trim()) params.set('search', search.trim())
  const response = await fetch(`${API_URL}/tutores?${params.toString()}`)
  return respuesta<Tutor[]>(response)
}

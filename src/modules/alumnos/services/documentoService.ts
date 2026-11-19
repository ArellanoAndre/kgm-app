import type { DocumentoAlumno } from '../types/documentos'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'
const ESCUELA_ID = 1

export async function listarDocumentos(alumnoId: number): Promise<DocumentoAlumno[]> {
  const response = await fetch(`${API_URL}/documentos?alumnoId=${alumnoId}&escuelaId=${ESCUELA_ID}`)
  if (!response.ok) throw new Error('No fue posible consultar el expediente.')
  return (await response.json()) as DocumentoAlumno[]
}

export async function subirDocumento(alumnoId: number, tipo: string, archivo: File): Promise<DocumentoAlumno> {
  const formData = new FormData()
  formData.append('alumnoId', String(alumnoId))
  formData.append('tipo', tipo)
  formData.append('archivo', archivo)
  const response = await fetch(`${API_URL}/documentos?escuelaId=${ESCUELA_ID}`, { method: 'POST', body: formData })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? (response.status === 413 ? 'El documento no puede superar 5 MB.' : 'No fue posible adjuntar el documento.'))
  }
  return (await response.json()) as DocumentoAlumno
}

export async function eliminarDocumento(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/documentos/${id}?escuelaId=${ESCUELA_ID}`, { method: 'DELETE' })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null
    const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message
    throw new Error(message ?? `No fue posible eliminar el documento (HTTP ${response.status}).`)
  }
}

export function urlDocumento(id: number): string {
  return `${API_URL}/documentos/${id}/contenido?escuelaId=${ESCUELA_ID}`
}

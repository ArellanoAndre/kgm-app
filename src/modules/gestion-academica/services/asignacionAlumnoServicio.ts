import type {
  AlumnoAsignable,
  NuevaAsignacionAlumno,
  OpcionesAsignacion,
} from '../types/AsignacionAlumno'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
const ESCUELA_ID = Number(import.meta.env.VITE_ESCUELA_ID)

type RespuestaApi = {
  message?: string | string[]
}

function obtenerEscuelaId(): number {
  if (!Number.isInteger(ESCUELA_ID) || ESCUELA_ID < 1) {
    throw new Error('Configura VITE_ESCUELA_ID con el ID de la escuela de desarrollo.')
  }
  return ESCUELA_ID
}

async function procesarError(respuesta: Response): Promise<never> {
  let detalle = `Error HTTP ${respuesta.status}`
  try {
    const cuerpo = (await respuesta.json()) as RespuestaApi
    detalle = Array.isArray(cuerpo.message)
      ? cuerpo.message.join(' ')
      : cuerpo.message ?? detalle
  } catch {
    detalle = `Error HTTP ${respuesta.status}: la API no devolvió un mensaje válido.`
  }
  throw new Error(detalle)
}

async function procesarRespuesta<T>(respuesta: Response): Promise<T> {
  if (!respuesta.ok) return procesarError(respuesta)
  return (await respuesta.json()) as T
}

export async function obtenerAlumnosAsignables(): Promise<AlumnoAsignable[]> {
  const respuesta = await fetch(
    `${API_URL}/alumnos/asignaciones?escuelaId=${obtenerEscuelaId()}`,
  )
  return procesarRespuesta<AlumnoAsignable[]>(respuesta)
}

export async function obtenerOpcionesAsignacion(): Promise<OpcionesAsignacion> {
  const respuesta = await fetch(
    `${API_URL}/alumnos/asignaciones/opciones?escuelaId=${obtenerEscuelaId()}`,
  )
  return procesarRespuesta<OpcionesAsignacion>(respuesta)
}

export async function guardarAsignacionAlumno(
  alumnoId: number,
  asignacion: NuevaAsignacionAlumno,
): Promise<AlumnoAsignable> {
  const respuesta = await fetch(
    `${API_URL}/alumnos/asignaciones/${alumnoId}?escuelaId=${obtenerEscuelaId()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asignacion),
    },
  )
  return procesarRespuesta<AlumnoAsignable>(respuesta)
}

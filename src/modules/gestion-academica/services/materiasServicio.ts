import type {
  DatosMateria,
  Materia,
  OpcionesMateria,
} from '../types/Materia'

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3000'

const ESCUELA_ID_CONFIGURADA = Number(import.meta.env.VITE_ESCUELA_ID)
const ESCUELA_ID =
  Number.isInteger(ESCUELA_ID_CONFIGURADA) && ESCUELA_ID_CONFIGURADA > 0
    ? ESCUELA_ID_CONFIGURADA
    : 1

type RespuestaApi = {
  message?: string | string[]
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

export async function obtenerMaterias(): Promise<Materia[]> {
  const respuesta = await fetch(
    `${API_URL}/materias?escuelaId=${ESCUELA_ID}`,
  )
  return procesarRespuesta<Materia[]>(respuesta)
}

export async function obtenerOpcionesMaterias(): Promise<OpcionesMateria> {
  const respuesta = await fetch(
    `${API_URL}/materias/opciones?escuelaId=${ESCUELA_ID}`,
  )
  return procesarRespuesta<OpcionesMateria>(respuesta)
}

export async function crearMateria(datos: DatosMateria): Promise<Materia> {
  const respuesta = await fetch(`${API_URL}/materias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      escuelaId: ESCUELA_ID,
      gradoId: datos.gradoId,
      clave: datos.clave,
      nombre: datos.nombre,
    }),
  })
  return procesarRespuesta<Materia>(respuesta)
}

export async function actualizarMateria(
  id: number,
  datos: DatosMateria,
): Promise<Materia> {
  const respuesta = await fetch(
    `${API_URL}/materias/${id}?escuelaId=${ESCUELA_ID}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gradoId: datos.gradoId,
        clave: datos.clave,
        nombre: datos.nombre,
      }),
    },
  )
  return procesarRespuesta<Materia>(respuesta)
}

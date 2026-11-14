import type {
  AsignacionAcademica,
  DatosAsignacionAcademica,
  OpcionesAsignacionAcademica,
} from '../types/AsignacionAcademica'

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

type AsignacionAcademicaApi = Omit<
  AsignacionAcademica,
  'docenteFoto'
> & {
  docenteFoto: string | null
}

type OpcionesAsignacionApi = Omit<
  OpcionesAsignacionAcademica,
  'docentes'
> & {
  docentes: {
    id: number
    nombreCompleto: string
    curp: string
    foto: string | null
  }[]
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

function mapearFoto(ruta: string | null): string | null {
  return ruta ? `${API_URL}${ruta}` : null
}

function mapearAsignacion(
  asignacion: AsignacionAcademicaApi,
): AsignacionAcademica {
  return {
    ...asignacion,
    docenteFoto: mapearFoto(asignacion.docenteFoto),
  }
}

export async function obtenerAsignacionesAcademicas(): Promise<
  AsignacionAcademica[]
> {
  const respuesta = await fetch(
    `${API_URL}/asignaciones-academicas?escuelaId=${ESCUELA_ID}`,
  )
  const asignaciones =
    await procesarRespuesta<AsignacionAcademicaApi[]>(respuesta)
  return asignaciones.map(mapearAsignacion)
}

export async function obtenerOpcionesAsignacionesAcademicas(): Promise<OpcionesAsignacionAcademica> {
  const respuesta = await fetch(
    `${API_URL}/asignaciones-academicas/opciones?escuelaId=${ESCUELA_ID}`,
  )
  const opciones = await procesarRespuesta<OpcionesAsignacionApi>(respuesta)
  return {
    ...opciones,
    docentes: opciones.docentes.map((docente) => ({
      ...docente,
      foto: mapearFoto(docente.foto),
    })),
  }
}

export async function crearAsignacionAcademica(
  datos: DatosAsignacionAcademica,
): Promise<AsignacionAcademica> {
  const respuesta = await fetch(`${API_URL}/asignaciones-academicas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      escuelaId: ESCUELA_ID,
      cicloId: datos.cicloId,
      grupoId: datos.grupoId,
      materiaId: datos.materiaId,
      docenteId: datos.docenteId,
    }),
  })
  return mapearAsignacion(
    await procesarRespuesta<AsignacionAcademicaApi>(respuesta),
  )
}

export async function actualizarAsignacionAcademica(
  id: number,
  datos: DatosAsignacionAcademica,
): Promise<AsignacionAcademica> {
  const respuesta = await fetch(
    `${API_URL}/asignaciones-academicas/${id}?escuelaId=${ESCUELA_ID}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cicloId: datos.cicloId,
        grupoId: datos.grupoId,
        materiaId: datos.materiaId,
        docenteId: datos.docenteId,
      }),
    },
  )
  return mapearAsignacion(
    await procesarRespuesta<AsignacionAcademicaApi>(respuesta),
  )
}

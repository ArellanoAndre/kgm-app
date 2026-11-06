import type { DatosRegistroDocente, Docente, EstadoDocente } from '../types/Docente'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
const ESCUELA_ID = Number(import.meta.env.VITE_ESCUELA_ID)

type DocenteApi = {
  id: number
  nombreCompleto: string
  curp: string
  correo: string | null
  estado: EstadoDocente
  asignacion: string | null
  ciclo: string
  fechaNacimiento: string | null
  telefono: string | null
  direccion: string | null
  foto: string | null
}

function obtenerEscuelaId(): number {
  if (!Number.isInteger(ESCUELA_ID) || ESCUELA_ID < 1) {
    throw new Error('Configura VITE_ESCUELA_ID con el ID de la escuela de desarrollo.')
  }
  return ESCUELA_ID
}

function mapearDocente(docente: DocenteApi): Docente {
  return {
    id: docente.id,
    nombre: docente.nombreCompleto,
    curp: docente.curp,
    correo: docente.correo ?? '',
    estado: docente.estado,
    asignacion: docente.asignacion,
    ciclo: docente.ciclo,
    fechaNacimiento: docente.fechaNacimiento ?? undefined,
    telefono: docente.telefono ?? undefined,
    direccion: docente.direccion ?? undefined,
    foto: docente.foto ? `${API_URL}${docente.foto}` : undefined,
  }
}

async function procesarError(respuesta: Response): Promise<never> {
  let detalle = `Error HTTP ${respuesta.status}`
  try {
    const cuerpo = (await respuesta.json()) as { message?: string | string[] }
    detalle = Array.isArray(cuerpo.message)
      ? cuerpo.message.join(' ')
      : cuerpo.message ?? detalle
  } catch {
    detalle = `Error HTTP ${respuesta.status}: la API no devolvió un mensaje válido.`
  }
  throw new Error(detalle)
}

async function procesarRespuesta(respuesta: Response): Promise<DocenteApi[]> {
  if (!respuesta.ok) {
    return procesarError(respuesta)
  }
  return (await respuesta.json()) as DocenteApi[]
}

async function procesarDocente(respuesta: Response): Promise<Docente> {
  if (!respuesta.ok) return procesarError(respuesta)
  return mapearDocente((await respuesta.json()) as DocenteApi)
}

export async function obtenerDocentes(): Promise<Docente[]> {
  const respuesta = await fetch(
    `${API_URL}/docentes?escuelaId=${obtenerEscuelaId()}`,
  )
  return (await procesarRespuesta(respuesta)).map(mapearDocente)
}

export async function registrarDocente(
  datos: DatosRegistroDocente,
): Promise<Docente> {
  const formulario = new FormData()
  formulario.set('escuelaId', String(obtenerEscuelaId()))
  formulario.set('nombre', datos.nombre)
  formulario.set('apellidoPaterno', datos.apellidoPaterno)
  formulario.set('apellidoMaterno', datos.apellidoMaterno)
  formulario.set('curp', datos.curp)
  formulario.set('fechaNacimiento', datos.fechaNacimiento)
  formulario.set('estado', datos.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO')
  formulario.set('telefono', datos.telefono)
  formulario.set('correo', datos.correo)
  formulario.set('direccion', datos.direccion)
  if (datos.foto) formulario.set('foto', datos.foto)

  const respuesta = await fetch(`${API_URL}/docentes`, {
    method: 'POST',
    body: formulario,
  })
  return procesarDocente(respuesta)
}

export async function actualizarEstadoDocente(
  id: number,
  estado: EstadoDocente,
): Promise<Docente> {
  const respuesta = await fetch(
    `${API_URL}/docentes/${id}?escuelaId=${obtenerEscuelaId()}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: estado === 'Activo' ? 'ACTIVO' : 'INACTIVO',
      }),
    },
  )
  return procesarDocente(respuesta)
}

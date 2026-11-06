import type { Alumno, AlumnoEditable, EstadoAlumno } from '../types/Alumno'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'

interface ApiDatosEscolares {
  alumnoGrupoId: number
  grado: string
  gradoId: number
  grupo: string
  grupoId: number
  cicloEscolar: string
  cicloId: number
  activo: boolean
  turno: string | null
  fechaIngreso: string | null
  observaciones: string | null
}

interface ApiTutor {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  parentesco: string
  correo: string | null
  telefono: string | null
  direccion: string | null
}

interface ApiExpediente {
  rutaArchivoPdf?: string | null
}

interface ApiAlumno {
  id: number
  curp: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  fechaNacimiento: string
  nacionalidad: string | null
  genero: string | null
  direccion: string | null
  telefono: string | null
  correo: string | null
  datosEscolares: ApiDatosEscolares | null
  tutorPrincipal: ApiTutor | null
  expedienteAcademico: ApiExpediente | null
}

function fechaParaInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : ''
}

function nombreArchivo(ruta: string): string {
  return ruta.split(/[\\/]/).pop() || ruta
}

function mapearAlumno(api: ApiAlumno): Alumno {
  const tutor = api.tutorPrincipal
  const datosEscolares = api.datosEscolares
  const estado: EstadoAlumno = datosEscolares?.activo === false ? 'Baja' : 'Activo'
  const rutaExpediente = api.expedienteAcademico?.rutaArchivoPdf

  return {
    id: api.id,
    nombres: api.nombre ?? '',
    apellidoPaterno: api.apellidoPaterno ?? '',
    apellidoMaterno: api.apellidoMaterno ?? '',
    curp: api.curp ?? '',
    fechaNacimiento: fechaParaInput(api.fechaNacimiento),
    genero: api.genero ?? '',
    nacionalidad: api.nacionalidad ?? '',
    telefono: api.telefono ?? '',
    correo: api.correo ?? '',
    direccion: api.direccion ?? '',
    grado: datosEscolares?.grado ?? 'Sin asignar',
    grupo: datosEscolares?.grupo ?? 'Sin asignar',
    cicloEscolar: datosEscolares?.cicloEscolar ?? 'Sin asignar',
    estado,
    turno: datosEscolares?.turno ?? '',
    fechaIngreso: fechaParaInput(datosEscolares?.fechaIngreso),
    observaciones: datosEscolares?.observaciones ?? '',
    tutor: {
      nombre: tutor
        ? [tutor.nombre, tutor.apellidoPaterno, tutor.apellidoMaterno].filter(Boolean).join(' ')
        : 'Sin tutor registrado',
      parentesco: tutor?.parentesco ?? '',
      telefono: tutor?.telefono ?? '',
      correo: tutor?.correo ?? '',
      domicilio: tutor?.direccion ?? '',
      observaciones: '',
    },
    documentos: rutaExpediente
      ? [{ tipo: 'Expediente académico', nombreArchivo: nombreArchivo(rutaExpediente) }]
      : [],
  }
}

async function procesarRespuesta(response: Response): Promise<Alumno> {
  if (!response.ok) {
    let detalle = `Error HTTP ${response.status}`
    try {
      const body = (await response.json()) as { message?: string }
      detalle = body.message ?? detalle
    } catch {
      // La API puede responder sin JSON en errores inesperados.
    }
    throw new Error(detalle)
  }

  const data = (await response.json()) as ApiAlumno
  return mapearAlumno(data)
}

export async function obtenerAlumnoPorId(id: number): Promise<Alumno> {
  const response = await fetch(`${API_URL}/alumnos/${id}`)
  return procesarRespuesta(response)
}

export async function actualizarAlumno(
  id: number,
  cambios: AlumnoEditable,
): Promise<Alumno> {
  const response = await fetch(`${API_URL}/alumnos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: cambios.nombres,
      apellidoPaterno: cambios.apellidoPaterno,
      apellidoMaterno: cambios.apellidoMaterno,
      fechaNacimiento: cambios.fechaNacimiento || undefined,
      genero: cambios.genero,
      nacionalidad: cambios.nacionalidad,
      telefono: cambios.telefono || undefined,
      correo: cambios.correo || undefined,
      direccion: cambios.direccion,
      turno: cambios.turno || undefined,
      fechaIngreso: cambios.fechaIngreso || undefined,
      observaciones: cambios.observaciones,
    }),
  })

  return procesarRespuesta(response)
}

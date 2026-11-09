import type { AlumnoConsulta } from '../types/AlumnoConsulta'

const API = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'

type AlumnoApi = {
  id: number
  curp: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string | null
  grado: string | null
  grupo: string | null
  cicloEscolar: string | null
  turno: string | null
  estado: string
}

type DetalleApi = {
  fechaNacimiento: string | null
  genero: string | null
  nacionalidad: string | null
  telefono: string | null
  correo: string | null
  direccion: string | null
  datosEscolares: {
    fechaIngreso: string | null
    observaciones: string | null
  } | null
  tutorPrincipal: {
    id: number
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string | null
    parentesco: string | null
    telefono: string | null
    correo: string | null
    direccion: string | null
  } | null
}

async function solicitar<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${API}${ruta}`)

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`)
  }

  return respuesta.json() as Promise<T>
}

export async function consultarAlumnos(): Promise<AlumnoConsulta[]> {
  const alumnos = await solicitar<AlumnoApi[]>('/alumnos?escuelaId=1')

  return alumnos.map((alumno) => ({
    id: alumno.id,
    nombre: alumno.nombre,
    apellidoPaterno: alumno.apellidoPaterno,
    apellidoMaterno: alumno.apellidoMaterno ?? '',
    curp: alumno.curp,
    fechaNacimiento: '',
    genero: 'Prefiero no decirlo',
    nacionalidad: '',
    telefono: '',
    correo: '',
    direccion: '',
    grado: alumno.grado ?? '',
    grupo: alumno.grupo ?? '',
    cicloEscolar: alumno.cicloEscolar ?? '',
    turno: alumno.turno ?? '',
    estado: alumno.estado === 'Activo' ? 'Activo' : 'Sin asignación',
    fechaIngreso: '',
    observaciones: '',
    tutores: [],
  }))
}

export async function consultarFichaAlumno(
  alumno: AlumnoConsulta,
): Promise<AlumnoConsulta> {
  const detalle = await solicitar<DetalleApi>(`/alumnos/${alumno.id}`)

  const tutor = detalle.tutorPrincipal

  return {
    ...alumno,
    fechaNacimiento: detalle.fechaNacimiento?.slice(0, 10) ?? '',
    genero:
      detalle.genero === 'Femenino' ||
      detalle.genero === 'Masculino' ||
      detalle.genero === 'Otro' ||
      detalle.genero === 'Prefiero no decirlo'
        ? detalle.genero
        : 'Prefiero no decirlo',
    nacionalidad: detalle.nacionalidad ?? '',
    telefono: detalle.telefono ?? '',
    correo: detalle.correo ?? '',
    direccion: detalle.direccion ?? '',
    fechaIngreso: detalle.datosEscolares?.fechaIngreso?.slice(0, 10) ?? '',
    observaciones: detalle.datosEscolares?.observaciones ?? '',
    tutores: tutor
      ? [{
          id: tutor.id,
          nombre: tutor.nombre,
          apellidoPaterno: tutor.apellidoPaterno,
          apellidoMaterno: tutor.apellidoMaterno ?? '',
          parentesco: tutor.parentesco ?? '',
          telefono: tutor.telefono ?? '',
          correo: tutor.correo ?? '',
          direccion: tutor.direccion ?? '',
          esPrincipal: true,
        }]
      : [],
  }
}


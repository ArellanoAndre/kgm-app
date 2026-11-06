import type { EstadoAlumno } from './Alumno'

export type GeneroAlumno =
  | 'Femenino'
  | 'Masculino'
  | 'Otro'
  | 'Prefiero no decirlo'

export type Tutor = {
  id: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  parentesco: string
  telefono: string
  correo: string
  direccion: string
  esPrincipal: boolean
}

export type AlumnoConsulta = {
  id: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaNacimiento: string
  genero: GeneroAlumno
  nacionalidad: string
  telefono: string
  correo: string
  direccion: string
  foto?: string
  grado: string
  grupo: string
  cicloEscolar: string
  estado: EstadoAlumno | 'Sin asignación'
  turno: string
  fechaIngreso: string
  observaciones: string
  tutores: Tutor[]
}

export type DatosRegistroAlumno = Omit<AlumnoConsulta, 'id'>

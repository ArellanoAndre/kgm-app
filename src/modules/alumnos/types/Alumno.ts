export type EstadoAlumno = 'Activo' | 'Baja' | 'Egresado'

export type GeneroAlumno = 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decirlo'

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

export type Alumno = {
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
  estado: EstadoAlumno
  turno: string
  fechaIngreso: string
  observaciones: string
  tutores: Tutor[]
}

export type DatosRegistroAlumno = Omit<Alumno, 'id'>

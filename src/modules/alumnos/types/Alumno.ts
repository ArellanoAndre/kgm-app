export type EstadoAlumno = 'Activo' | 'Baja' | 'Egresado'

export interface TutorAlumno {
  nombre: string
  parentesco: string
  telefono: string
  correo: string
  domicilio: string
  observaciones: string
}

export interface DocumentoAlumno {
  tipo: string
  nombreArchivo: string
}

export interface Alumno {
  id: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaNacimiento: string
  genero: string
  nacionalidad: string
  telefono: string
  correo: string
  direccion: string
  grado: string
  grupo: string
  cicloEscolar: string
  estado: EstadoAlumno
  turno: string
  fechaIngreso: string
  observaciones: string
  tutor: TutorAlumno
  documentos: DocumentoAlumno[]
}

export type AlumnoEditable = Pick<
  Alumno,
  | 'nombres'
  | 'apellidoPaterno'
  | 'apellidoMaterno'
  | 'fechaNacimiento'
  | 'genero'
  | 'nacionalidad'
  | 'telefono'
  | 'correo'
  | 'direccion'
  | 'turno'
  | 'fechaIngreso'
  | 'observaciones'
>

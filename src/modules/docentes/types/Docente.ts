export type EstadoDocente = 'Activo' | 'Inactivo'

export type Docente = {
  id: number
  nombre: string
  curp: string
  correo: string
  estado: EstadoDocente
  asignacion: string | null
  ciclo: string
  fechaNacimiento?: string
  telefono?: string
  direccion?: string
  foto?: string
}

export type DatosRegistroDocente = {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaNacimiento: string
  estado: EstadoDocente
  telefono: string
  correo: string
  direccion: string
  foto?: string
}
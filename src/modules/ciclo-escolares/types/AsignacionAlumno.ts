export type EstadoAsignacion = 'Activo' | 'Inactivo'

export type AsignacionAlumno = {
  cicloEscolar: string
  grado: string
  grupo: string
  estado: EstadoAsignacion
  observaciones: string
}

export type AlumnoAsignable = {
  id: number
  nombre: string
  curp: string
  estado: EstadoAsignacion
  asignaciones: AsignacionAlumno[]
}

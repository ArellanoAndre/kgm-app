export type EstadoAsignacion = 'Activo' | 'Inactivo'

export type AsignacionAlumno = {
  cicloId: number
  cicloEscolar: string
  gradoId: number
  grado: string
  grupoId: number
  grupo: string
  estado: EstadoAsignacion
  observaciones: string
}

export type AlumnoAsignable = {
  id: number
  nombre: string
  curp: string
  estado: EstadoAsignacion | 'Sin asignación'
  asignaciones: AsignacionAlumno[]
}

export type OpcionesAsignacion = {
  ciclos: { id: number; nombre: string }[]
  grados: { id: number; nombre: string }[]
  grupos: { id: number; gradoId: number; nombre: string }[]
}

export type NuevaAsignacionAlumno = {
  cicloId: number
  gradoId: number
  grupoId: number
  observaciones?: string
}

export type EstadoDocente = 'Activo' | 'Inactivo'

export type Docente = {
  id: number
  nombre: string
  curp: string
  correo: string
  estado: EstadoDocente
  asignacion: string | null
  ciclo: string
}
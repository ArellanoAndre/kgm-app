export interface Tutor {
  id: number
  escuelaId: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string | null
  curp: string
  telefono: string
  email: string
  parentesco: string | null
  direccion: string | null
}

export interface CrearTutor {
  escuelaId: number
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  curp: string
  telefono: string
  email: string
  parentesco?: string
  direccion?: string
}

export type GradoMateria = {
  id: number
  nombre: string
}

export type Materia = {
  id: number
  escuelaId: number
  gradoId: number
  grado: string
  clave: string
  nombre: string
  createdAt: string | null
}

export type DatosMateria = {
  nombre: string
  clave: string
  gradoId: number
}

export type OpcionesMateria = {
  grados: GradoMateria[]
}

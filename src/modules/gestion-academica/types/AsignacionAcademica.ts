export type DocenteAsignable = {
  id: number
  nombreCompleto: string
  curp: string
  foto: string | null
}

export type AsignacionAcademica = {
  id: number
  escuelaId: number
  cicloId: number
  cicloEscolar: string
  grupoId: number
  grupo: string
  gradoId: number
  grado: string
  materiaId: number
  materia: string
  claveMateria: string
  docenteId: number
  docente: string
  docenteCurp: string
  docenteFoto: string | null
  activo: boolean
  createdAt: string | null
}

export type OpcionesAsignacionAcademica = {
  ciclos: { id: number; nombre: string }[]
  grados: { id: number; nombre: string }[]
  grupos: { id: number; gradoId: number; nombre: string }[]
  materias: { id: number; gradoId: number; clave: string; nombre: string }[]
  docentes: DocenteAsignable[]
}

export type DatosAsignacionAcademica = {
  cicloId: number
  grupoId: number
  materiaId: number
  docenteId: number
}

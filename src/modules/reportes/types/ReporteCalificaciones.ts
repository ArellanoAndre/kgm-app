export interface OpcionCiclo {
  id: number
  nombre: string | null
  fechaInicio: string
  fechaFin: string
}

export interface OpcionGrado {
  id: number
  nombre: string
}

export interface OpcionGrupo {
  id: number
  nombre: string
  gradoId: number
}

export interface OpcionMateria {
  id: number
  nombre: string
  gradoId: number
}

export interface OpcionesReporteCalificaciones {
  ciclos: OpcionCiclo[]
  grados: OpcionGrado[]
  grupos: OpcionGrupo[]
  materias: OpcionMateria[]
  periodos: string[]
}

export interface FiltrosReporteCalificaciones {
  cicloId: number
  gradoId: number
  grupoId: number
  materiaId?: number
  periodo: string
}

export interface CalificacionMateria {
  materiaId: number
  materia: string
  valor: number | null
}

export type EstadoAcademico = 'APROBADO' | 'EN_RIESGO' | 'SIN_CALIFICAR'

export interface AlumnoReporteCalificaciones {
  id: number
  matricula: string
  nombre: string
  calificaciones: CalificacionMateria[]
  promedio: number | null
  estado: EstadoAcademico
}

export interface ReporteCalificaciones {
  filtros: {
    cicloId: number
    cicloEscolar: string | null
    gradoId: number
    grado: string
    grupoId: number
    grupo: string
    materiaId: number | null
    periodo: string
  }
  materias: Array<{ id: number; nombre: string }>
  resumen: {
    promedioGeneral: number | null
    totalAlumnos: number
    totalMaterias: number
    aprobados: number
    enRiesgo: number
    sinCalificar: number
  }
  alumnos: AlumnoReporteCalificaciones[]
}

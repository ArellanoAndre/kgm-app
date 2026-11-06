import type { AlumnoAsignable, AsignacionAlumno } from '../types/AsignacionAlumno'

let alumnos: AlumnoAsignable[] = [
  {
    id: 1,
    nombre: 'Ana García López',
    curp: 'GALA160101MDFRPN07',
    estado: 'Activo',
    asignaciones: [
      {
        cicloEscolar: '2026–2027',
        grado: '5°',
        grupo: 'A',
        estado: 'Activo',
        observaciones: 'Asignación actual del alumno',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Mateo Hernández Ruiz',
    curp: 'HERM150712HDFRZT04',
    estado: 'Activo',
    asignaciones: [],
  },
  {
    id: 3,
    nombre: 'Valeria Torres Díaz',
    curp: 'TODV160923MDFRZL08',
    estado: 'Activo',
    asignaciones: [
      {
        cicloEscolar: '2026–2027',
        grado: '4°',
        grupo: 'B',
        estado: 'Activo',
        observaciones: 'Asignación actual del alumno',
      },
    ],
  },
]

export function obtenerAlumnosAsignables(): AlumnoAsignable[] {
  return structuredClone(alumnos)
}

export function guardarAsignacionAlumno(
  alumnoId: number,
  asignacion: AsignacionAlumno,
): AlumnoAsignable {
  const indice = alumnos.findIndex((alumno) => alumno.id === alumnoId)
  if (indice < 0) {
    throw new Error('No se encontró el alumno seleccionado.')
  }

  const alumno = alumnos[indice]
  if (
    alumno.asignaciones.some(
      (actual) =>
        actual.cicloEscolar === asignacion.cicloEscolar &&
        actual.grado === asignacion.grado &&
        actual.grupo === asignacion.grupo &&
        actual.estado === 'Activo',
    )
  ) {
    throw new Error('El alumno ya está asignado a este grupo en ese ciclo escolar.')
  }

  alumnos = alumnos.map((actual) =>
    actual.id === alumnoId
      ? { ...actual, asignaciones: [...actual.asignaciones, asignacion] }
      : actual,
  )

  return structuredClone(alumnos[indice])
}

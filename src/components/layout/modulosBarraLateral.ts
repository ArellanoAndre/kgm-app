export const MODULOS_BARRA_LATERAL = [
  { id: 'alumnos', nombre: 'Alumnos', icono: 'usuarios' },
  { id: 'gestion-academica', nombre: 'Gestión académica', icono: 'calendario' },
  { id: 'docentes', nombre: 'Docentes', icono: 'usuario' },
  { id: 'reportes', nombre: 'Reportes', icono: 'grafica' },
  { id: 'usuarios', nombre: 'Usuarios', icono: 'usuarios' },
] as const

export type ModuloId = (typeof MODULOS_BARRA_LATERAL)[number]['id']

export const OPCIONES_GESTION_ACADEMICA = [
  { id: 'ciclos-escolares', nombre: 'Ciclos escolares' },
  { id: 'grados-grupos', nombre: 'Grados y grupos' },
  { id: 'materias', nombre: 'Materias' },
  { id: 'asignar-alumno-grupo', nombre: 'Asignar alumno a grupo' },
  {
    id: 'asignar-docente-grupo-materia',
    nombre: 'Asignar docente a grupo y materia',
  },
] as const

export type OpcionGestionAcademicaId =
  (typeof OPCIONES_GESTION_ACADEMICA)[number]['id']
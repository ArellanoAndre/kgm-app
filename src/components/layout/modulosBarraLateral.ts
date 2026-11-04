export const MODULOS_BARRA_LATERAL = [
  { id: 'alumnos', nombre: 'Alumnos', icono: 'usuarios' },
  { id: 'gestion-academica', nombre: 'Gestión académica', icono: 'calendario' },
  { id: 'docentes', nombre: 'Docentes', icono: 'usuario' },
  { id: 'reportes', nombre: 'Reportes', icono: 'grafica' },
] as const

export type ModuloId = (typeof MODULOS_BARRA_LATERAL)[number]['id']
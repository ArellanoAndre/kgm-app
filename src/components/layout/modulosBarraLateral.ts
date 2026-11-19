export const MODULOS_BARRA_LATERAL = [
  { id: 'alumnos', nombre: 'Alumnos', icono: 'usuarios' },
  { id: 'gestion-academica', nombre: 'Gestión académica', icono: 'calendario' },
  { id: 'docentes', nombre: 'Docentes', icono: 'usuario' },
  { id: 'reportes', nombre: 'Reportes', icono: 'grafica' },
  { id: 'usuarios', nombre: 'Usuarios', icono: 'usuarios' },
] as const

export type ModuloId = (typeof MODULOS_BARRA_LATERAL)[number]['id']

export const OPCIONES_ALUMNOS = [
  { id: 'consultar-alumnos', nombre: 'Consultar alumnos' },
  { id: 'registrar-alumno', nombre: 'Registrar alumno' },
  { id: 'editar-alumno', nombre: 'Editar alumno' },
  { id: 'registrar-tutor', nombre: 'Registrar tutor' },
  { id: 'expediente-digital', nombre: 'Expediente digital' },
] as const

export type OpcionAlumnosId = (typeof OPCIONES_ALUMNOS)[number]['id']

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

export const OPCIONES_USUARIOS = [
  { id: 'control-acceso', nombre: 'Control de acceso' },
  { id: 'crear-usuario', nombre: 'Creación de usuarios' },
  { id: 'gestion-roles', nombre: 'Asignación y gestión de roles' },
] as const

export type OpcionUsuariosId = (typeof OPCIONES_USUARIOS)[number]['id']

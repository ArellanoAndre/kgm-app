export type EstadoCiclo = 'Activo' | 'Cerrado' | 'Programado';

export interface CicloEscolar {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCiclo;
}
export type EstadoCiclo = 'Activo' | 'Cerrado' | 'Programado';

export interface CicloEscolar {
  id: number;
  escuelaId: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCiclo;
}

export interface CrearCicloPayload {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}
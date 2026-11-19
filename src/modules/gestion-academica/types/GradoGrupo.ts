export interface Grado {
  id: number;
  nombre: string;
  _count?: {
    grupo: number;
  };
}

export interface GrupoItem {
  id: number;
  nombre: string;
  turno: string;
  capacidad: number;
  grado: string;
  alumnosAsignados: number;
  docenteAsignado: string;
}

export interface CrearGradoPayload {
  nombre: string;
}

export interface CrearGrupoPayload {
  gradoId: number;
  nombre: string;
  turno?: string;
  capacidad?: number;
}
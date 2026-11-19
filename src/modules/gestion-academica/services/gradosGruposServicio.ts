import { clienteApi, ESCUELA_ID } from '../../../services/api';
import type {
  CrearGradoPayload,
  CrearGrupoPayload,
  Grado,
  GrupoItem,
} from '../types/GradoGrupo';

export const gradosGruposServicio = {
  listarGrados: (escuelaId: number = ESCUELA_ID) => {
    return clienteApi<Grado[]>(`/escuelas/${escuelaId}/grados-grupos/grados`);
  },

  crearGrado: (payload: CrearGradoPayload, escuelaId: number = ESCUELA_ID) => {
    return clienteApi<Grado>(`/escuelas/${escuelaId}/grados-grupos/grados`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  actualizarGrado: (
    gradoId: number,
    payload: CrearGradoPayload,
    escuelaId: number = ESCUELA_ID,
  ) => {
    return clienteApi<Grado>(`/escuelas/${escuelaId}/grados-grupos/grados/${gradoId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  listarGruposPorGrado: (
    gradoId: number,
    cicloId?: number,
    escuelaId: number = ESCUELA_ID,
  ) => {
    const query = cicloId ? `&cicloId=${cicloId}` : '';
    return clienteApi<GrupoItem[]>(
      `/escuelas/${escuelaId}/grados-grupos/grupos?gradoId=${gradoId}${query}`,
    );
  },

  crearGrupo: (payload: CrearGrupoPayload, escuelaId: number = ESCUELA_ID) => {
    return clienteApi<GrupoItem>(`/escuelas/${escuelaId}/grados-grupos/grupos`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  actualizarGrupo: (
    grupoId: number,
    payload: Partial<CrearGrupoPayload>,
    escuelaId: number = ESCUELA_ID,
  ) => {
    return clienteApi<GrupoItem>(`/escuelas/${escuelaId}/grados-grupos/grupos/${grupoId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
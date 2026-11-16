import { clienteApi, ESCUELA_ID } from '../../../services/api'
import type {
  CicloEscolar,
  CrearCicloPayload,
  EstadoCiclo,
} from '../types/CicloEscolar'

export interface RespuestaPaginada<T> {
  datos: T[]
  meta: {
    total: number
    pagina: number
    limite: number
    totalPaginas: number
    tienePaginaSiguiente: boolean
    tienePaginaAnterior: boolean
  }
}

export const ciclosEscolaresServicio = {
  /**
   * Obtiene la lista de ciclos escolares con soporte para paginación y filtro por estado.
   */
  listarPaginado: (
    pagina: number = 1,
    limite: number = 10,
    estado?: string,
    escuelaId: number = ESCUELA_ID,
  ) => {
    const queryEstado = estado && estado !== 'Todos' ? `&estado=${estado}` : ''
    return clienteApi<RespuestaPaginada<CicloEscolar>>(
      `/escuelas/${escuelaId}/ciclos-escolares?pagina=${pagina}&limite=${limite}${queryEstado}`,
    )
  },

  /**
   * Registra un nuevo ciclo escolar (nace en estado Programado).
   */
  crear: (payload: CrearCicloPayload, escuelaId: number = ESCUELA_ID) => {
    return clienteApi<CicloEscolar>(`/escuelas/${escuelaId}/ciclos-escolares`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Actualiza el estado de un ciclo escolar ('Activo', 'Cerrado', 'Programado').
   */
  cambiarEstado: (
    cicloId: number,
    estado: EstadoCiclo,
    escuelaId: number = ESCUELA_ID,
  ) => {
    return clienteApi<CicloEscolar>(
      `/escuelas/${escuelaId}/ciclos-escolares/${cicloId}/estado`,
      {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      },
    )
  },
}
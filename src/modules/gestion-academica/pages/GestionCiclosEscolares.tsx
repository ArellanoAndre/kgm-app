import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react'
import '../styles/gestionCicloEscolar.css'
import type { CicloEscolar, CrearCicloPayload } from '../types/CicloEscolar'
import { ciclosEscolaresServicio } from '../services/ciclosEscolaresServicio'

import { CiclosTabla } from '../components/CiclosTabla'
import { CiclosFiltros } from '../components/CiclosFiltros'
import { FormularioNuevoCiclo } from '../components/FormularioNuevoCiclo'

export const GestionCiclosEscolares: React.FC = () => {
  const [ciclos, setCiclos] = useState<CicloEscolar[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de control para Paginación y Filtros
  const [pagina, setPagina] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    totalPaginas: 1,
    tienePaginaSiguiente: false,
    tienePaginaAnterior: false,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Cargar lista paginada desde la API
  const cargarCiclos = async () => {
    try {
      setCargando(true)
      setError(null)
      const respuesta = await ciclosEscolaresServicio.listarPaginado(
        pagina,
        10,
        estadoFilter,
      )
      // 🛡️ Aseguramos que si respuesta.datos viene indefinido, guardemos un arreglo vacío []
      setCiclos(respuesta?.datos ?? [])
      if (respuesta?.meta) {
        setMeta({
          total: respuesta.meta.total,
          totalPaginas: respuesta.meta.totalPaginas,
          tienePaginaSiguiente: respuesta.meta.tienePaginaSiguiente,
          tienePaginaAnterior: respuesta.meta.tienePaginaAnterior,
        })
      }
    } catch (err: unknown) {
      setCiclos([]) // Fallback defensivo
      setError(
        err instanceof Error
          ? err.message
          : 'Error al consultar los ciclos escolares desde el servidor.',
      )
    } finally {
      setCargando(false)
    }
  }

  // 2. En la memoización, agregamos el guardián anti-undefined:
  const ciclosFiltrados = useMemo(() => {
    if (!Array.isArray(ciclos)) return []
    return ciclos.filter((ciclo) =>
      ciclo.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [ciclos, searchTerm])

  // Recargar al cambiar página o filtro de estado
  useEffect(() => {
    cargarCiclos()
  }, [pagina, estadoFilter])

  // Cambiar filtro de estado reiniciando a la página 1
  const handleEstadoFilterChange = (nuevoEstado: string) => {
    setEstadoFilter(nuevoEstado)
    setPagina(1)
  }

  // Registrar nuevo ciclo vía POST
  const handleCrearCiclo = async (nuevoCicloData: CrearCicloPayload) => {
    try {
      setError(null)
      await ciclosEscolaresServicio.crear({
        nombre: nuevoCicloData.nombre,
        fechaInicio: nuevoCicloData.fechaInicio,
        fechaFin: nuevoCicloData.fechaFin,
      })
      setMostrarFormulario(false)
      setPagina(1)
      await cargarCiclos()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al intentar registrar el nuevo ciclo escolar.',
      )
    }
  }

  // Activar ciclo vía PATCH
  const handleActivarCiclo = async (cicloId: number) => {
    try {
      setError(null)
      await ciclosEscolaresServicio.cambiarEstado(cicloId, 'Activo')
      await cargarCiclos()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar el estado del ciclo escolar.',
      )
    }
  }

  return (
    <div className="academico-container">
      {/* Mensaje de Error */}
      {error && (
        <div
          className="materias-mensaje materias-mensaje--error"
          role="alert"
          style={{ marginBottom: '16px' }}
        >
          <strong>Error en el servicio: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="academico-header">
        <div>
          <h1 className="academico-title">Ciclos escolares</h1>
          <p className="academico-subtitle">
            Consulta y administración de ciclos escolares
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setMostrarFormulario(true)}
          type="button"
        >
          <Plus size={16} />
          Nuevo ciclo
        </button>
      </div>

      {/* Tabla con Filtros y Paginación */}
      <div className="card-table">
        <CiclosFiltros
          estadoFilter={estadoFilter}
          onEstadoFilterChange={handleEstadoFilterChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />

        {cargando ? (
          <div className="materias-estado" style={{ padding: '40px 0' }}>
            <p>Cargando ciclos escolares...</p>
          </div>
        ) : (
          <>
            <CiclosTabla
              ciclos={ciclosFiltrados}
              onActivarCiclo={handleActivarCiclo}
            />

            {/* Pie de Tabla: Paginación Elegante */}
            <div className="paginacion-contenedor">
              <div className="paginacion-info">
                <span>
                  Página <strong>{pagina}</strong> de <strong>{meta.totalPaginas}</strong>
                </span>
                <span className="paginacion-badge">
                  {meta.total} {meta.total === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              <div className="paginacion-acciones">
                <button
                  className="btn-secundario btn-paginacion"
                  disabled={!meta.tienePaginaAnterior || cargando}
                  onClick={() => setPagina((p) => Math.max(p - 1, 1))}
                  type="button"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <button
                  className="btn-secundario btn-paginacion"
                  disabled={!meta.tienePaginaSiguiente || cargando}
                  onClick={() => setPagina((p) => p + 1)}
                  type="button"
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Formulario Modal / Card */}
      {mostrarFormulario && (
        <FormularioNuevoCiclo
          alCancelar={() => setMostrarFormulario(false)}
          onCrearCiclo={handleCrearCiclo}
        />
      )}
    </div>
  )
}
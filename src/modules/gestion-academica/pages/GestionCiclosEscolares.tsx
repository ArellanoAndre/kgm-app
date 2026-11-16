import React, { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import '../styles/gestionCicloEscolar.css'
import type { CicloEscolar, CrearCicloPayload } from '../types/CicloEscolar'
import { ciclosEscolaresServicio } from '../services/ciclosEscolaresServicio'

import { CiclosTabla } from '../components/CiclosTabla'
import { CiclosFiltros } from '../components/CiclosFiltros'
import { FormularioNuevoCiclo } from '../components/FormularioNuevoCiclo'
import { ModalConfirmacionCrear } from '../components/ModalConfirmacionCrear'
import { ModalConfirmacionActivar } from '../components/ModalConfirmacionActivar'

export const GestionCiclosEscolares: React.FC = () => {
  const [ciclos, setCiclos] = useState<CicloEscolar[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesandoAccion, setProcesandoAccion] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Paginación y Filtros
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

  // Estados para Modales de Confirmación
  const [datosCrearTemp, setDatosCrearTemp] = useState<CrearCicloPayload | null>(null)
  const [cicloAActivarTemp, setCicloAActivarTemp] = useState<CicloEscolar | null>(null)

  const cargarCiclos = async () => {
    try {
      setCargando(true)
      setError(null)
      const respuesta = await ciclosEscolaresServicio.listarPaginado(pagina, 10, estadoFilter)
      setCiclos(respuesta.datos)
      setMeta({
        total: respuesta.meta.total,
        totalPaginas: respuesta.meta.totalPaginas,
        tienePaginaSiguiente: respuesta.meta.tienePaginaSiguiente,
        tienePaginaAnterior: respuesta.meta.tienePaginaAnterior,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al consultar los ciclos escolares desde el servidor.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarCiclos()
  }, [pagina, estadoFilter])

  const ciclosFiltrados = useMemo(() => {
    return ciclos.filter((ciclo) => ciclo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [ciclos, searchTerm])

  const handleEstadoFilterChange = (nuevoEstado: string) => {
    setEstadoFilter(nuevoEstado)
    setPagina(1)
  }

  // 1. Paso 1 al Crear: Interceptar y solicitar confirmación
  const SolicitarConfirmacionCrear = (nuevoCicloData: CrearCicloPayload) => {
    setDatosCrearTemp(nuevoCicloData)
  }

  // 2. Paso 2 al Crear: Ejecutar POST tras confirmar
  const ejecutarCreacionCiclo = async () => {
    if (!datosCrearTemp) return
    try {
      setProcesandoAccion(true)
      setError(null)
      await ciclosEscolaresServicio.crear({
        nombre: datosCrearTemp.nombre,
        fechaInicio: datosCrearTemp.fechaInicio,
        fechaFin: datosCrearTemp.fechaFin,
      })
      setDatosCrearTemp(null)
      setMostrarFormulario(false)
      setPagina(1)
      await cargarCiclos()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al intentar registrar el nuevo ciclo escolar.')
    } finally {
      setProcesandoAccion(false)
    }
  }

  // 1. Paso 1 al Activar: Interceptar desde la tabla y abrir modal
  const SolicitarConfirmacionActivar = (cicloId: number) => {
    const cicloEncontrado = ciclos.find((c) => c.id === cicloId)
    if (cicloEncontrado) {
      setCicloAActivarTemp(cicloEncontrado)
    }
  }

  // 2. Paso 2 al Activar: Ejecutar PATCH tras confirmar
  const ejecutarActivacionCiclo = async () => {
    if (!cicloAActivarTemp) return
    try {
      setProcesandoAccion(true)
      setError(null)
      await ciclosEscolaresServicio.cambiarEstado(cicloAActivarTemp.id, 'Activo')
      setCicloAActivarTemp(null)
      await cargarCiclos()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado del ciclo escolar.')
    } finally {
      setProcesandoAccion(false)
    }
  }

  return (
    <div className="academico-container">
      {error && (
        <div className="materias-mensaje materias-mensaje--error" role="alert" style={{ marginBottom: '16px' }}>
          <strong>Error en el servicio: </strong>
          <span>{error}</span>
        </div>
      )}

      <div className="academico-header">
        <div>
          <h1 className="academico-title">Ciclos escolares</h1>
          <p className="academico-subtitle">Consulta y administración de ciclos escolares</p>
        </div>
        <button className="btn-primary" onClick={() => setMostrarFormulario(true)} type="button">
          <Plus size={16} />
          Nuevo ciclo
        </button>
      </div>

      <div className="card-table">
        <CiclosFiltros
          estadoFilter={estadoFilter}
          onEstadoFilterChange={handleEstadoFilterChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />

        {cargando ? (
          <p style={{ padding: '24px', textAlign: 'center' }}>Cargando ciclos escolares...</p>
        ) : (
          <>
            <CiclosTabla ciclos={ciclosFiltrados} onActivarCiclo={SolicitarConfirmacionActivar} />

            {/* Pie de Tabla con Paginación */}
            <div className="paginacion-contenedor">
              <div className="paginacion-info">
                <span>Página <strong>{pagina}</strong> de <strong>{meta.totalPaginas}</strong></span>
                <span className="paginacion-badge">{meta.total} registros</span>
              </div>
              <div className="paginacion-acciones">
                <button
                  className="btn-secundario btn-paginacion"
                  disabled={!meta.tienePaginaAnterior || cargando}
                  onClick={() => setPagina((p) => Math.max(p - 1, 1))}
                  type="button"
                >
                  Anterior
                </button>
                <button
                  className="btn-secundario btn-paginacion"
                  disabled={!meta.tienePaginaSiguiente || cargando}
                  onClick={() => setPagina((p) => p + 1)}
                  type="button"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarFormulario && (
        <FormularioNuevoCiclo
          alCancelar={() => setMostrarFormulario(false)}
          onCrearCiclo={SolicitarConfirmacionCrear}
        />
      )}

      {/* Modales de Confirmación */}
      <ModalConfirmacionCrear
        abierto={!!datosCrearTemp}
        nombre={datosCrearTemp?.nombre || ''}
        fechaInicio={datosCrearTemp?.fechaInicio || ''}
        fechaFin={datosCrearTemp?.fechaFin || ''}
        onCancelar={() => setDatosCrearTemp(null)}
        onConfirmar={ejecutarCreacionCiclo}
        cargando={procesandoAccion}
      />

      <ModalConfirmacionActivar
        abierto={!!cicloAActivarTemp}
        ciclo={cicloAActivarTemp}
        onCancelar={() => setCicloAActivarTemp(null)}
        onConfirmar={ejecutarActivacionCiclo}
        cargando={procesandoAccion}
      />
    </div>
  )
}
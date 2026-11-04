import { useMemo, useState } from 'react'
import FiltrosDocentes from '../components/FiltrosDocentes'
import TablaDocentes from '../components/TablaDocentes'
import { DOCENTES_DE_PRUEBA } from '../services/docenteServicioMock'
import type { Docente, EstadoDocente } from '../types/Docente'
import '../styles/docentes.css'

type PropiedadesConsultarDocentes = {
  busquedaGlobal: string
}

type FiltrosAplicados = {
  nombre: string
  estado: EstadoDocente | 'Todos'
}

function ConsultarDocentes({ busquedaGlobal }: PropiedadesConsultarDocentes) {
  const [docentes, setDocentes] = useState(DOCENTES_DE_PRUEBA)
  const [nombreFiltro, setNombreFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoDocente | 'Todos'>('Todos')
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosAplicados>({
    nombre: '',
    estado: 'Todos',
  })
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<Docente | null>(null)
  const [mensaje, setMensaje] = useState('')

  const docentesFiltrados = useMemo(() => {
    const nombre = filtrosAplicados.nombre.trim().toLocaleLowerCase()
    const busqueda = busquedaGlobal.trim().toLocaleLowerCase()

    return docentes.filter((docente) => {
      const coincideNombre = docente.nombre.toLocaleLowerCase().includes(nombre)
      const coincideEstado =
        filtrosAplicados.estado === 'Todos' ||
        docente.estado === filtrosAplicados.estado
      const coincideBusqueda =
        !busqueda ||
        [docente.nombre, docente.curp, docente.correo]
          .some((dato) => dato.toLocaleLowerCase().includes(busqueda))

      return coincideNombre && coincideEstado && coincideBusqueda
    })
  }, [busquedaGlobal, docentes, filtrosAplicados])

  function aplicarFiltros() {
    setFiltrosAplicados({ nombre: nombreFiltro, estado: estadoFiltro })
  }

  function cambiarEstado(docente: Docente) {
    const nuevoEstado: EstadoDocente =
      docente.estado === 'Activo' ? 'Inactivo' : 'Activo'

    setDocentes((docentesActuales) =>
      docentesActuales.map((actual) =>
        actual.id === docente.id ? { ...actual, estado: nuevoEstado } : actual,
      ),
    )
    setMensaje(`${docente.nombre} ahora está ${nuevoEstado.toLowerCase()}.`)
  }

  function avisarAccionPendiente(accion: string) {
    setMensaje(accion)
  }

  return (
    <section aria-labelledby="titulo-docentes" className="pagina-docentes">
      <header className="pagina-docentes__encabezado">
        <div>
          <h1 id="titulo-docentes">Docentes</h1>
          <p>Consulta y administración de docentes registrados</p>
        </div>
        <button
          className="pagina-docentes__nuevo"
          onClick={() => avisarAccionPendiente('Próximamente...')}
          type="button"
        >
          <span aria-hidden="true">+</span> Nuevo docente
        </button>
      </header>

      <FiltrosDocentes
        alBuscar={aplicarFiltros}
        alCambiarEstado={setEstadoFiltro}
        alCambiarNombre={setNombreFiltro}
        estado={estadoFiltro}
        nombre={nombreFiltro}
      />

      <section aria-label="Listado de docentes" className="panel-docentes">
        <TablaDocentes
          alCambiarEstado={cambiarEstado}
          alEditar={(docente) =>
            avisarAccionPendiente(`La edición de ${docente.nombre} se implementará próximamente.`)
          }
          alVer={(docente) => setDocenteSeleccionado(docente)}
          docentes={docentesFiltrados}
        />
      </section>

      <aside className="aviso-docentes" role="note">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5m0-8h.01" />
        </svg>
        <span>
          Antes de registrar un docente, valida que CURP y correo electrónico no
          estén duplicados en el catálogo.
        </span>
      </aside>

      {mensaje && (
        <div aria-live="polite" className="mensaje-docentes" role="status">
          <span>{mensaje}</span>
          <button
            aria-label="Cerrar mensaje"
            onClick={() => setMensaje('')}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {docenteSeleccionado && (
        <div
          className="dialogo-docente__fondo"
          onClick={() => setDocenteSeleccionado(null)}
          role="presentation"
        >
          <section
            aria-labelledby="dialogo-docente-titulo"
            aria-modal="true"
            className="dialogo-docente"
            onClick={(evento) => evento.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Cerrar"
              className="dialogo-docente__cerrar"
              onClick={() => setDocenteSeleccionado(null)}
              type="button"
            >
              ×
            </button>
            <p className="pagina-docentes__subtitulo">Ficha del docente</p>
            <h2 id="dialogo-docente-titulo">{docenteSeleccionado.nombre}</h2>
            <dl>
              <div><dt>CURP</dt><dd>{docenteSeleccionado.curp}</dd></div>
              <div><dt>Correo electrónico</dt><dd>{docenteSeleccionado.correo}</dd></div>
              <div><dt>Estado</dt><dd>{docenteSeleccionado.estado}</dd></div>
              <div><dt>Asignación</dt><dd>{docenteSeleccionado.asignacion ?? 'Sin asignación'}</dd></div>
            </dl>
            <button
              className="pagina-docentes__nuevo"
              onClick={() => setDocenteSeleccionado(null)}
              type="button"
            >
              Cerrar
            </button>
          </section>
        </div>
      )}
    </section>
  )
}

export default ConsultarDocentes

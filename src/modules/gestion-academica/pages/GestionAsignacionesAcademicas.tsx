import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import '../styles/gestionCicloEscolar.css'
import '../styles/asignacionesAcademicas.css'
import type {
  AsignacionAcademica,
  DatosAsignacionAcademica,
  OpcionesAsignacionAcademica,
} from '../types/AsignacionAcademica'
import {
  actualizarAsignacionAcademica,
  crearAsignacionAcademica,
  obtenerAsignacionesAcademicas,
  obtenerOpcionesAsignacionesAcademicas,
} from '../services/asignacionesAcademicasServicio'
import { AsignacionesFiltros } from '../components/AsignacionesFiltros'
import { AsignacionesTabla } from '../components/AsignacionesTabla'
import { FormularioAsignacionAcademica } from '../components/FormularioAsignacionAcademica'
import { DetalleAsignacionAcademica } from '../components/DetalleAsignacionAcademica'

type TipoMensaje = 'exito' | 'error'

const OPCIONES_INICIALES: OpcionesAsignacionAcademica = {
  ciclos: [],
  grados: [],
  grupos: [],
  materias: [],
  docentes: [],
}

function ordenarAsignaciones(
  asignaciones: AsignacionAcademica[],
): AsignacionAcademica[] {
  return [...asignaciones].sort(
    (a, b) =>
      a.grado.localeCompare(b.grado, 'es') ||
      a.grupo.localeCompare(b.grupo, 'es') ||
      a.materia.localeCompare(b.materia, 'es') ||
      a.docente.localeCompare(b.docente, 'es'),
  )
}

function enfocarElemento(elemento: HTMLElement | null) {
  if (!elemento) return
  window.requestAnimationFrame(() => elemento.focus())
}

export function GestionAsignacionesAcademicas() {
  const [asignaciones, setAsignaciones] = useState<AsignacionAcademica[]>([])
  const [opciones, setOpciones] =
    useState<OpcionesAsignacionAcademica>(OPCIONES_INICIALES)
  const [busqueda, setBusqueda] = useState('')
  const [cicloFiltro, setCicloFiltro] = useState('Todos')
  const [gradoFiltro, setGradoFiltro] = useState('Todos')
  const [materiaFiltro, setMateriaFiltro] = useState('Todos')
  const [grupoFiltro, setGrupoFiltro] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<TipoMensaje>('exito')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [asignacionEnEdicion, setAsignacionEnEdicion] =
    useState<AsignacionAcademica | null>(null)
  const [asignacionEnDetalle, setAsignacionEnDetalle] =
    useState<AsignacionAcademica | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const dialogoRef = useRef<HTMLElement>(null)
  const focoPrevioRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelado = false

    Promise.all([
      obtenerAsignacionesAcademicas(),
      obtenerOpcionesAsignacionesAcademicas(),
    ])
      .then(([asignacionesApi, opcionesApi]) => {
        if (cancelado) return
        setAsignaciones(ordenarAsignaciones(asignacionesApi))
        setOpciones(opcionesApi)
        setErrorCarga('')
      })
      .catch((error: unknown) => {
        if (cancelado) return
        setErrorCarga(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las asignaciones académicas.',
        )
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const dialogoAbierto = formularioAbierto || asignacionEnDetalle !== null

  const cerrarDialogo = useCallback(() => {
    if (guardando) return

    setFormularioAbierto(false)
    setAsignacionEnEdicion(null)
    setAsignacionEnDetalle(null)
    setErrorFormulario('')

    const focoPrevio = focoPrevioRef.current
    focoPrevioRef.current = null
    enfocarElemento(focoPrevio)
  }, [guardando])

  useEffect(() => {
    if (!dialogoAbierto) return

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !guardando) {
        cerrarDialogo()
        return
      }

      if (evento.key !== 'Tab') return

      const dialogo = dialogoRef.current
      if (!dialogo) return

      const elementosEnfocables = dialogo.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )

      if (elementosEnfocables.length === 0) return

      const primero = elementosEnfocables[0]
      const ultimo = elementosEnfocables[elementosEnfocables.length - 1]

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', manejarTecla)
    return () => document.removeEventListener('keydown', manejarTecla)
  }, [dialogoAbierto, guardando, cerrarDialogo])

  useEffect(() => {
    if (!asignacionEnDetalle) return

    const botonCerrar =
      dialogoRef.current?.querySelector<HTMLElement>(
        '.asignaciones-dialogo__cerrar',
      )
    botonCerrar?.focus()
  }, [asignacionEnDetalle])

  const materiasFiltro = useMemo(() => {
    if (gradoFiltro === 'Todos') return opciones.materias
    return opciones.materias.filter(
      (materia) => materia.gradoId === Number(gradoFiltro),
    )
  }, [opciones.materias, gradoFiltro])

  const gruposFiltro = useMemo(() => {
    if (gradoFiltro === 'Todos') return opciones.grupos
    return opciones.grupos.filter(
      (grupo) => grupo.gradoId === Number(gradoFiltro),
    )
  }, [opciones.grupos, gradoFiltro])

  const asignacionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase()

    return asignaciones.filter((asignacion) => {
      const coincideDocente =
        !termino ||
        asignacion.docente.toLocaleLowerCase().includes(termino) ||
        asignacion.docenteCurp.toLocaleLowerCase().includes(termino)
      const coincideCiclo =
        cicloFiltro === 'Todos' ||
        asignacion.cicloId === Number(cicloFiltro)
      const coincideGrado =
        gradoFiltro === 'Todos' ||
        asignacion.gradoId === Number(gradoFiltro)
      const coincideMateria =
        materiaFiltro === 'Todos' ||
        asignacion.materiaId === Number(materiaFiltro)
      const coincideGrupo =
        grupoFiltro === 'Todos' ||
        asignacion.grupoId === Number(grupoFiltro)

      return (
        coincideDocente &&
        coincideCiclo &&
        coincideGrado &&
        coincideMateria &&
        coincideGrupo
      )
    })
  }, [
    asignaciones,
    busqueda,
    cicloFiltro,
    gradoFiltro,
    materiaFiltro,
    grupoFiltro,
  ])

  function manejarCambioGradoFiltro(valor: string) {
    setGradoFiltro(valor)

    if (valor === 'Todos') return

    const grado = Number(valor)
    const materiaActual = opciones.materias.find(
      (materia) => String(materia.id) === materiaFiltro,
    )
    const grupoActual = opciones.grupos.find(
      (grupo) => String(grupo.id) === grupoFiltro,
    )

    if (materiaActual && materiaActual.gradoId !== grado) {
      setMateriaFiltro('Todos')
    }
    if (grupoActual && grupoActual.gradoId !== grado) {
      setGrupoFiltro('Todos')
    }
  }

  function guardarFocoPrevio() {
    focoPrevioRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
  }

  function abrirFormularioNueva() {
    guardarFocoPrevio()
    setAsignacionEnDetalle(null)
    setAsignacionEnEdicion(null)
    setErrorFormulario('')
    setFormularioAbierto(true)
  }

  function abrirFormularioEdicion(asignacion: AsignacionAcademica) {
    guardarFocoPrevio()
    setAsignacionEnDetalle(null)
    setAsignacionEnEdicion(asignacion)
    setErrorFormulario('')
    setFormularioAbierto(true)
  }

  function abrirDetalle(asignacion: AsignacionAcademica) {
    guardarFocoPrevio()
    setFormularioAbierto(false)
    setAsignacionEnEdicion(null)
    setErrorFormulario('')
    setAsignacionEnDetalle(asignacion)
  }

  function mostrarMensaje(tipo: TipoMensaje, texto: string) {
    setTipoMensaje(tipo)
    setMensaje(texto)
  }

  async function manejarGuardar(datos: DatosAsignacionAcademica) {
    setGuardando(true)
    setErrorFormulario('')

    try {
      if (asignacionEnEdicion) {
        const actualizada = await actualizarAsignacionAcademica(
          asignacionEnEdicion.id,
          datos,
        )
        setAsignaciones((actuales) =>
          ordenarAsignaciones(
            actuales.map((asignacion) =>
              asignacion.id === actualizada.id ? actualizada : asignacion,
            ),
          ),
        )
        mostrarMensaje(
          'exito',
          `La asignación de ${actualizada.docente} se actualizó correctamente.`,
        )
      } else {
        const nuevaAsignacion = await crearAsignacionAcademica(datos)
        setAsignaciones((actuales) =>
          ordenarAsignaciones([...actuales, nuevaAsignacion]),
        )
        mostrarMensaje(
          'exito',
          `La asignación de ${nuevaAsignacion.docente} se registró correctamente.`,
        )
      }

      setFormularioAbierto(false)
      setAsignacionEnEdicion(null)

      const focoPrevio = focoPrevioRef.current
      focoPrevioRef.current = null
      enfocarElemento(focoPrevio)
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la asignación académica.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="academico-container">
      <div className="academico-header">
        <div>
          <h1 className="academico-title">Asignación académica</h1>
          <p className="academico-subtitle">
            Asignación de docentes a grupo y materia
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={abrirFormularioNueva}
          type="button"
        >
          <Plus size={16} />
          Nueva asignación
        </button>
      </div>

      {mensaje && (
        <div
          aria-live="polite"
          className={`asignaciones-mensaje asignaciones-mensaje--${tipoMensaje}`}
          role="status"
        >
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

      {errorCarga && (
        <div
          className="asignaciones-mensaje asignaciones-mensaje--error"
          role="alert"
        >
          <strong>No se pudieron cargar las asignaciones</strong>
          <span>{errorCarga}</span>
        </div>
      )}

      {!errorCarga && (
        <div className="card-table">
          <AsignacionesFiltros
            alCambiarBusqueda={setBusqueda}
            alCambiarCiclo={setCicloFiltro}
            alCambiarGrado={manejarCambioGradoFiltro}
            alCambiarGrupo={setGrupoFiltro}
            alCambiarMateria={setMateriaFiltro}
            busqueda={busqueda}
            cicloSeleccionado={cicloFiltro}
            ciclos={opciones.ciclos}
            gradoSeleccionado={gradoFiltro}
            grados={opciones.grados}
            grupoSeleccionado={grupoFiltro}
            grupos={gruposFiltro}
            materiaSeleccionada={materiaFiltro}
            materias={materiasFiltro}
          />

          {cargando ? (
            <p className="asignaciones-estado">
              Cargando asignaciones académicas...
            </p>
          ) : (
            <AsignacionesTabla
              alEditar={abrirFormularioEdicion}
              alVer={abrirDetalle}
              asignaciones={asignacionesFiltradas}
            />
          )}
        </div>
      )}

      {dialogoAbierto && (
        <div
          className="asignaciones-dialogo__fondo"
          onClick={cerrarDialogo}
          role="presentation"
        >
          <section
            aria-labelledby="titulo-dialogo-asignacion"
            aria-modal="true"
            className="asignaciones-dialogo"
            onClick={(evento) => evento.stopPropagation()}
            ref={dialogoRef}
            role="dialog"
          >
            <button
              aria-label="Cerrar"
              className="asignaciones-dialogo__cerrar"
              disabled={guardando}
              onClick={cerrarDialogo}
              type="button"
            >
              ×
            </button>

            {asignacionEnDetalle ? (
              <>
                <h2 id="titulo-dialogo-asignacion">
                  Detalle de la asignación
                </h2>
                <p className="asignaciones-dialogo__descripcion">
                  Consulta la información académica registrada para el
                  docente.
                </p>
                <DetalleAsignacionAcademica
                  asignacion={asignacionEnDetalle}
                />
                <div className="asignaciones-formulario__acciones">
                  <button
                    className="asignaciones-formulario__cancelar"
                    onClick={cerrarDialogo}
                    type="button"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="titulo-dialogo-asignacion">
                  {asignacionEnEdicion
                    ? 'Editar asignación académica'
                    : 'Nueva asignación académica'}
                </h2>
                <p className="asignaciones-dialogo__descripcion">
                  {asignacionEnEdicion
                    ? 'Actualiza el docente, ciclo, grado, materia o grupo de la asignación seleccionada.'
                    : 'Selecciona al docente y los datos académicos para registrar la asignación.'}
                </p>
                <FormularioAsignacionAcademica
                  alCancelar={cerrarDialogo}
                  alGuardar={manejarGuardar}
                  asignacion={asignacionEnEdicion}
                  error={errorFormulario}
                  guardando={guardando}
                  key={asignacionEnEdicion?.id ?? 'nueva'}
                  opciones={opciones}
                />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

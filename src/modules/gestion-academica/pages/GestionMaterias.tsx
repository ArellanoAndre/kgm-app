import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import '../styles/gestionCicloEscolar.css'
import '../styles/gestionMaterias.css'
import type { DatosMateria, GradoMateria, Materia } from '../types/Materia'
import {
  actualizarMateria,
  crearMateria,
  obtenerMaterias,
  obtenerOpcionesMaterias,
} from '../services/materiasServicio'
import { MateriasFiltros } from '../components/MateriasFiltros'
import { MateriasTabla } from '../components/MateriasTabla'
import { FormularioMateria } from '../components/FormularioMateria'

type TipoMensaje = 'exito' | 'error'

function ordenarMaterias(materias: Materia[]): Materia[] {
  return [...materias].sort(
    (a, b) =>
      a.grado.localeCompare(b.grado, 'es') ||
      a.nombre.localeCompare(b.nombre, 'es'),
  )
}

function enfocarElemento(elemento: HTMLElement | null) {
  if (!elemento) return
  window.requestAnimationFrame(() => elemento.focus())
}

export function GestionMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [grados, setGrados] = useState<GradoMateria[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [gradoSeleccionado, setGradoSeleccionado] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<TipoMensaje>('exito')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [materiaEnEdicion, setMateriaEnEdicion] = useState<Materia | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const dialogoRef = useRef<HTMLElement>(null)
  const focoPrevioRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelado = false

    Promise.all([obtenerMaterias(), obtenerOpcionesMaterias()])
      .then(([materiasApi, opcionesApi]) => {
        if (cancelado) return
        setMaterias(ordenarMaterias(materiasApi))
        setGrados(opcionesApi.grados)
        setErrorCarga('')
      })
      .catch((error: unknown) => {
        if (cancelado) return
        setErrorCarga(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las materias.',
        )
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const cerrarFormulario = useCallback(() => {
    if (guardando) return

    setFormularioAbierto(false)
    setMateriaEnEdicion(null)
    setErrorFormulario('')

    const focoPrevio = focoPrevioRef.current
    focoPrevioRef.current = null
    enfocarElemento(focoPrevio)
  }, [guardando])

  useEffect(() => {
    if (!formularioAbierto) return

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !guardando) {
        cerrarFormulario()
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
  }, [formularioAbierto, guardando, cerrarFormulario])

  const materiasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase()

    return materias.filter((materia) => {
      const coincideNombre =
        !termino || materia.nombre.toLocaleLowerCase().includes(termino)
      const coincideGrado =
        gradoSeleccionado === 'Todos' ||
        materia.gradoId === Number(gradoSeleccionado)

      return coincideNombre && coincideGrado
    })
  }, [materias, busqueda, gradoSeleccionado])

  function abrirFormularioNueva() {
    focoPrevioRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setMateriaEnEdicion(null)
    setErrorFormulario('')
    setFormularioAbierto(true)
  }

  function abrirFormularioEdicion(materia: Materia) {
    focoPrevioRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setMateriaEnEdicion(materia)
    setErrorFormulario('')
    setFormularioAbierto(true)
  }

  function mostrarMensaje(tipo: TipoMensaje, texto: string) {
    setTipoMensaje(tipo)
    setMensaje(texto)
  }

  async function manejarGuardar(datos: DatosMateria) {
    setGuardando(true)
    setErrorFormulario('')

    try {
      if (materiaEnEdicion) {
        const materiaActualizada = await actualizarMateria(
          materiaEnEdicion.id,
          datos,
        )
        setMaterias((actuales) =>
          ordenarMaterias(
            actuales.map((materia) =>
              materia.id === materiaActualizada.id
                ? materiaActualizada
                : materia,
            ),
          ),
        )
        mostrarMensaje(
          'exito',
          `La materia ${materiaActualizada.nombre} se actualizó correctamente.`,
        )
      } else {
        const nuevaMateria = await crearMateria(datos)
        setMaterias((actuales) =>
          ordenarMaterias([...actuales, nuevaMateria]),
        )
        mostrarMensaje(
          'exito',
          `La materia ${nuevaMateria.nombre} se registró correctamente.`,
        )
      }

      setFormularioAbierto(false)
      setMateriaEnEdicion(null)

      const focoPrevio = focoPrevioRef.current
      focoPrevioRef.current = null
      enfocarElemento(focoPrevio)
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la materia.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="academico-container">
      <div className="academico-header">
        <div>
          <h1 className="academico-title">Materias</h1>
          <p className="academico-subtitle">
            Registro y consulta de materias escolares
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={abrirFormularioNueva}
          type="button"
        >
          <Plus size={16} />
          Agregar materia
        </button>
      </div>

      {mensaje && (
        <div
          aria-live="polite"
          className={`materias-mensaje materias-mensaje--${tipoMensaje}`}
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
        <div className="materias-mensaje materias-mensaje--error" role="alert">
          <strong>No se pudieron cargar las materias</strong>
          <span>{errorCarga}</span>
        </div>
      )}

      {!errorCarga && (
        <div className="card-table">
          <MateriasFiltros
            alCambiarBusqueda={setBusqueda}
            alCambiarGrado={setGradoSeleccionado}
            busqueda={busqueda}
            gradoSeleccionado={gradoSeleccionado}
            grados={grados}
          />

          {cargando ? (
            <p className="materias-estado">Cargando materias...</p>
          ) : (
            <MateriasTabla
              alEditar={abrirFormularioEdicion}
              materias={materiasFiltradas}
            />
          )}
        </div>
      )}

      {formularioAbierto && (
        <div
          className="materias-dialogo__fondo"
          onClick={cerrarFormulario}
          role="presentation"
        >
          <section
            aria-labelledby="titulo-formulario-materia"
            aria-modal="true"
            className="materias-dialogo"
            onClick={(evento) => evento.stopPropagation()}
            ref={dialogoRef}
            role="dialog"
          >
            <button
              aria-label="Cerrar"
              className="materias-dialogo__cerrar"
              disabled={guardando}
              onClick={cerrarFormulario}
              type="button"
            >
              ×
            </button>

            <h2 id="titulo-formulario-materia">
              {materiaEnEdicion ? 'Editar materia' : 'Nueva materia'}
            </h2>
            <p className="materias-dialogo__descripcion">
              {materiaEnEdicion
                ? 'Actualiza los datos de la materia seleccionada.'
                : 'Registra la materia con una clave única y el grado al que se impartirá.'}
            </p>

            <FormularioMateria
              alCancelar={cerrarFormulario}
              alGuardar={manejarGuardar}
              error={errorFormulario}
              grados={grados}
              guardando={guardando}
              key={materiaEnEdicion?.id ?? 'nueva'}
              materia={materiaEnEdicion}
            />
          </section>
        </div>
      )}
    </div>
  )
}

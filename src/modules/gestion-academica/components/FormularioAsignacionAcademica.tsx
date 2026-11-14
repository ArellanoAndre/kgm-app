import { useMemo, useState, type FormEvent } from 'react'
import type {
  AsignacionAcademica,
  DatosAsignacionAcademica,
  DocenteAsignable,
  OpcionesAsignacionAcademica,
} from '../types/AsignacionAcademica'

type PropiedadesFormularioAsignacion = {
  opciones: OpcionesAsignacionAcademica
  asignacion?: AsignacionAcademica | null
  guardando: boolean
  error: string
  alGuardar: (datos: DatosAsignacionAcademica) => void
  alCancelar: () => void
}

function obtenerIniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function FormularioAsignacionAcademica({
  opciones,
  asignacion,
  guardando,
  error,
  alGuardar,
  alCancelar,
}: PropiedadesFormularioAsignacion) {
  const [docenteId, setDocenteId] = useState(
    asignacion ? String(asignacion.docenteId) : '',
  )
  const [busquedaDocente, setBusquedaDocente] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [cicloId, setCicloId] = useState(
    asignacion ? String(asignacion.cicloId) : '',
  )
  const [gradoId, setGradoId] = useState(
    asignacion ? String(asignacion.gradoId) : '',
  )
  const [materiaId, setMateriaId] = useState(
    asignacion ? String(asignacion.materiaId) : '',
  )
  const [grupoId, setGrupoId] = useState(
    asignacion ? String(asignacion.grupoId) : '',
  )
  const [errorValidacion, setErrorValidacion] = useState('')

  const docenteSeleccionado =
    opciones.docentes.find((docente) => String(docente.id) === docenteId) ??
    null

  const docentesEncontrados = useMemo(() => {
    const consulta = busquedaDocente.trim().toLocaleLowerCase()
    if (!consulta) return []

    return opciones.docentes
      .filter(
        (docente) =>
          docente.nombreCompleto.toLocaleLowerCase().includes(consulta) ||
          docente.curp.toLocaleLowerCase().includes(consulta),
      )
      .slice(0, 8)
  }, [opciones.docentes, busquedaDocente])

  const materiasDisponibles = gradoId
    ? opciones.materias.filter(
        (materia) => materia.gradoId === Number(gradoId),
      )
    : []

  const gruposDisponibles = gradoId
    ? opciones.grupos.filter((grupo) => grupo.gradoId === Number(gradoId))
    : []

  function seleccionarDocente(docente: DocenteAsignable) {
    setDocenteId(String(docente.id))
    setBusquedaDocente('')
    setMostrarResultados(false)
    setErrorValidacion('')
  }

  function cambiarDocente() {
    setDocenteId('')
    setBusquedaDocente('')
    setMostrarResultados(true)
    setErrorValidacion('')
  }

  function manejarCambioGrado(valor: string) {
    setGradoId(valor)
    setMateriaId('')
    setGrupoId('')
    setErrorValidacion('')
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!docenteSeleccionado) {
      setErrorValidacion('Busca y selecciona un docente.')
      return
    }

    if (!cicloId || !gradoId || !materiaId || !grupoId) {
      setErrorValidacion(
        'Selecciona el ciclo escolar, el grado, la materia y el grupo.',
      )
      return
    }

    setErrorValidacion('')
    alGuardar({
      cicloId: Number(cicloId),
      grupoId: Number(grupoId),
      materiaId: Number(materiaId),
      docenteId: Number(docenteId),
    })
  }

  const mensajeError = errorValidacion || error

  return (
    <form onSubmit={manejarEnvio}>
      <div className="form-group">
        {docenteSeleccionado ? (
          <span className="form-label">Docente</span>
        ) : (
          <label className="form-label" htmlFor="asignacion-docente">
            Docente
          </label>
        )}

        {docenteSeleccionado ? (
          <div className="asignacion-docente-seleccionado">
            {docenteSeleccionado.foto ? (
              <img
                alt={`Foto de ${docenteSeleccionado.nombreCompleto}`}
                className="asignacion-docente__foto"
                src={docenteSeleccionado.foto}
              />
            ) : (
              <span
                aria-hidden="true"
                className="asignacion-docente__foto-vacia"
              >
                {obtenerIniciales(docenteSeleccionado.nombreCompleto)}
              </span>
            )}
            <div className="asignacion-docente-seleccionado__datos">
              <strong>{docenteSeleccionado.nombreCompleto}</strong>
              <span>CURP {docenteSeleccionado.curp}</span>
            </div>
            <button
              className="asignaciones-enlace"
              disabled={guardando}
              onClick={cambiarDocente}
              type="button"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <div className="asignaciones-buscador">
            <input
              autoFocus
              className="form-input"
              id="asignacion-docente"
              onChange={(evento) => {
                setBusquedaDocente(evento.target.value)
                setMostrarResultados(true)
                setErrorValidacion('')
              }}
              placeholder="Buscar docente por nombre o CURP"
              type="search"
              value={busquedaDocente}
            />

            {mostrarResultados && busquedaDocente.trim() && (
              <div
                aria-label="Resultados de docentes"
                className="asignaciones-buscador__resultados"
              >
                {docentesEncontrados.length > 0 ? (
                  docentesEncontrados.map((docente) => (
                    <button
                      className="asignaciones-buscador__opcion"
                      key={docente.id}
                      onClick={() => seleccionarDocente(docente)}
                      type="button"
                    >
                      <strong>{docente.nombreCompleto}</strong>
                      <span>CURP {docente.curp}</span>
                    </button>
                  ))
                ) : (
                  <p className="asignaciones-buscador__vacio">
                    No se encontraron docentes con esos datos.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="asignaciones-formulario__rejilla">
        <div className="form-group">
          <label className="form-label" htmlFor="asignacion-ciclo">
            Ciclo escolar
          </label>
          <select
            className="form-select"
            id="asignacion-ciclo"
            onChange={(evento) => {
              setCicloId(evento.target.value)
              setErrorValidacion('')
            }}
            required
            value={cicloId}
          >
            <option value="">Seleccionar ciclo escolar</option>
            {opciones.ciclos.map((ciclo) => (
              <option key={ciclo.id} value={ciclo.id}>
                {ciclo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="asignacion-grado">
            Grado al que dará clases
          </label>
          <select
            className="form-select"
            id="asignacion-grado"
            onChange={(evento) => manejarCambioGrado(evento.target.value)}
            required
            value={gradoId}
          >
            <option value="">Seleccionar grado</option>
            {opciones.grados.map((grado) => (
              <option key={grado.id} value={grado.id}>
                {grado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="asignacion-materia">
            Materia que impartirá
          </label>
          <select
            className="form-select"
            disabled={!gradoId}
            id="asignacion-materia"
            onChange={(evento) => {
              setMateriaId(evento.target.value)
              setErrorValidacion('')
            }}
            required
            value={materiaId}
          >
            <option value="">Seleccionar materia</option>
            {materiasDisponibles.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre} ({materia.clave})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="asignacion-grupo">
            Grupo al que se asignará
          </label>
          <select
            className="form-select"
            disabled={!gradoId}
            id="asignacion-grupo"
            onChange={(evento) => {
              setGrupoId(evento.target.value)
              setErrorValidacion('')
            }}
            required
            value={grupoId}
          >
            <option value="">Seleccionar grupo</option>
            {gruposDisponibles.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!gradoId && (
        <p className="asignaciones-formulario__ayuda">
          Selecciona primero el grado para ver las materias y grupos
          disponibles.
        </p>
      )}

      {mensajeError && (
        <div
          className="asignaciones-mensaje asignaciones-mensaje--error"
          role="alert"
        >
          <span>{mensajeError}</span>
        </div>
      )}

      <div className="asignaciones-formulario__acciones">
        <button className="btn-primary" disabled={guardando} type="submit">
          {guardando
            ? 'Guardando...'
            : asignacion
              ? 'Guardar cambios'
              : 'Registrar asignación'}
        </button>
        <button
          className="asignaciones-formulario__cancelar"
          disabled={guardando}
          onClick={alCancelar}
          type="button"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

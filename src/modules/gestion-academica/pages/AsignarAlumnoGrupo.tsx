import { useMemo, useRef, useState, type FormEvent } from 'react'
import {
  guardarAsignacionAlumno,
  obtenerAlumnosAsignables,
} from '../services/asignacionAlumnoServicioMock'
import type { AlumnoAsignable, AsignacionAlumno } from '../types/AsignacionAlumno'
import '../styles/asignarAlumnoGrupo.css'

const CICLOS_ESCOLARES = ['2026–2027', '2025–2026']
const GRADOS = ['1°', '2°', '3°', '4°', '5°', '6°']
const GRUPOS = ['A', 'B', 'C']

function AsignarAlumnoGrupo() {
  const [alumnos, setAlumnos] = useState(obtenerAlumnosAsignables)
  const [alumnoSeleccionadoId, setAlumnoSeleccionadoId] = useState<number | null>(1)
  const [busquedaAlumno, setBusquedaAlumno] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [cicloEscolar, setCicloEscolar] = useState('')
  const [grado, setGrado] = useState('')
  const [grupo, setGrupo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'aviso' | 'error' | 'exito'>('aviso')
  const campoCiclo = useRef<HTMLSelectElement>(null)

  const alumnoSeleccionado =
    alumnos.find((alumno) => alumno.id === alumnoSeleccionadoId) ?? null

  const alumnosEncontrados = useMemo(() => {
    const consulta = busquedaAlumno.trim().toLocaleLowerCase()
    if (!consulta) return []

    return alumnos.filter(
      (alumno) =>
        alumno.nombre.toLocaleLowerCase().includes(consulta) ||
        alumno.curp.toLocaleLowerCase().includes(consulta),
    )
  }, [alumnos, busquedaAlumno])

  const asignacionesActuales =
    alumnoSeleccionado?.asignaciones.filter(
      (asignacion) => asignacion.estado === 'Activo',
    ) ?? []

  const asignacionRepetida =
    Boolean(cicloEscolar && grado && grupo) &&
    asignacionesActuales.some(
      (asignacion) =>
        asignacion.cicloEscolar === cicloEscolar &&
        asignacion.grado === grado &&
        asignacion.grupo === grupo,
    )

  function seleccionarAlumno(alumno: AlumnoAsignable) {
    setAlumnoSeleccionadoId(alumno.id)
    setBusquedaAlumno('')
    setMostrarResultados(false)
    setMensaje('')
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!alumnoSeleccionado) {
      setTipoMensaje('error')
      setMensaje('Primero busca y selecciona un alumno.')
      return
    }

    if (!cicloEscolar || !grado || !grupo) {
      setTipoMensaje('error')
      setMensaje('Selecciona el ciclo escolar, el grado y el grupo.')
      return
    }

    const nuevaAsignacion: AsignacionAlumno = {
      cicloEscolar,
      grado,
      grupo,
      estado: 'Activo',
      observaciones: 'Asignación actual del alumno',
    }

    try {
      const alumnoActualizado = guardarAsignacionAlumno(
        alumnoSeleccionado.id,
        nuevaAsignacion,
      )
      setAlumnos((actuales) =>
        actuales.map((alumno) =>
          alumno.id === alumnoActualizado.id ? alumnoActualizado : alumno,
        ),
      )
      setTipoMensaje('exito')
      setMensaje(
        `${alumnoSeleccionado.nombre} fue asignado a ${grado} ${grupo} en el ciclo ${cicloEscolar}.`,
      )
      setCicloEscolar('')
      setGrado('')
      setGrupo('')
    } catch (error) {
      setTipoMensaje('error')
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo completar la asignación.',
      )
    }
  }

  function cancelarAsignacion() {
    setCicloEscolar('')
    setGrado('')
    setGrupo('')
    setMensaje('')
  }
  
  return (
    <section aria-labelledby="titulo-asignar-alumno" className="pagina-asignar-alumno">
      <header className="pagina-asignar-alumno__encabezado">
        <div>
          <h1 id="titulo-asignar-alumno">Asignar alumno a grupo</h1>
          <p>Relaciona un alumno con su ciclo, grado y grupo</p>
        </div>
      </header>

      <section aria-labelledby="titulo-buscar-alumno" className="tarjeta-asignar-alumno">
        <h2 id="titulo-buscar-alumno">1. Buscar alumno</h2>
        <label className="buscador-alumno">
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            aria-label="Buscar alumno por nombre o CURP"
            onChange={(evento) => {
              setBusquedaAlumno(evento.target.value)
              setMostrarResultados(true)
            }}
            placeholder="Buscar alumno por nombre o CURP"
            type="search"
            value={busquedaAlumno}
          />
        </label>

        {mostrarResultados && busquedaAlumno.trim() && (
          <div aria-label="Resultados de alumnos" className="resultados-alumnos">
            {alumnosEncontrados.length > 0 ? (
              alumnosEncontrados.map((alumno) => (
                <button
                  className="resultados-alumnos__opcion"
                  key={alumno.id}
                  onClick={() => seleccionarAlumno(alumno)}
                  type="button"
                >
                  <strong>{alumno.nombre}</strong>
                  <span>CURP {alumno.curp}</span>
                </button>
              ))
            ) : (
              <p>No se encontraron alumnos con esos datos.</p>
            )}
          </div>
        )}

        {alumnoSeleccionado ? (
          <article className="alumno-seleccionado">
            <div className="alumno-seleccionado__identidad">
              <h3>{alumnoSeleccionado.nombre}</h3>
              <p>CURP {alumnoSeleccionado.curp}</p>
            </div>
            <div className="alumno-seleccionado__dato">
              <span>Estado actual</span>
              <strong className="insignia-asignacion insignia-asignacion--activo">
                {alumnoSeleccionado.estado}
              </strong>
            </div>
            <div className="alumno-seleccionado__dato alumno-seleccionado__dato--grupo">
              <span>Grupo actual</span>
              {asignacionesActuales.length > 0 ? (
                <strong>
                  {asignacionesActuales[0].grado} {asignacionesActuales[0].grupo} ·{' '}
                  {asignacionesActuales[0].cicloEscolar}
                </strong>
              ) : (
                <strong>Sin asignación activa</strong>
              )}
            </div>
          </article>
        ) : (
          <p className="alumno-seleccionado__vacio">
            Busca y selecciona un alumno para consultar su estado actual.
          </p>
        )}
      </section>

      <form
        className="tarjeta-asignar-alumno tarjeta-asignar-alumno--formulario"
        onSubmit={manejarEnvio}
      >
        <h2>2. Asignación</h2>
        <div className="formulario-asignacion">
          <label htmlFor="ciclo-escolar">
            Ciclo escolar
            <select
              id="ciclo-escolar"
              onChange={(evento) => setCicloEscolar(evento.target.value)}
              ref={campoCiclo}
              value={cicloEscolar}
            >
              <option value="">Seleccionar ciclo escolar</option>
              {CICLOS_ESCOLARES.map((ciclo) => (
                <option key={ciclo} value={ciclo}>
                  {ciclo}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="grado">
            Grado
            <select
              id="grado"
              onChange={(evento) => setGrado(evento.target.value)}
              value={grado}
            >
              <option value="">Seleccionar grado</option>
              {GRADOS.map((opcionGrado) => (
                <option key={opcionGrado} value={opcionGrado}>
                  {opcionGrado}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="grupo">
            Grupo
            <select
              id="grupo"
              onChange={(evento) => setGrupo(evento.target.value)}
              value={grupo}
            >
              <option value="">Seleccionar grupo</option>
              {GRUPOS.map((opcionGrupo) => (
                <option key={opcionGrupo} value={opcionGrupo}>
                  {opcionGrupo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {asignacionRepetida ? (
          <div className="aviso-asignacion aviso-asignacion--error" role="alert">
            <strong>Validación</strong>
            <span>
              El alumno {alumnoSeleccionado?.nombre} ya está asignado a {grado}{' '}
              {grupo} en el ciclo {cicloEscolar}. No puedes asignarlo nuevamente
              al mismo grupo y ciclo.
            </span>
          </div>
        ) : (
          <div
            className={`aviso-asignacion${mensaje && tipoMensaje === 'error' ? ' aviso-asignacion--error' : ''}${mensaje && tipoMensaje === 'exito' ? ' aviso-asignacion--exito' : ''}`}
            role={mensaje ? 'status' : 'note'}
          >
            <strong>{mensaje ? (tipoMensaje === 'error' ? 'Validación' : 'Confirmación') : 'Validación'}</strong>
            <span>
              {mensaje ||
                (asignacionesActuales.length > 0
                  ? `El alumno ${alumnoSeleccionado?.nombre} ya está asignado a ${asignacionesActuales[0].grado} ${asignacionesActuales[0].grupo} en el ciclo ${asignacionesActuales[0].cicloEscolar}. No puedes asignarlo nuevamente al mismo grupo y ciclo.`
                  : 'Selecciona un ciclo, grado y grupo para asignar al alumno.')}
            </span>
          </div>
        )}

        <div className="formulario-asignacion__acciones">
          <button className="pagina-asignar-alumno__boton-principal" type="submit">
            Asignar alumno
          </button>
          <button
            className="pagina-asignar-alumno__boton-secundario"
            onClick={cancelarAsignacion}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </form>

      <section aria-label="Asignaciones actuales del alumno" className="tabla-asignaciones">
        <div className="tabla-asignaciones__desplazamiento">
          <table>
            <thead>
              <tr>
                <th scope="col">Ciclo escolar</th>
                <th scope="col">Grado</th>
                <th scope="col">Grupo</th>
                <th scope="col">Estado</th>
                <th scope="col">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {asignacionesActuales.length > 0 ? (
                asignacionesActuales.map((asignacion, indice) => (
                  <tr key={`${asignacion.cicloEscolar}-${asignacion.grado}-${asignacion.grupo}-${indice}`}>
                    <td>{asignacion.cicloEscolar}</td>
                    <td>{asignacion.grado}</td>
                    <td><strong>{asignacion.grupo}</strong></td>
                    <td>
                      <span className="insignia-asignacion insignia-asignacion--activo">
                        {asignacion.estado}
                      </span>
                    </td>
                    <td>{asignacion.observaciones}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>El alumno aún no tiene asignaciones.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default AsignarAlumnoGrupo

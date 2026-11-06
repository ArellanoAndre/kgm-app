import { useMemo, useState } from 'react'
import FiltrosAlumnos, { type FiltrosAlumno } from '../components/FiltrosAlumnos'
import TablaAlumnos from '../components/TablaAlumnos'
import { ALUMNOS_DE_PRUEBA } from '../services/alumnoServicioMock'
import type { AlumnoConsulta as Alumno } from '../types/AlumnoConsulta'
import '../styles/alumnos.css'

const FILTROS_INICIALES: FiltrosAlumno = {
  busqueda: '',
  grado: 'Todos',
  grupo: 'Todos',
  estado: 'Todos',
}

export default function ConsultarAlumnos({ alNuevoAlumno }: { alNuevoAlumno?: () => void }) {
  const [alumnos, setAlumnos] = useState<Alumno[]>(ALUMNOS_DE_PRUEBA)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null)
  const [mensaje, setMensaje] = useState('')

  const grados = useMemo(
    () => [...new Set(alumnos.map((alumno) => alumno.grado))],
    [alumnos],
  )

  const grupos = useMemo(
    () => [...new Set(alumnos.map((alumno) => alumno.grupo))],
    [alumnos],
  )

  const alumnosFiltrados = useMemo(() => {
    const busqueda = filtrosAplicados.busqueda.trim().toLowerCase()

    return alumnos.filter((alumno) => {
      const nombre = [
        alumno.nombre,
        alumno.apellidoPaterno,
        alumno.apellidoMaterno,
      ].join(' ').toLowerCase()

      return (
        (!busqueda ||
          nombre.includes(busqueda) ||
          alumno.curp.toLowerCase().includes(busqueda)) &&
        (filtrosAplicados.grado === 'Todos' ||
          alumno.grado === filtrosAplicados.grado) &&
        (filtrosAplicados.grupo === 'Todos' ||
          alumno.grupo === filtrosAplicados.grupo) &&
        (filtrosAplicados.estado === 'Todos' ||
          alumno.estado === filtrosAplicados.estado)
      )
    })
  }, [alumnos, filtrosAplicados])

  function cambiarEstado(alumno: Alumno) {
    const nuevoEstado = alumno.estado === 'Activo' ? 'Baja' : 'Activo'

    setAlumnos((actuales) =>
      actuales.map((actual) =>
        actual.id === alumno.id
          ? { ...actual, estado: nuevoEstado }
          : actual,
      ),
    )

    setMensaje(`Estado de ${alumno.nombre} actualizado a ${nuevoEstado}.`)
  }

  return (
    <section className="pagina-alumnos">
      <header className="pagina-alumnos__encabezado">
        <div>
          <h1>Alumnos</h1>
          <p>Consulta y administración de alumnos registrados</p>
        </div>

        <button
          className="boton-primario-alumnos"
          type="button"
          onClick={() => alNuevoAlumno?.()}
        >
          + Nuevo alumno
        </button>
      </header>

      <FiltrosAlumnos
        filtros={filtros}
        grados={grados}
        grupos={grupos}
        alCambiar={setFiltros}
        alBuscar={() => setFiltrosAplicados({ ...filtros })}
      />

      <section className="panel-alumnos" aria-label="Listado de alumnos">
        <TablaAlumnos
          alumnos={alumnosFiltrados}
          alVer={setAlumnoSeleccionado}
          alEditar={() =>
            setMensaje('La edición de alumnos está pendiente de implementación.')
          }
          alCambiarEstado={cambiarEstado}
        />
      </section>

      <aside className="aviso-alumnos">
        Antes de registrar un alumno, verifica que su CURP no exista
        previamente en el catálogo.
      </aside>

      {mensaje && (
        <div className="mensaje-alumnos" role="status">
          <span>{mensaje}</span>
          <button type="button" onClick={() => setMensaje('')}>
            Cerrar
          </button>
        </div>
      )}

      {alumnoSeleccionado && (
        <div
          className="dialogo-alumno__fondo"
          onClick={() => setAlumnoSeleccionado(null)}
        >
          <section
            className="dialogo-alumno"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-ficha-alumno"
            onClick={(evento) => evento.stopPropagation()}
          >
            <h2 id="titulo-ficha-alumno">Ficha del alumno</h2>
            <p>
              <strong>Nombre: </strong>
              {[
                alumnoSeleccionado.nombre,
                alumnoSeleccionado.apellidoPaterno,
                alumnoSeleccionado.apellidoMaterno,
              ].join(' ')}
            </p>
            <p><strong>CURP: </strong>{alumnoSeleccionado.curp}</p>
            <p><strong>Grado: </strong>{alumnoSeleccionado.grado}</p>
            <p><strong>Grupo: </strong>{alumnoSeleccionado.grupo}</p>
            <p><strong>Estado: </strong>{alumnoSeleccionado.estado}</p>
            <p><strong>Turno: </strong>{alumnoSeleccionado.turno}</p>

            <button
              className="boton-primario-alumnos"
              type="button"
              onClick={() => setAlumnoSeleccionado(null)}
            >
              Cerrar
            </button>
          </section>
        </div>
      )}
    </section>
  )
}


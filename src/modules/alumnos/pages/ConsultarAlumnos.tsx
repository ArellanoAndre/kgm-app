import EditarAlumno from './EditarAlumno'
import FichaAlumno from './FichaAlumno'
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
  const [alumnoEnEdicion, setAlumnoEnEdicion] = useState<Alumno | null>(null)

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

  if (alumnoEnEdicion) {
    return (
      <section className="pagina-alumnos">
        <button
          type="button"
          className="boton-primario-alumnos"
          onClick={() => setAlumnoEnEdicion(null)}
        >
          ← Volver al listado
        </button>

        <EditarAlumno alumnoId={alumnoEnEdicion.id} />
      </section>
    )
  }
  if (alumnoSeleccionado) {
    return (
      <FichaAlumno
        alumno={alumnoSeleccionado}
        alVolver={() => setAlumnoSeleccionado(null)}
      />
    )
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
          alEditar={setAlumnoEnEdicion}
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


    </section>
  )
}


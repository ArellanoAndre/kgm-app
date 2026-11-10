import EditarAlumno from './EditarAlumno'
import FichaAlumno from './FichaAlumno'
import { useEffect, useMemo, useState } from 'react'
import FiltrosAlumnos, { type FiltrosAlumno } from '../components/FiltrosAlumnos'
import TablaAlumnos from '../components/TablaAlumnos'
import { consultarAlumnos, consultarFichaAlumno } from '../services/consultaAlumnosApi'
import type { AlumnoConsulta as Alumno } from '../types/AlumnoConsulta'
import '../styles/alumnos.css'

const FILTROS_INICIALES: FiltrosAlumno = {
  busqueda: '',
  grado: 'Todos',
  grupo: 'Todos',
  estado: 'Todos',
}

interface ConsultarAlumnosProps {
  alNuevoAlumno?: () => void
  alRegistrarTutor?: (alumno: Alumno) => void
  alAbrirExpediente?: (alumno: Alumno) => void
}

export default function ConsultarAlumnos({ alNuevoAlumno, alRegistrarTutor, alAbrirExpediente }: ConsultarAlumnosProps) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [alumnoEnEdicion, setAlumnoEnEdicion] = useState<Alumno | null>(null)

  useEffect(() => {
    let activo = true

    consultarAlumnos()
      .then((datos) => {
        if (activo) setAlumnos(datos)
      })
      .catch((error) => {
        if (activo) setMensaje(`No se pudieron cargar los alumnos: ${error.message}`)
      })

    return () => {
      activo = false
    }
  }, [])

  async function verFicha(alumno: Alumno) {
    try {
      const ficha = await consultarFichaAlumno(alumno)
      setAlumnoSeleccionado(ficha)
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? `No se pudo consultar la ficha: ${error.message}`
          : 'No se pudo consultar la ficha.',
      )
    }
  }
  const grados = useMemo(
    () => [...new Set(alumnos.map((alumno) => alumno.grado).filter(Boolean))],
    [alumnos],
  )

  const grupos = useMemo(
    () => [...new Set(alumnos.map((alumno) => alumno.grupo).filter(Boolean))],
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

  function cambiarEstado(_alumno: Alumno) {
    setMensaje(
      'El cambio de estado todavía no está conectado al backend.',
    )
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
          alVer={verFicha}
          alEditar={setAlumnoEnEdicion}
          alCambiarEstado={cambiarEstado}
            alRegistrarTutor={(alumno) => alRegistrarTutor?.(alumno)}
            alAbrirExpediente={(alumno) => alAbrirExpediente?.(alumno)}
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

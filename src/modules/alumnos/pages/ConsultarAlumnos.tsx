import EditarAlumno from './EditarAlumno'
import FichaAlumno from './FichaAlumno'
import { useEffect, useMemo, useState } from 'react'
import FiltrosAlumnos, { type FiltrosAlumno } from '../components/FiltrosAlumnos'
import TablaAlumnos, { type ModoAccionAlumnos } from '../components/TablaAlumnos'
import { consultarAlumnos, consultarFichaAlumno } from '../services/consultaAlumnosApi'
import type { AlumnoConsulta as Alumno } from '../types/AlumnoConsulta'
import '../styles/alumnos.css'

const FILTROS_INICIALES: FiltrosAlumno = {
  busqueda: '',
  grado: 'Todos',
  grupo: 'Todos',
  estado: 'Todos',
}

export type ModoPaginaAlumnos = 'consulta' | 'editar' | 'tutor' | 'expediente'

interface ConsultarAlumnosProps {
  alNuevoAlumno?: () => void
  alRegistrarTutor?: (alumno: Alumno) => void
  alAbrirExpediente?: (alumno: Alumno) => void
  modo?: ModoPaginaAlumnos
}

const CONFIGURACION_MODO: Record<
  ModoPaginaAlumnos,
  { titulo: string; descripcion: string; accion: ModoAccionAlumnos }
> = {
  consulta: {
    titulo: 'Alumnos',
    descripcion: 'Consulta, búsqueda y administración de alumnos registrados',
    accion: 'completo',
  },
  editar: {
    titulo: 'Editar alumno',
    descripcion: 'Busca y selecciona el alumno cuya información deseas editar',
    accion: 'editar',
  },
  tutor: {
    titulo: 'Registrar tutor',
    descripcion: 'Busca y selecciona el alumno al que deseas registrar un tutor',
    accion: 'tutor',
  },
  expediente: {
    titulo: 'Expediente digital',
    descripcion: 'Busca y selecciona el alumno cuyo expediente deseas consultar o gestionar',
    accion: 'expediente',
  },
}

export default function ConsultarAlumnos({
  alNuevoAlumno,
  alRegistrarTutor,
  alAbrirExpediente,
  modo = 'consulta',
}: ConsultarAlumnosProps) {
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

  useEffect(() => {
    setAlumnoSeleccionado(null)
    setAlumnoEnEdicion(null)
    setMensaje('')
  }, [modo])

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
    setMensaje('El cambio de estado todavía no está conectado al backend.')
  }

  if (alumnoEnEdicion) {
    return (
      <section className="pagina-alumnos">
        <button
          type="button"
          className="boton-primario-alumnos"
          onClick={() => setAlumnoEnEdicion(null)}
        >
          Volver al listado
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

  const configuracion = CONFIGURACION_MODO[modo]

  return (
    <section className="pagina-alumnos">
      <header className="pagina-alumnos__encabezado">
        <div>
          <h1>{configuracion.titulo}</h1>
          <p>{configuracion.descripcion}</p>
        </div>

        {modo === 'consulta' && (
          <button
            className="boton-primario-alumnos"
            type="button"
            onClick={() => alNuevoAlumno?.()}
          >
            + Nuevo alumno
          </button>
        )}
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
          modoAccion={configuracion.accion}
        />
      </section>

      <aside className="aviso-alumnos">
        {modo === 'consulta'
          ? 'La búsqueda y los filtros corresponden a HU-1.3 y permiten localizar alumnos por nombre, CURP, grado, grupo y estado.'
          : 'Utiliza los filtros para localizar al alumno y después selecciona la acción disponible en la tabla.'}
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

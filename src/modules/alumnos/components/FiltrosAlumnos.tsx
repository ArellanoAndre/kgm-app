import type { FormEvent } from 'react'
import type { EstadoAlumno } from '../types/Alumno'

export type FiltrosAlumno = {
  busqueda: string
  grado: string
  grupo: string
  estado: EstadoAlumno | 'Todos'
}

type Propiedades = {
  filtros: FiltrosAlumno
  grados: string[]
  grupos: string[]
  alCambiar: (filtros: FiltrosAlumno) => void
  alBuscar: () => void
}

function IconoBusqueda() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function IconoFiltro() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24">
      <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />
    </svg>
  )
}

export default function FiltrosAlumnos({
  filtros,
  grados,
  grupos,
  alCambiar,
  alBuscar,
}: Propiedades) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    alBuscar()
  }

  return (
    <form className="filtros-alumnos" onSubmit={manejarEnvio}>
      <label className="filtros-alumnos__busqueda">
        <IconoBusqueda />
        <input
          aria-label="Buscar alumno por nombre o CURP"
          placeholder="Buscar por nombre o CURP"
          type="search"
          value={filtros.busqueda}
          onChange={(evento) =>
            alCambiar({ ...filtros, busqueda: evento.target.value })
          }
        />
      </label>

      <label className="filtros-alumnos__selector">
        <span className="visualmente-oculto">Filtrar por grado</span>
        <select
          value={filtros.grado}
          onChange={(evento) =>
            alCambiar({ ...filtros, grado: evento.target.value })
          }
        >
          <option value="Todos">Grado: Todos</option>
          {grados.map((grado) => (
            <option key={grado} value={grado}>Grado: {grado}</option>
          ))}
        </select>
      </label>

      <label className="filtros-alumnos__selector">
        <span className="visualmente-oculto">Filtrar por grupo</span>
        <select
          value={filtros.grupo}
          onChange={(evento) =>
            alCambiar({ ...filtros, grupo: evento.target.value })
          }
        >
          <option value="Todos">Grupo: Todos</option>
          {grupos.map((grupo) => (
            <option key={grupo} value={grupo}>Grupo: {grupo}</option>
          ))}
        </select>
      </label>

      <label className="filtros-alumnos__selector">
        <span className="visualmente-oculto">Filtrar por estado</span>
        <select
          value={filtros.estado}
          onChange={(evento) =>
            alCambiar({
              ...filtros,
              estado: evento.target.value as FiltrosAlumno['estado'],
            })
          }
        >
          <option value="Todos">Estado: Todos</option>
          <option value="Activo">Estado: Activo</option>
          <option value="Baja">Estado: Baja</option>
          <option value="Egresado">Estado: Egresado</option>
        </select>
      </label>

      <button className="filtros-alumnos__buscar" type="submit">
        <IconoFiltro />
        <span>Buscar</span>
      </button>
    </form>
  )
}

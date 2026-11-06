import type { FormEvent } from 'react'
import type { EstadoDocente } from '../types/Docente'

type PropiedadesFiltrosDocentes = {
  nombre: string
  estado: EstadoDocente | 'Todos'
  alCambiarNombre: (nombre: string) => void
  alCambiarEstado: (estado: EstadoDocente | 'Todos') => void
  alBuscar: () => void
}

function IconoBusqueda() {
  return (
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
  )
}

function IconoFiltro() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />
    </svg>
  )
}

function FiltrosDocentes({
  nombre,
  estado,
  alCambiarNombre,
  alCambiarEstado,
  alBuscar,
}: PropiedadesFiltrosDocentes) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    alBuscar()
  }

  return (
    <form className="filtros-docentes" onSubmit={manejarEnvio}>
      <label className="filtros-docentes__busqueda">
        <IconoBusqueda />
        <input
          aria-label="Buscar docente por nombre"
          onChange={(evento) => alCambiarNombre(evento.target.value)}
          placeholder="Buscar por nombre"
          type="search"
          value={nombre}
        />
      </label>

      <label className="filtros-docentes__estado">
        <span className="visualmente-oculto">Filtrar por estado</span>
        <select
          onChange={(evento) => {
            const valor = evento.target.value
            if (valor === 'Todos' || valor === 'Activo' || valor === 'Inactivo') {
              alCambiarEstado(valor)
            }
          }}
          value={estado}
        >
          <option value="Todos">Estado: Todos</option>
          <option value="Activo">Estado: Activo</option>
          <option value="Inactivo">Estado: Inactivo</option>
        </select>
      </label>

      <button className="filtros-docentes__boton" type="submit">
        <IconoFiltro />
        <span>Buscar</span>
      </button>
    </form>
  )
}

export default FiltrosDocentes
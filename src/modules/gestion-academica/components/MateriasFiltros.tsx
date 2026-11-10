import React from 'react'
import type { GradoMateria } from '../types/Materia'

type PropiedadesMateriasFiltros = {
  busqueda: string
  alCambiarBusqueda: (valor: string) => void
  gradoSeleccionado: string
  grados: GradoMateria[]
  alCambiarGrado: (valor: string) => void
}

export const MateriasFiltros: React.FC<PropiedadesMateriasFiltros> = ({
  busqueda,
  alCambiarBusqueda,
  gradoSeleccionado,
  grados,
  alCambiarGrado,
}) => (
  <div className="table-filters">
    <input
      aria-label="Buscar materia por nombre"
      className="input-search"
      onChange={(evento) => alCambiarBusqueda(evento.target.value)}
      placeholder="Buscar materia por nombre"
      type="search"
      value={busqueda}
    />

    <select
      aria-label="Filtrar materias por grado"
      className="select-filter"
      onChange={(evento) => alCambiarGrado(evento.target.value)}
      value={gradoSeleccionado}
    >
      <option value="Todos">Grado: Todos</option>
      {grados.map((grado) => (
        <option key={grado.id} value={grado.id}>
          Grado: {grado.nombre}
        </option>
      ))}
    </select>
  </div>
)

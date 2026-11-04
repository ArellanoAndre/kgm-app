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

export default function FiltrosAlumnos({
  filtros,
  grados,
  grupos,
  alCambiar,
  alBuscar,
}: Propiedades) {
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    alBuscar()
  }

  return (
    <form className="filtros-alumnos" onSubmit={enviar}>
      <input
        aria-label="Buscar alumno"
        placeholder="Buscar por nombre o CURP"
        value={filtros.busqueda}
        onChange={(e) => alCambiar({ ...filtros, busqueda: e.target.value })}
      />

      <select
        aria-label="Filtrar por grado"
        value={filtros.grado}
        onChange={(e) => alCambiar({ ...filtros, grado: e.target.value })}
      >
        <option value="Todos">Grado: Todos</option>
        {grados.map((grado) => (
          <option key={grado} value={grado}>{grado}</option>
        ))}
      </select>

      <select
        aria-label="Filtrar por grupo"
        value={filtros.grupo}
        onChange={(e) => alCambiar({ ...filtros, grupo: e.target.value })}
      >
        <option value="Todos">Grupo: Todos</option>
        {grupos.map((grupo) => (
          <option key={grupo} value={grupo}>{grupo}</option>
        ))}
      </select>

      <select
        aria-label="Filtrar por estado"
        value={filtros.estado}
        onChange={(e) =>
          alCambiar({
            ...filtros,
            estado: e.target.value as FiltrosAlumno['estado'],
          })
        }
      >
        <option value="Todos">Estado: Todos</option>
        <option value="Activo">Activo</option>
        <option value="Baja">Baja</option>
        <option value="Egresado">Egresado</option>
      </select>

      <button type="submit" className="filtros-alumnos__buscar">
        Buscar
      </button>
    </form>
  )
}

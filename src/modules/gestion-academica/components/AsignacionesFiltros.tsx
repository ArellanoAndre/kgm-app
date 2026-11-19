import type { OpcionesAsignacionAcademica } from '../types/AsignacionAcademica'

type PropiedadesAsignacionesFiltros = {
  busqueda: string
  alCambiarBusqueda: (valor: string) => void
  ciclos: OpcionesAsignacionAcademica['ciclos']
  grados: OpcionesAsignacionAcademica['grados']
  materias: OpcionesAsignacionAcademica['materias']
  grupos: OpcionesAsignacionAcademica['grupos']
  cicloSeleccionado: string
  gradoSeleccionado: string
  materiaSeleccionada: string
  grupoSeleccionado: string
  alCambiarCiclo: (valor: string) => void
  alCambiarGrado: (valor: string) => void
  alCambiarMateria: (valor: string) => void
  alCambiarGrupo: (valor: string) => void
}

export function AsignacionesFiltros({
  busqueda,
  alCambiarBusqueda,
  ciclos,
  grados,
  materias,
  grupos,
  cicloSeleccionado,
  gradoSeleccionado,
  materiaSeleccionada,
  grupoSeleccionado,
  alCambiarCiclo,
  alCambiarGrado,
  alCambiarMateria,
  alCambiarGrupo,
}: PropiedadesAsignacionesFiltros) {
  const nombresGrado = new Map(
    grados.map((grado) => [grado.id, grado.nombre]),
  )

  return (
    <div className="table-filters asignaciones-filtros">
      <div className="asignaciones-filtros__fila">
        <input
          aria-label="Buscar docente por nombre o CURP"
          className="input-search"
          onChange={(evento) => alCambiarBusqueda(evento.target.value)}
          placeholder="Buscar docente por nombre o CURP"
          type="search"
          value={busqueda}
        />
      </div>

      <div className="asignaciones-filtros__fila">
        <select
          aria-label="Filtrar asignaciones por ciclo escolar"
          className="select-filter"
          onChange={(evento) => alCambiarCiclo(evento.target.value)}
          value={cicloSeleccionado}
        >
          <option value="Todos">Ciclo: Todos</option>
          {ciclos.map((ciclo) => (
            <option key={ciclo.id} value={ciclo.id}>
              Ciclo: {ciclo.nombre}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar asignaciones por grado"
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

        <select
          aria-label="Filtrar asignaciones por materia"
          className="select-filter"
          onChange={(evento) => alCambiarMateria(evento.target.value)}
          value={materiaSeleccionada}
        >
          <option value="Todos">Materia: Todas</option>
          {materias.map((materia) => (
            <option key={materia.id} value={materia.id}>
              Materia: {materia.nombre} ({materia.clave})
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar asignaciones por grupo"
          className="select-filter"
          onChange={(evento) => alCambiarGrupo(evento.target.value)}
          value={grupoSeleccionado}
        >
          <option value="Todos">Grupo: Todos</option>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              Grupo: {nombresGrado.get(grupo.gradoId) ?? ''} {grupo.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

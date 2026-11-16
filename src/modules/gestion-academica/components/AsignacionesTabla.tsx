import type { AsignacionAcademica } from '../types/AsignacionAcademica'

type PropiedadesAsignacionesTabla = {
  asignaciones: AsignacionAcademica[]
  alVer: (asignacion: AsignacionAcademica) => void
  alEditar: (asignacion: AsignacionAcademica) => void
}

function obtenerIniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function AsignacionesTabla({
  asignaciones,
  alVer,
  alEditar,
}: PropiedadesAsignacionesTabla) {
  return (
    <table className="academico-table">
      <thead>
        <tr>
          <th>Docente</th>
          <th>Ciclo escolar</th>
          <th>Grupo</th>
          <th>Materia</th>
          <th>Grado</th>
          <th style={{ textAlign: 'right' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {asignaciones.length > 0 ? (
          asignaciones.map((asignacion) => (
            <tr key={asignacion.id}>
              <td>
                <div className="asignacion-docente">
                  {asignacion.docenteFoto ? (
                    <img
                      alt={`Foto de ${asignacion.docente}`}
                      className="asignacion-docente__foto"
                      src={asignacion.docenteFoto}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="asignacion-docente__foto-vacia"
                    >
                      {obtenerIniciales(asignacion.docente)}
                    </span>
                  )}
                  <span className="asignacion-docente__datos">
                    <span className="asignacion-docente__nombre">
                      {asignacion.docente}
                    </span>
                    <span className="asignacion-docente__curp">
                      CURP {asignacion.docenteCurp}
                    </span>
                  </span>
                </div>
              </td>
              <td>{asignacion.cicloEscolar}</td>
              <td>
                <strong>{asignacion.grupo}</strong>
              </td>
              <td>{asignacion.materia}</td>
              <td>{asignacion.grado}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  aria-label={`Ver asignación de ${asignacion.docente}`}
                  className="action-link"
                  onClick={() => alVer(asignacion)}
                  type="button"
                >
                  Ver
                </button>
                <button
                  aria-label={`Editar asignación de ${asignacion.docente}`}
                  className="action-link"
                  onClick={() => alEditar(asignacion)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  aria-label={`Más opciones de la asignación de ${asignacion.docente}`}
                  className="action-link"
                  disabled
                  title="Disponible próximamente"
                  type="button"
                >
                  Más opciones
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="asignaciones-tabla__vacia" colSpan={6}>
              No se encontraron asignaciones con los filtros seleccionados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

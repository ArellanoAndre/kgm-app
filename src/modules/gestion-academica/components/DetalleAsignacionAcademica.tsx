import type { AsignacionAcademica } from '../types/AsignacionAcademica'

type PropiedadesDetalleAsignacion = {
  asignacion: AsignacionAcademica
}

function obtenerIniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function DetalleAsignacionAcademica({
  asignacion,
}: PropiedadesDetalleAsignacion) {
  return (
    <div className="asignaciones-detalle">
      <div className="asignaciones-detalle__docente">
        {asignacion.docenteFoto ? (
          <img
            alt={`Foto de ${asignacion.docente}`}
            className="asignaciones-detalle__foto"
            src={asignacion.docenteFoto}
          />
        ) : (
          <span
            aria-hidden="true"
            className="asignaciones-detalle__foto-vacia"
          >
            {obtenerIniciales(asignacion.docente)}
          </span>
        )}
        <div>
          <strong>{asignacion.docente}</strong>
          <span>CURP {asignacion.docenteCurp}</span>
        </div>
      </div>

      <dl className="asignaciones-detalle__datos">
        <div className="asignaciones-detalle__dato">
          <dt>Ciclo escolar</dt>
          <dd>{asignacion.cicloEscolar}</dd>
        </div>
        <div className="asignaciones-detalle__dato">
          <dt>Grado</dt>
          <dd>{asignacion.grado}</dd>
        </div>
        <div className="asignaciones-detalle__dato">
          <dt>Grupo</dt>
          <dd>{asignacion.grupo}</dd>
        </div>
        <div className="asignaciones-detalle__dato">
          <dt>Materia</dt>
          <dd>{asignacion.materia}</dd>
        </div>
        <div className="asignaciones-detalle__dato">
          <dt>Clave de materia</dt>
          <dd>{asignacion.claveMateria}</dd>
        </div>
        <div className="asignaciones-detalle__dato">
          <dt>Estado</dt>
          <dd>{asignacion.activo ? 'Activa' : 'Inactiva'}</dd>
        </div>
      </dl>
    </div>
  )
}

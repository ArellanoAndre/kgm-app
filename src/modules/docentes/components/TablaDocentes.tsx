import type { Docente } from '../types/Docente'

type PropiedadesTablaDocentes = {
  docentes: Docente[]
  alVer: (docente: Docente) => void
  alEditar: (docente: Docente) => void
  alCambiarEstado: (docente: Docente) => void
}

function TablaDocentes({
  docentes,
  alVer,
  alEditar,
  alCambiarEstado,
}: PropiedadesTablaDocentes) {
  if (docentes.length === 0) {
    return (
      <p className="tabla-docentes__vacio">
        No hay docentes que coincidan con los filtros.
      </p>
    )
  }

  return (
    <div className="tabla-docentes__desplazamiento">
      <table className="tabla-docentes">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">CURP</th>
            <th scope="col">Correo electrónico</th>
            <th scope="col">Estado</th>
            <th scope="col">Asignaciones</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id}>
              <td>
                <span className="tabla-docentes__nombre">{docente.nombre}</span>
                <span className="tabla-docentes__ciclo">{docente.ciclo}</span>
              </td>
              <td className="tabla-docentes__dato">{docente.curp}</td>
              <td className="tabla-docentes__dato">{docente.correo}</td>
              <td>
                <span
                  className={`insignia-estado insignia-estado--${docente.estado.toLowerCase()}`}
                >
                  {docente.estado}
                </span>
              </td>
              <td className="tabla-docentes__dato">
                {docente.asignacion ?? '—'}
              </td>
              <td>
                <div className="tabla-docentes__acciones">
                  <button onClick={() => alVer(docente)} type="button">
                    Ver
                  </button>
                  <button onClick={() => alEditar(docente)} type="button">
                    Editar
                  </button>
                  <details className="tabla-docentes__mas-opciones">
                    <summary>Más opciones</summary>
                    <button onClick={() => alCambiarEstado(docente)} type="button">
                      {docente.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </details>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaDocentes
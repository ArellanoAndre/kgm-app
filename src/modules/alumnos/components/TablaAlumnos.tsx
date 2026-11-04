import type { Alumno } from '../types/Alumno'

type Propiedades = {
  alumnos: Alumno[]
  alVer: (alumno: Alumno) => void
  alEditar: (alumno: Alumno) => void
  alCambiarEstado: (alumno: Alumno) => void
}

export default function TablaAlumnos({
  alumnos,
  alVer,
  alEditar,
  alCambiarEstado,
}: Propiedades) {
  if (alumnos.length === 0) {
    return (
      <p className="tabla-alumnos__vacio">
        No hay alumnos que coincidan con los filtros.
      </p>
    )
  }

  return (
    <div className="tabla-alumnos__contenedor">
      <table className="tabla-alumnos">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">CURP</th>
            <th scope="col">Grado</th>
            <th scope="col">Grupo</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map((alumno) => {
            const nombreCompleto = [
              alumno.nombre,
              alumno.apellidoPaterno,
              alumno.apellidoMaterno,
            ].filter(Boolean).join(' ')

            const tutor = alumno.tutores.find((item) => item.esPrincipal)

            const nombreTutor = tutor
              ? `${tutor.parentesco}: ${[
                  tutor.nombre,
                  tutor.apellidoPaterno,
                  tutor.apellidoMaterno,
                ].filter(Boolean).join(' ')}`
              : 'Sin tutor asignado'

            return (
              <tr key={alumno.id}>
                <td>
                  <span className="tabla-alumnos__nombre">
                    {nombreCompleto}
                  </span>
                  <span className="tabla-alumnos__tutor">
                    {nombreTutor}
                  </span>
                </td>

                <td className="tabla-alumnos__dato">{alumno.curp}</td>
                <td className="tabla-alumnos__dato">{alumno.grado}</td>
                <td className="tabla-alumnos__dato">{alumno.grupo}</td>

                <td>
                  <span
                    className={`estado-alumno estado-alumno--${alumno.estado.toLowerCase()}`}
                  >
                    {alumno.estado}
                  </span>
                </td>

                <td>
                  <div className="tabla-alumnos__acciones">
                    <button type="button" onClick={() => alVer(alumno)}>
                      Ver
                    </button>

                    <button type="button" onClick={() => alEditar(alumno)}>
                      Editar
                    </button>

                    <details className="tabla-alumnos__mas-opciones">
                      <summary>Más opciones</summary>

                      {alumno.estado !== 'Egresado' && (
                        <button
                          type="button"
                          onClick={() => alCambiarEstado(alumno)}
                        >
                          {alumno.estado === 'Activo'
                            ? 'Dar de baja'
                            : 'Reactivar'}
                        </button>
                      )}

                      {alumno.estado === 'Egresado' && (
                        <span className="tabla-alumnos__sin-opciones">
                          Sin acciones disponibles
                        </span>
                      )}
                    </details>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

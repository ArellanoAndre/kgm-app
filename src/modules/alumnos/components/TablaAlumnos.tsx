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
    return <p className="tabla-alumnos__vacio">No se encontraron alumnos.</p>
  }

  return (
    <div className="tabla-alumnos__contenedor">
      <table className="tabla-alumnos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CURP</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => {
            const nombreCompleto = [
              alumno.nombre,
              alumno.apellidoPaterno,
              alumno.apellidoMaterno,
            ].filter(Boolean).join(' ')

            const tutorPrincipal = alumno.tutores.find((t) => t.esPrincipal)

            return (
              <tr key={alumno.id}>
                <td>
                  <strong>{nombreCompleto}</strong>
                  <small>
                    {tutorPrincipal
                      ? `${tutorPrincipal.parentesco}: ${tutorPrincipal.nombre} ${tutorPrincipal.apellidoPaterno}`
                      : 'Sin tutor asignado'}
                  </small>
                </td>
                <td>{alumno.curp}</td>
                <td>{alumno.grado}</td>
                <td>{alumno.grupo}</td>
                <td>
                  <span className={`estado-alumno estado-alumno--${alumno.estado.toLowerCase()}`}>
                    {alumno.estado}
                  </span>
                </td>
                <td>
                  <div className="tabla-alumnos__acciones">
                    <button type="button" onClick={() => alVer(alumno)}>Ver</button>
                    <button type="button" onClick={() => alEditar(alumno)}>Editar</button>
                    <button type="button" onClick={() => alCambiarEstado(alumno)}>
                      Más opciones
                    </button>
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

import { useState } from 'react'
import '../styles/usuarios.css'

type Rol = 'Administrador' | 'Docente' | 'Tutor'
type Accion = 'consultar' | 'crear' | 'editar' | 'eliminar'

type Permisos = Record<string, Record<Accion, boolean>>

const modulos = [
  'Alumnos',
  'Gestión académica',
  'Docentes',
  'Calificaciones',
  'Reportes',
  'Usuarios',
]

const acciones: Accion[] = ['consultar', 'crear', 'editar', 'eliminar']

const observaciones = [
  'No permite eliminar registros de alumnos.',
  'Puede crear y editar configuraciones del ciclo escolar.',
  'Solo puede editar perfiles activos.',
  'Puede registrar y editar calificaciones del periodo.',
  'Solo puede consultar reportes generales.',
  'Puede crear, editar y asignar roles.',
]

const permisosIniciales: Permisos = Object.fromEntries(
  modulos.map((modulo) => [
    modulo,
    {
      consultar: true,
      crear: !['Reportes'].includes(modulo),
      editar: !['Reportes'].includes(modulo),
      eliminar: modulo === 'Usuarios',
    },
  ]),
) as Permisos

const roles: Rol[] = ['Administrador', 'Docente', 'Tutor']

function ControlAcceso() {
  const [rolActivo, setRolActivo] = useState<Rol>('Administrador')
  const [permisosPorRol, setPermisosPorRol] = useState<Record<Rol, Permisos>>({
    Administrador: structuredClone(permisosIniciales),
    Docente: structuredClone(permisosIniciales),
    Tutor: structuredClone(permisosIniciales),
  })
  const [mensaje, setMensaje] = useState('')

  function cambiarPermiso(modulo: string, accion: Accion) {
    setPermisosPorRol((actuales) => ({
      ...actuales,
      [rolActivo]: {
        ...actuales[rolActivo],
        [modulo]: {
          ...actuales[rolActivo][modulo],
          [accion]: !actuales[rolActivo][modulo][accion],
        },
      },
    }))
    setMensaje('')
  }

  return (
    <section className="pagina-acceso">
      <header className="pagina-acceso__encabezado">
        <div>
          <h1>Control de acceso</h1>
          <p>Administra permisos por rol y configura qué funcionalidades pueden consultar, crear, editar o eliminar.</p>
        </div>
        <button className="acceso-boton-primario" type="button" disabled>
          Guardar cambios
        </button>
      </header>

      <div className="acceso-panel">
        <h2>Selecciona el rol</h2>
        <p>Elige el perfil para ver y editar la matriz de permisos vigente.</p>
        <div className="acceso-roles">
          {roles.map((rol) => (
            <button
              key={rol}
              type="button"
              className={`acceso-rol ${rolActivo === rol ? 'acceso-rol--activo' : ''}`}
              onClick={() => {
                setRolActivo(rol)
                setMensaje('')
              }}
            >
              <strong>{rol}</strong>
              <small>{rol === 'Administrador' ? 'Ana Estrada Soto (AES)' : rol === 'Docente' ? 'Elena Cruz Sánchez' : 'Juan García'}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="acceso-tabla-contenedor">
        <table className="acceso-tabla">
          <thead>
            <tr>
              <th>Módulo</th>
              {acciones.map((accion) => <th key={accion}>{accion}</th>)}
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {modulos.map((modulo, indice) => (
              <tr key={modulo}>
                <td><strong>{modulo}</strong></td>
                {acciones.map((accion) => (
                  <td key={accion}>
                    <button
                      type="button"
                      className={`acceso-permiso ${permisosPorRol[rolActivo][modulo][accion] ? 'acceso-permiso--si' : ''}`}
                      onClick={() => cambiarPermiso(modulo, accion)}
                      aria-label={`${accion} en ${modulo}`}
                      aria-pressed={permisosPorRol[rolActivo][modulo][accion]}
                    >
                      {permisosPorRol[rolActivo][modulo][accion] ? 'Sí' : 'No'} ▾
                    </button>
                  </td>
                ))}
                <td className="acceso-observacion">{observaciones[indice]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="acceso-panel acceso-panel--aviso">
        <h2>Acceso restringido</h2>
        <p>Ejemplo: un docente o tutor que intente configurar permisos verá «Acceso denegado». Solo el administrador puede guardar.</p>
      </div>

      <footer className="acceso-pie">
        <p>Vista de demostración. Los cambios no se guardan ni modifican permisos reales.</p>
        <div>
          <button
            className="acceso-boton-secundario"
            type="button"
            onClick={() => {
              setPermisosPorRol({
                Administrador: structuredClone(permisosIniciales),
                Docente: structuredClone(permisosIniciales),
                Tutor: structuredClone(permisosIniciales),
              })
              setMensaje('Cambios visuales descartados.')
            }}
          >
            Cancelar
          </button>
          <button className="acceso-boton-primario" type="button" disabled>
            Guardar cambios
          </button>
        </div>
      </footer>
      {mensaje && <p role="status">{mensaje}</p>}
    </section>
  )
}

export default ControlAcceso

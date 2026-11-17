import '../styles/usuariosRegistro.css'

const ROLES = [
  {
    nombre: 'Tutor',
    descripcion: 'Consulta la información vinculada a sus alumnos.',
    inicial: 'T',
  },
  {
    nombre: 'Docente',
    descripcion: 'Accede a las funciones académicas asignadas.',
    inicial: 'D',
  },
  {
    nombre: 'Administrador escolar',
    descripcion: 'Gestiona la configuración y los accesos de la escuela.',
    inicial: 'A',
  },
]

export default function GestionRoles() {
  return (
    <section aria-labelledby="gestion-roles-titulo" className="pagina-usuarios">
      <header className="pagina-usuarios__encabezado">
        <div>
          <p className="pagina-usuarios__ceja">Usuarios / Roles</p>
          <h1 id="gestion-roles-titulo">Asignación y gestión de roles</h1>
          <p>Consulta los perfiles previstos para los usuarios de la escuela.</p>
        </div>
      </header>

      <div className="usuario-aviso" role="note">
        <strong>Gestión pendiente de conexión</strong>
        <p>
          Esta sección queda preparada visualmente. La asignación y modificación de permisos
          requiere endpoints y reglas de autorización en el backend.
        </p>
      </div>

      <div className="roles-resumen">
        {ROLES.map((rol) => (
          <article className="roles-resumen__tarjeta" key={rol.nombre}>
            <span aria-hidden="true">{rol.inicial}</span>
            <div>
              <h2>{rol.nombre}</h2>
              <p>{rol.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  cerrarSesionUsuario,
  crearUsuario as enviarCrearUsuario,
  iniciarSesionUsuario,
  obtenerPerfilesDisponibles,
  obtenerSesionUsuario,
  UsuarioApiError,
  type PerfilDisponible,
  type SesionUsuario,
} from '../services/usuariosServicio'
import '../styles/usuariosRegistro.css'

type RolFormulario = 'docente' | 'tutor' | 'administrador'
type EstadoCarga = 'inactivo' | 'cargando' | 'listo' | 'error'

type DatosAdministrador = {
  nombre: string
  correo: string
  telefono: string
  contrasena: string
  foto: File | null
}

const ADMINISTRADOR_VACIO: DatosAdministrador = {
  nombre: '',
  correo: '',
  telefono: '',
  contrasena: '',
  foto: null,
}

const ROLES: { id: RolFormulario; nombre: string; descripcion: string }[] = [
  {
    id: 'docente',
    nombre: 'Docente',
    descripcion: 'Habilita el acceso a un docente ya registrado.',
  },
  {
    id: 'tutor',
    nombre: 'Tutor',
    descripcion: 'Habilita el acceso a un tutor ya registrado.',
  },
  {
    id: 'administrador',
    nombre: 'Administrador escolar',
    descripcion: 'Crea un perfil y acceso nuevos para la escuela.',
  },
]

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toLocaleUpperCase()
}

export default function CrearUsuario() {
  const [sesion, setSesion] = useState<SesionUsuario | null>(
    obtenerSesionUsuario(),
  )
  const [rol, setRol] = useState<RolFormulario | null>(null)
  const [perfiles, setPerfiles] = useState<PerfilDisponible[]>([])
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>('inactivo')
  const [errorCarga, setErrorCarga] = useState('')
  const [perfilId, setPerfilId] = useState('')
  const [contrasenaPerfil, setContrasenaPerfil] = useState('')
  const [correoLogin, setCorreoLogin] = useState('')
  const [contrasenaLogin, setContrasenaLogin] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [iniciandoSesion, setIniciandoSesion] = useState(false)
  const [datosAdministrador, setDatosAdministrador] =
    useState<DatosAdministrador>(ADMINISTRADOR_VACIO)
  const [mensaje, setMensaje] = useState('')
  const [registroExitoso, setRegistroExitoso] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorFoto, setErrorFoto] = useState('')
  const [fotoVista, setFotoVista] = useState('')

  useEffect(() => {
    return () => {
      if (fotoVista) URL.revokeObjectURL(fotoVista)
    }
  }, [fotoVista])

  useEffect(() => {
    if (!sesion || (rol !== 'docente' && rol !== 'tutor')) {
      return
    }

    let vigente = true
    const rolApi = rol === 'docente' ? 'DOCENTE' : 'TUTOR'
    obtenerPerfilesDisponibles(rolApi)
      .then((resultado) => {
        if (!vigente) return
        setPerfiles(resultado)
        setEstadoCarga('listo')
      })
      .catch((error: unknown) => {
        if (!vigente) return
        if (error instanceof UsuarioApiError && error.status === 401) {
          cerrarSesionUsuario()
          setSesion(null)
          setErrorLogin('La sesión expiró. Inicia sesión de nuevo.')
        }
        setErrorCarga(
          error instanceof Error
            ? error.message
            : 'No fue posible consultar los perfiles.',
        )
        setEstadoCarga('error')
      })

    return () => {
      vigente = false
    }
  }, [rol, sesion])

  const personaSeleccionada = perfiles.find(
    (perfil) => String(perfil.id) === perfilId,
  )
  const nombrePersona = personaSeleccionada?.nombreCompleto ?? ''
  const correoPersona = personaSeleccionada?.correo ?? ''
  const perfilFoto = personaSeleccionada?.foto ?? null

  async function iniciarSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErrorLogin('')
    setIniciandoSesion(true)
    try {
      const usuario = await iniciarSesionUsuario(correoLogin, contrasenaLogin)
      setSesion(usuario)
      setContrasenaLogin('')
    } catch (error: unknown) {
      setErrorLogin(
        error instanceof Error
          ? error.message
          : 'No fue posible iniciar sesión.',
      )
    } finally {
      setIniciandoSesion(false)
    }
  }

  function cerrarSesion() {
    cerrarSesionUsuario()
    setSesion(null)
    setRol(null)
    setPerfilId('')
    setPerfiles([])
    setContrasenaPerfil('')
    setDatosAdministrador(ADMINISTRADOR_VACIO)
    setMensaje('')
    setRegistroExitoso(false)
    setEstadoCarga('inactivo')
  }

  function seleccionarRol(nuevoRol: RolFormulario) {
    if (rol === nuevoRol) return
    setRol(nuevoRol)
    setPerfilId('')
    setContrasenaPerfil('')
    setPerfiles([])
    setDatosAdministrador(ADMINISTRADOR_VACIO)
    setMensaje('')
    setRegistroExitoso(false)
    setErrorFoto('')
    setFotoVista('')
    setErrorCarga('')
    setEstadoCarga(
      nuevoRol === 'docente' || nuevoRol === 'tutor'
        ? 'cargando'
        : 'inactivo',
    )
  }

  function cancelar() {
    setRol(null)
    setPerfilId('')
    setContrasenaPerfil('')
    setDatosAdministrador(ADMINISTRADOR_VACIO)
    setMensaje('')
    setErrorFoto('')
    setFotoVista('')
    setErrorCarga('')
    setEstadoCarga('inactivo')
  }

  function manejarFoto(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
      setErrorFoto('Selecciona una imagen JPG, PNG o WebP.')
      return
    }
    if (archivo.size > 2 * 1024 * 1024) {
      setErrorFoto('La imagen debe pesar 2 MB o menos.')
      return
    }

    setDatosAdministrador((actuales) => ({ ...actuales, foto: archivo }))
    setFotoVista(URL.createObjectURL(archivo))
    setErrorFoto('')
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setMensaje('')
    setRegistroExitoso(false)

    if (rol === 'docente' || rol === 'tutor') {
      if (!personaSeleccionada) {
        setMensaje('Selecciona un perfil registrado antes de continuar.')
        return
      }
      if (!contrasenaPerfil) {
        setMensaje('Escribe la contraseña temporal para continuar.')
        return
      }
      if (contrasenaPerfil.length < 12) {
        setMensaje('La contraseña inicial debe tener al menos 12 caracteres.')
        return
      }
    }

    if (rol === 'administrador') {
      if (!datosAdministrador.nombre.trim() || !datosAdministrador.correo.trim()) {
        setMensaje('Completa el nombre y el correo institucional.')
        return
      }
      if (!datosAdministrador.contrasena) {
        setMensaje('Escribe una contraseña temporal para continuar.')
        return
      }
      if (datosAdministrador.contrasena.length < 12) {
        setMensaje('La contraseña inicial debe tener al menos 12 caracteres.')
        return
      }
    }

    setGuardando(true)
    try {
      const creado =
        rol === 'administrador'
          ? await enviarCrearUsuario({
              rol: 'ADMINISTRADOR',
              nombre: datosAdministrador.nombre,
              email: datosAdministrador.correo,
              telefono: datosAdministrador.telefono,
              password: datosAdministrador.contrasena,
              foto: datosAdministrador.foto,
            })
          : await enviarCrearUsuario({
              rol: rol === 'docente' ? 'DOCENTE' : 'TUTOR',
              perfilId: Number(perfilId),
              password: contrasenaPerfil,
            })

      setRegistroExitoso(true)
      setMensaje(
        `Usuario ${creado.email} registrado correctamente con rol ${creado.rol.toLocaleLowerCase()}.`,
      )
      setPerfilId('')
      setContrasenaPerfil('')
      setDatosAdministrador(ADMINISTRADOR_VACIO)
      setFotoVista('')

      if (rol === 'docente' || rol === 'tutor') {
        try {
          const perfilesActualizados = await obtenerPerfilesDisponibles(
            rol === 'docente' ? 'DOCENTE' : 'TUTOR',
          )
          setPerfiles(perfilesActualizados)
        } catch {
          setEstadoCarga('error')
          setErrorCarga(
            'El usuario se registró, pero no se pudo actualizar la lista. Recarga las opciones para continuar.',
          )
        }
      }
    } catch (error: unknown) {
      if (error instanceof UsuarioApiError && error.status === 401) {
        cerrarSesion()
        setErrorLogin('La sesión expiró. Inicia sesión de nuevo.')
        return
      }
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No fue posible registrar el usuario.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section aria-labelledby="crear-usuario-titulo" className="pagina-usuarios">
      <header className="pagina-usuarios__encabezado">
        <div>
          <p className="pagina-usuarios__ceja">Usuarios / Creación</p>
          <h1 id="crear-usuario-titulo">Crear usuario</h1>
          <p>
            Habilita el acceso a una persona registrada o crea un administrador escolar.
          </p>
        </div>
      </header>

      <>
        {!sesion && (
          <form
            className="usuario-panel usuario-login"
            onSubmit={iniciarSesion}
          >
            <div className="usuario-panel__titulo">
              <div>
                <h2>Inicia sesión como administrador escolar</h2>
                <p>
                  Solo una cuenta de administrador puede consultar perfiles o
                  crear usuarios.
                </p>
              </div>
            </div>
            <div className="usuario-login__rejilla">
              <label className="usuario-campo">
                <span>Correo institucional</span>
                <input
                  autoComplete="username"
                  onChange={(evento) => setCorreoLogin(evento.target.value)}
                  required
                  type="email"
                  value={correoLogin}
                />
              </label>
              <label className="usuario-campo">
                <span>Contraseña</span>
                <input
                  autoComplete="current-password"
                  onChange={(evento) => setContrasenaLogin(evento.target.value)}
                  required
                  type="password"
                  value={contrasenaLogin}
                />
              </label>
            </div>
            {errorLogin && (
              <p className="usuario-mensaje usuario-mensaje--error" role="alert">
                {errorLogin}
              </p>
            )}
            <footer className="usuario-formulario__acciones">
              <button
                className="usuario-boton usuario-boton--primario"
                disabled={iniciandoSesion}
                type="submit"
              >
                {iniciandoSesion ? 'Validando…' : 'Iniciar sesión'}
              </button>
            </footer>
            <div className="usuario-aviso" role="note">
              <strong>¿Es el primer administrador?</strong>
              <p>
                El administrador inicial se aprovisiona una sola vez desde un
                entorno confiable con el secreto de bootstrap del servidor.
                Nunca introduzcas ese secreto en esta pantalla ni lo incluyas
                en el frontend.
              </p>
            </div>
          </form>
        )}

        {sesion?.rol === 'ADMINISTRADOR' && (
          <>
            <div className="usuario-sesion">
              <div>
                <strong>Sesión de administrador</strong>
                <span>{sesion.nombre} · {sesion.email}</span>
              </div>
              <button
                className="usuario-boton usuario-boton--secundario"
                onClick={cerrarSesion}
                type="button"
              >
                Cerrar sesión
              </button>
            </div>

            <section aria-labelledby="crear-usuario-rol" className="usuario-panel">
              <div className="usuario-panel__titulo">
                <div>
                  <h2 id="crear-usuario-rol">1. Selecciona el tipo de usuario</h2>
                  <p>El rol determina qué perfil se vinculará con el nuevo acceso.</p>
                </div>
              </div>

              <div className="usuario-roles">
                {ROLES.map((opcion) => (
                  <button
                    aria-pressed={rol === opcion.id}
                    className={`usuario-rol${rol === opcion.id ? ' usuario-rol--activo' : ''}`}
                    key={opcion.id}
                    onClick={() => seleccionarRol(opcion.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className="usuario-rol__icono">
                      {opcion.id === 'docente' ? 'D' : opcion.id === 'tutor' ? 'T' : 'A'}
                    </span>
                    <span>
                      <strong>{opcion.nombre}</strong>
                      <small>{opcion.descripcion}</small>
                    </span>
                    <span aria-hidden="true" className="usuario-rol__radio" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {sesion?.rol === 'ADMINISTRADOR' && rol && (
          <form className="usuario-panel usuario-formulario" onSubmit={manejarEnvio}>
            <div className="usuario-panel__titulo">
              <div>
                <h2>2. Datos del usuario</h2>
                <p>
                  {rol === 'administrador'
                    ? 'Captura el perfil que se asociará al acceso de administrador escolar.'
                    : 'Selecciona el perfil existente. Sus datos personales se muestran en modo de solo lectura.'}
                </p>
              </div>
              <span className="usuario-etiqueta-rol">
                {ROLES.find((opcion) => opcion.id === rol)?.nombre}
              </span>
            </div>

            {(rol === 'docente' || rol === 'tutor') && (
              <>
                <label className="usuario-campo usuario-campo--completo" htmlFor="usuario-perfil">
                  <span>Perfil registrado <strong aria-hidden="true">*</strong></span>
                  <select
                    disabled={estadoCarga === 'cargando' || estadoCarga === 'error'}
                    id="usuario-perfil"
                    onChange={(evento) => {
                      setPerfilId(evento.target.value)
                      setContrasenaPerfil('')
                      setMensaje('')
                    }}
                    required
                    value={perfilId}
                  >
                    <option value="">
                      {estadoCarga === 'cargando'
                        ? 'Cargando registros…'
                        : `Selecciona un ${rol}`}
                    </option>
                    {perfiles.map((perfil) => (
                      <option key={perfil.id} value={perfil.id}>
                        {perfil.nombreCompleto} · {perfil.correo}
                      </option>
                    ))}
                  </select>
                  {estadoCarga === 'error' && (
                    <small className="usuario-campo__error" role="alert">
                      {errorCarga}
                    </small>
                  )}
                  {estadoCarga === 'listo' && perfiles.length === 0 && (
                    <small className="usuario-campo__ayuda">
                      No hay perfiles activos, con correo y sin cuenta de acceso.
                    </small>
                  )}
                </label>

                {personaSeleccionada && (
                  <>
                    <div className="usuario-perfil">
                      <div className="usuario-perfil__avatar">
                        {perfilFoto ? (
                          <img alt={`Foto de ${nombrePersona}`} src={perfilFoto} />
                        ) : (
                          <span>{iniciales(nombrePersona) || (rol === 'tutor' ? 'T' : 'D')}</span>
                        )}
                      </div>
                      <div>
                        <strong>{nombrePersona}</strong>
                        <span>
                          {rol === 'docente'
                            ? 'Perfil de docente registrado'
                            : 'Perfil de tutor registrado'}
                        </span>
                      </div>
                    </div>

                    <div className="usuario-rejilla">
                      <label className="usuario-campo">
                        <span>Nombre completo</span>
                        <input readOnly value={nombrePersona} />
                      </label>
                      <label className="usuario-campo">
                        <span>Correo institucional</span>
                        <input readOnly type="email" value={correoPersona} />
                      </label>
                      <label className="usuario-campo">
                        <span>CURP</span>
                        <input readOnly value={personaSeleccionada.curp ?? 'No capturada'} />
                      </label>
                      <label className="usuario-campo">
                        <span>Teléfono</span>
                        <input readOnly value={personaSeleccionada.telefono ?? 'No capturado'} />
                      </label>
                      {rol === 'tutor' && (
                        <div className="usuario-foto-pendiente">
                          <strong>Foto de perfil</strong>
                          <span>
                            El modelo actual de tutor no registra una foto; se muestra un avatar inicial.
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {rol === 'administrador' && (
              <>
                <div className="usuario-foto-admin">
                  <div className="usuario-foto-admin__vista">
                    {fotoVista ? (
                      <img alt="Vista previa de la foto de perfil" src={fotoVista} />
                    ) : (
                      <span>{iniciales(datosAdministrador.nombre) || 'A'}</span>
                    )}
                  </div>
                  <div>
                    <strong>Foto de perfil</strong>
                    <p>JPG, PNG o WebP; máximo 2 MB. Se guardará en el almacenamiento del servidor.</p>
                    <label className="usuario-boton usuario-boton--secundario" htmlFor="usuario-foto">
                      Seleccionar imagen
                    </label>
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className="visualmente-oculto"
                      id="usuario-foto"
                      onChange={manejarFoto}
                      type="file"
                    />
                    {errorFoto && (
                      <small className="usuario-campo__error" role="alert">
                        {errorFoto}
                      </small>
                    )}
                  </div>
                </div>

                <div className="usuario-rejilla">
                  <label className="usuario-campo">
                    <span>Nombre completo <strong aria-hidden="true">*</strong></span>
                    <input
                      autoComplete="name"
                      maxLength={255}
                      onChange={(evento) =>
                        setDatosAdministrador((actuales) => ({
                          ...actuales,
                          nombre: evento.target.value,
                        }))
                      }
                      placeholder="Nombre y apellidos"
                      required
                      value={datosAdministrador.nombre}
                    />
                  </label>
                  <label className="usuario-campo">
                    <span>Correo institucional <strong aria-hidden="true">*</strong></span>
                    <input
                      autoComplete="email"
                      maxLength={255}
                      onChange={(evento) =>
                        setDatosAdministrador((actuales) => ({
                          ...actuales,
                          correo: evento.target.value,
                        }))
                      }
                      placeholder="nombre@escuela.edu.mx"
                      required
                      type="email"
                      value={datosAdministrador.correo}
                    />
                  </label>
                  <label className="usuario-campo">
                    <span>Teléfono</span>
                    <input
                      autoComplete="tel"
                      maxLength={50}
                      onChange={(evento) =>
                        setDatosAdministrador((actuales) => ({
                          ...actuales,
                          telefono: evento.target.value,
                        }))
                      }
                      placeholder="Teléfono de contacto"
                      type="tel"
                      value={datosAdministrador.telefono}
                    />
                  </label>
                  <label className="usuario-campo">
                    <span>Contraseña inicial <strong aria-hidden="true">*</strong></span>
                    <input
                      autoComplete="new-password"
                      maxLength={128}
                      minLength={12}
                      onChange={(evento) =>
                        setDatosAdministrador((actuales) => ({
                          ...actuales,
                          contrasena: evento.target.value,
                        }))
                      }
                      placeholder="Mínimo 12 caracteres"
                      required
                      type="password"
                      value={datosAdministrador.contrasena}
                    />
                    <small className="usuario-campo__ayuda">
                      Comparte esta contraseña inicial por un canal seguro.
                    </small>
                  </label>
                </div>
              </>
            )}

            {(personaSeleccionada || rol === 'administrador') && rol !== 'administrador' && (
              <label className="usuario-campo usuario-campo--contrasena">
                <span>Contraseña inicial <strong aria-hidden="true">*</strong></span>
                <input
                  autoComplete="new-password"
                  maxLength={128}
                  minLength={12}
                  onChange={(evento) => setContrasenaPerfil(evento.target.value)}
                  placeholder="Mínimo 12 caracteres"
                  required
                  type="password"
                  value={contrasenaPerfil}
                />
                <small>
                  Comparte la contraseña inicial por un canal seguro. El sistema guarda solo su hash.
                </small>
              </label>
            )}

            <div className="usuario-aviso" role="note">
              <strong>Acceso restringido y correo único</strong>
              <p>
                El servidor valida que la sesión tenga rol Administrador, limita el registro a su escuela
                y rechaza correos duplicados sin crear el usuario. La contraseña nunca se devuelve en la respuesta.
              </p>
            </div>

            {mensaje && (
              <p
                className={`usuario-mensaje${registroExitoso ? ' usuario-mensaje--exito' : ' usuario-mensaje--error'}`}
                role={registroExitoso ? 'status' : 'alert'}
              >
                {mensaje}
              </p>
            )}

            <footer className="usuario-formulario__acciones">
              <button
                className="usuario-boton usuario-boton--secundario"
                disabled={guardando}
                onClick={cancelar}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="usuario-boton usuario-boton--primario"
                disabled={
                  guardando ||
                  (rol !== 'administrador' &&
                    (estadoCarga !== 'listo' || !personaSeleccionada))
                }
                type="submit"
              >
                {guardando ? 'Guardando…' : 'Guardar usuario'}
              </button>
            </footer>
          </form>
        )}
      </>
    </section>
  )
}

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { obtenerDocentes } from '../../docentes/services/docenteServicio'
import type { Docente } from '../../docentes/types/Docente'
import { consultarTutores } from '../../alumnos/services/tutorService'
import type { Tutor } from '../../alumnos/types/Tutor'
import '../styles/usuariosRegistro.css'

type RolUsuario = 'docente' | 'tutor' | 'administrador'
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

const ROLES: { id: RolUsuario; nombre: string; descripcion: string }[] = [
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

function nombreCompletoTutor(tutor: Tutor): string {
  return [tutor.nombre, tutor.apellidoPaterno, tutor.apellidoMaterno]
    .filter(Boolean)
    .join(' ')
}

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
  const [rol, setRol] = useState<RolUsuario | null>(null)
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>('inactivo')
  const [errorCarga, setErrorCarga] = useState('')
  const [perfilId, setPerfilId] = useState('')
  const [contrasenaPerfil, setContrasenaPerfil] = useState('')
  const [datosAdministrador, setDatosAdministrador] =
    useState<DatosAdministrador>(ADMINISTRADOR_VACIO)
  const [mensaje, setMensaje] = useState('')
  const [errorFoto, setErrorFoto] = useState('')
  const [fotoVista, setFotoVista] = useState('')

  useEffect(() => {
    return () => {
      if (fotoVista) URL.revokeObjectURL(fotoVista)
    }
  }, [fotoVista])

  useEffect(() => {
    if (rol !== 'docente' && rol !== 'tutor') {
      return
    }

    let vigente = true

    if (rol === 'docente') {
      obtenerDocentes()
        .then((resultado) => {
          if (!vigente) return
          setDocentes(resultado)
          setEstadoCarga('listo')
        })
        .catch((error: unknown) => {
          if (!vigente) return
          setErrorCarga(
            error instanceof Error
              ? error.message
              : 'No fue posible consultar los docentes.',
          )
          setEstadoCarga('error')
        })
    } else {
      consultarTutores()
        .then((resultado) => {
          if (!vigente) return
          setTutores(resultado)
          setEstadoCarga('listo')
        })
        .catch((error: unknown) => {
          if (!vigente) return
          setErrorCarga(
            error instanceof Error
              ? error.message
              : 'No fue posible consultar los tutores.',
          )
          setEstadoCarga('error')
        })
    }

    return () => {
      vigente = false
    }
  }, [rol])

  const docenteSeleccionado =
    rol === 'docente'
      ? docentes.find((docente) => String(docente.id) === perfilId)
      : undefined
  const tutorSeleccionado =
    rol === 'tutor'
      ? tutores.find((tutor) => String(tutor.id) === perfilId)
      : undefined
  const personaSeleccionada = docenteSeleccionado ?? tutorSeleccionado
  const nombrePersona = docenteSeleccionado
    ? docenteSeleccionado.nombre
    : tutorSeleccionado
      ? nombreCompletoTutor(tutorSeleccionado)
      : ''
  const correoPersona = docenteSeleccionado
    ? docenteSeleccionado.correo
    : tutorSeleccionado?.email ?? ''
  const perfilFoto = docenteSeleccionado?.foto

  function seleccionarRol(nuevoRol: RolUsuario) {
    if (rol === nuevoRol) return
    setRol(nuevoRol)
    setPerfilId('')
    setContrasenaPerfil('')
    setDatosAdministrador(ADMINISTRADOR_VACIO)
    setMensaje('')
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

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setMensaje('')

    if (rol === 'docente' || rol === 'tutor') {
      if (!personaSeleccionada) {
        setMensaje('Selecciona un perfil registrado antes de continuar.')
        return
      }
      if (!correoPersona.trim()) {
        setMensaje(
          'El perfil seleccionado no tiene correo. Completa ese dato en su registro antes de habilitarle el acceso.',
        )
        return
      }
      if (!contrasenaPerfil) {
        setMensaje('Escribe la contraseña temporal para continuar.')
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
    }

    setMensaje(
      'La pantalla está lista, pero el acceso no se guardó: la API todavía no ofrece el servicio de creación de usuarios.',
    )
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

      {rol && (
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
                  {rol === 'docente'
                    ? docentes.map((docente) => (
                        <option key={docente.id} value={docente.id}>
                          {docente.nombre} · {docente.correo || 'Sin correo'}
                        </option>
                      ))
                    : tutores.map((tutor) => (
                        <option key={tutor.id} value={tutor.id}>
                          {nombreCompletoTutor(tutor)} · {tutor.email || 'Sin correo'}
                        </option>
                      ))}
                </select>
                {estadoCarga === 'error' && (
                  <small className="usuario-campo__error" role="alert">
                    {errorCarga}
                  </small>
                )}
                {estadoCarga === 'listo' && !personaSeleccionada && (
                  <small className="usuario-campo__ayuda">
                    {rol === 'docente' ? docentes.length : tutores.length} perfiles disponibles.
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
                      <input readOnly type="email" value={correoPersona ?? ''} />
                    </label>
                    <label className="usuario-campo">
                      <span>CURP</span>
                      <input
                        readOnly
                        value={
                          docenteSeleccionado?.curp ??
                          tutorSeleccionado?.curp ??
                          'No capturada'
                        }
                      />
                    </label>
                    <label className="usuario-campo">
                      <span>Teléfono</span>
                      <input
                        readOnly
                        value={
                          docenteSeleccionado?.telefono ??
                          tutorSeleccionado?.telefono ??
                          'No capturado'
                        }
                      />
                    </label>
                    {tutorSeleccionado && (
                      <label className="usuario-campo">
                        <span>Parentesco</span>
                        <input readOnly value={tutorSeleccionado.parentesco} />
                      </label>
                    )}
                    {tutorSeleccionado && (
                      <div className="usuario-foto-pendiente">
                        <strong>Foto de perfil</strong>
                        <span>
                          El registro actual de tutor no incluye una foto. Se deberá agregar
                          soporte en el backend para asociarla al acceso.
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
                  <p>
                    Vista previa local; la foto no se almacena hasta conectar el backend.
                  </p>
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
                  <span>Contraseña temporal <strong aria-hidden="true">*</strong></span>
                  <input
                    autoComplete="new-password"
                    onChange={(evento) =>
                      setDatosAdministrador((actuales) => ({
                        ...actuales,
                        contrasena: evento.target.value,
                      }))
                    }
                    placeholder="Define una contraseña temporal"
                    required
                    type="password"
                    value={datosAdministrador.contrasena}
                  />
                </label>
              </div>
            </>
          )}

          {(docenteSeleccionado || tutorSeleccionado) && (
            <label className="usuario-campo usuario-campo--contrasena">
              <span>Contraseña temporal <strong aria-hidden="true">*</strong></span>
              <input
                autoComplete="new-password"
                onChange={(evento) => setContrasenaPerfil(evento.target.value)}
                placeholder="Define una contraseña temporal"
                required
                type="password"
                value={contrasenaPerfil}
              />
              <small>
                Solo se puede definir la contraseña; los datos del perfil seleccionado no se
                modifican.
              </small>
            </label>
          )}

          <div className="usuario-aviso" role="note">
            <strong>Validación y guardado pendientes</strong>
            <p>
              La API actual no permite crear accesos ni consultar si el correo ya pertenece a un
              usuario, y tampoco indica qué perfiles ya están vinculados. La comprobación de
              duplicados, el filtro de perfiles y el guardado se conectarán en la etapa de
              backend; esta pantalla no persiste datos.
            </p>
          </div>

          {mensaje && (
            <p className="usuario-mensaje" role="status">
              {mensaje}
            </p>
          )}

          <footer className="usuario-formulario__acciones">
            <button
              className="usuario-boton usuario-boton--secundario"
              onClick={cancelar}
              type="button"
            >
              Cancelar
            </button>
            <button className="usuario-boton usuario-boton--primario" type="submit">
              Guardar usuario
            </button>
          </footer>
        </form>
      )}
    </section>
  )
}

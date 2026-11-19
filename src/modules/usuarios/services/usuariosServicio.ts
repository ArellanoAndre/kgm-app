export type RolUsuarioApi = 'ADMINISTRADOR' | 'DOCENTE' | 'TUTOR'

export type SesionUsuario = {
  id: number
  escuelaId: number
  email: string
  rol: RolUsuarioApi
  nombre: string
}

export type PerfilDisponible = {
  id: number
  nombreCompleto: string
  correo: string
  curp: string | null
  telefono: string | null
  foto: string | null
}

export type UsuarioCreado = {
  id: number
  escuelaId: number
  email: string
  rol: RolUsuarioApi
  createdAt: string | null
}

export type DatosCreacionUsuario =
  | {
      rol: 'ADMINISTRADOR'
      nombre: string
      email: string
      telefono: string
      password: string
      foto: File | null
    }
  | {
      rol: 'DOCENTE' | 'TUTOR'
      perfilId: number
      password: string
    }

export class UsuarioApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'UsuarioApiError'
    this.status = status
  }
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3000'

let tokenAcceso: string | null = null
let sesionActual: SesionUsuario | null = null

function obtenerToken(): string {
  if (!tokenAcceso) {
    throw new UsuarioApiError('La sesión expiró. Inicia sesión de nuevo.', 401)
  }
  return tokenAcceso
}

async function procesarError(response: Response): Promise<never> {
  let message = `Error HTTP ${response.status}`
  try {
    const body = (await response.json()) as {
      message?: string | string[]
    }
    message = Array.isArray(body.message)
      ? body.message.join(' ')
      : body.message ?? message
  } catch {
    message = `Error HTTP ${response.status}: la API no devolvió un mensaje válido.`
  }
  throw new UsuarioApiError(message, response.status)
}

export function obtenerSesionUsuario(): SesionUsuario | null {
  return sesionActual
}

export function cerrarSesionUsuario(): void {
  tokenAcceso = null
  sesionActual = null
}

export async function iniciarSesionUsuario(
  email: string,
  password: string,
): Promise<SesionUsuario> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLocaleLowerCase(), password }),
    })
  } catch {
    throw new UsuarioApiError(
      'No fue posible conectar con la API. Comprueba que esté disponible.',
      0,
    )
  }

  if (!response.ok) return procesarError(response)

  const body = (await response.json()) as {
    accessToken: string
    usuario: SesionUsuario
  }
  if (body.usuario.rol !== 'ADMINISTRADOR') {
    throw new UsuarioApiError(
      'Solo un administrador escolar puede acceder a la creación de usuarios.',
      403,
    )
  }

  tokenAcceso = body.accessToken
  sesionActual = body.usuario
  return body.usuario
}

export async function obtenerPerfilesDisponibles(
  rol: 'DOCENTE' | 'TUTOR',
): Promise<PerfilDisponible[]> {
  let response: Response
  try {
    response = await fetch(
      `${API_URL}/usuarios/opciones?rol=${encodeURIComponent(rol)}`,
      {
        headers: { Authorization: `Bearer ${obtenerToken()}` },
      },
    )
  } catch {
    throw new UsuarioApiError(
      'No fue posible conectar con la API. Comprueba que esté disponible.',
      0,
    )
  }
  if (!response.ok) return procesarError(response)

  const perfiles = (await response.json()) as PerfilDisponible[]
  return perfiles.map((perfil) => ({
    ...perfil,
    foto: perfil.foto
      ? perfil.foto.startsWith('http')
        ? perfil.foto
        : `${API_URL}${perfil.foto}`
      : null,
  }))
}

export async function crearUsuario(
  datos: DatosCreacionUsuario,
): Promise<UsuarioCreado> {
  let response: Response
  try {
    if (datos.rol === 'ADMINISTRADOR') {
      const body = new FormData()
      body.set('rol', datos.rol)
      body.set('nombre', datos.nombre)
      body.set('email', datos.email.trim().toLocaleLowerCase())
      body.set('telefono', datos.telefono)
      body.set('password', datos.password)
      if (datos.foto) body.set('foto', datos.foto)

      response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${obtenerToken()}` },
        body,
      })
    } else {
      response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      })
    }
  } catch (error) {
    if (error instanceof UsuarioApiError) throw error
    throw new UsuarioApiError(
      'No fue posible conectar con la API. Comprueba que esté disponible.',
      0,
    )
  }

  if (!response.ok) return procesarError(response)
  return (await response.json()) as UsuarioCreado
}

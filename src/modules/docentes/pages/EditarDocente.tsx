import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  actualizarDocente,
  obtenerDocentePorId,
} from '../services/docenteServicio'
import type { DatosRegistroDocente, Docente } from '../types/Docente'
import '../styles/docentes.css'

type PropiedadesEditarDocente = {
  docenteId: number
  alCancelar: () => void
  alGuardar: (docente: Docente) => void
}

type ErroresFormulario = Partial<Record<keyof DatosRegistroDocente, string>>

const FECHA_MAXIMA = new Date().toISOString().slice(0, 10)

function EditarDocente({
  docenteId,
  alCancelar,
  alGuardar,
}: PropiedadesEditarDocente) {
  const [datos, setDatos] = useState<DatosRegistroDocente | null>(null)
  const [docenteOriginal, setDocenteOriginal] = useState<Docente | null>(null)
  const [fotoVista, setFotoVista] = useState('')
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [errorFoto, setErrorFoto] = useState('')
  const [errorCarga, setErrorCarga] = useState('')
  const [errorEnvio, setErrorEnvio] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let activa = true
    obtenerDocentePorId(docenteId)
      .then((docente) => {
        if (!activa) return
        setDocenteOriginal(docente)
        setDatos({
          nombre: docente.nombrePila ?? docente.nombre.split(' ')[0] ?? '',
          apellidoPaterno: docente.apellidoPaterno ?? '',
          apellidoMaterno: docente.apellidoMaterno ?? '',
          curp: docente.curp,
          fechaNacimiento: docente.fechaNacimiento ?? '',
          estado: docente.estado,
          telefono: docente.telefono ?? '',
          correo: docente.correo,
          direccion: docente.direccion ?? '',
        })
        setFotoVista(docente.foto ?? '')
      })
      .catch((error: unknown) => {
        if (activa) {
          setErrorCarga(
            error instanceof Error
              ? error.message
              : 'No se pudo cargar la información del docente.',
          )
        }
      })
      .finally(() => {
        if (activa) setCargando(false)
      })

    return () => {
      activa = false
    }
  }, [docenteId])

  useEffect(() => {
    return () => {
      if (fotoVista.startsWith('blob:')) URL.revokeObjectURL(fotoVista)
    }
  }, [fotoVista])

  function cambiarCampo(campo: keyof DatosRegistroDocente, valor: string) {
    setDatos((actuales) => (actuales ? { ...actuales, [campo]: valor } : actuales))
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }))
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

    setDatos((actuales) => (actuales ? { ...actuales, foto: archivo } : actuales))
    setFotoVista(URL.createObjectURL(archivo))
    setErrorFoto('')
  }

  function validar(datosActuales: DatosRegistroDocente): ErroresFormulario {
    const nuevosErrores: ErroresFormulario = {}
    if (!/^[A-Z0-9]{18}$/.test(datosActuales.curp.trim().toUpperCase())) {
      nuevosErrores.curp = 'La CURP debe tener 18 caracteres alfanuméricos.'
    }
    if (!/^\S+@\S+\.\S+$/.test(datosActuales.correo.trim())) {
      nuevosErrores.correo = 'Escribe un correo electrónico válido.'
    }
    if (!/^\d{10}$/.test(datosActuales.telefono.trim())) {
      nuevosErrores.telefono = 'Escribe un teléfono de 10 dígitos.'
    }
    if (!datosActuales.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'Este campo es obligatorio.'
    } else if (datosActuales.fechaNacimiento > FECHA_MAXIMA) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
    }
    for (const campo of [
      'nombre',
      'apellidoPaterno',
      'apellidoMaterno',
      'direccion',
    ] as const) {
      if (!datosActuales[campo].trim()) {
        nuevosErrores[campo] = 'Este campo es obligatorio.'
      }
    }
    return nuevosErrores
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!datos) return

    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    setErrorEnvio('')
    try {
      const actualizado = await actualizarDocente(docenteId, {
        ...datos,
        nombre: datos.nombre.trim(),
        apellidoPaterno: datos.apellidoPaterno.trim(),
        apellidoMaterno: datos.apellidoMaterno.trim(),
        curp: datos.curp.trim().toUpperCase(),
        telefono: datos.telefono.trim(),
        correo: datos.correo.trim().toLocaleLowerCase(),
        direccion: datos.direccion.trim(),
      })
      alGuardar(actualizado)
    } catch (error) {
      setErrorEnvio(
        error instanceof Error
          ? error.message
          : 'No se pudieron guardar los cambios del docente.',
      )
    } finally {
      setGuardando(false)
    }
  }

  function campoTexto(
    campo:
      | 'nombre'
      | 'apellidoPaterno'
      | 'apellidoMaterno'
      | 'curp'
      | 'telefono'
      | 'correo'
      | 'direccion',
    etiqueta: string,
    marcador: string,
    propiedades: { maxLength?: number; tipo?: string; patron?: string } = {},
  ) {
    if (!datos) return null
    const id = `editar-docente-${campo}`
    return (
      <label className="formulario-docente__campo" htmlFor={id}>
        <span>{etiqueta} <strong aria-hidden="true">*</strong></span>
        <input
          aria-describedby={errores[campo] ? `${id}-error` : undefined}
          aria-invalid={Boolean(errores[campo])}
          id={id}
          maxLength={propiedades.maxLength}
          onChange={(evento) =>
            cambiarCampo(
              campo,
              campo === 'curp'
                ? evento.target.value.toUpperCase()
                : evento.target.value,
            )
          }
          pattern={propiedades.patron}
          placeholder={marcador}
          required
          type={propiedades.tipo ?? 'text'}
          value={datos[campo]}
        />
        {errores[campo] && (
          <span className="formulario-docente__error" id={`${id}-error`}>
            {errores[campo]}
          </span>
        )}
      </label>
    )
  }

  if (cargando) {
    return <p className="pagina-docentes" role="status">Cargando docente…</p>
  }
  if (errorCarga || !datos || !docenteOriginal) {
    return (
      <section className="pagina-docentes">
        <p className="formulario-docente__error" role="alert">
          {errorCarga || 'No se encontró el docente.'}
        </p>
        <button className="boton-secundario-docente" onClick={alCancelar} type="button">
          Volver al listado
        </button>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="titulo-editar-docente"
      className="pagina-docentes pagina-registro-docente"
    >
      <header className="pagina-docentes__encabezado">
        <div>
          <h1 id="titulo-editar-docente">Editar docente</h1>
          <p>Actualiza la información de {docenteOriginal.nombre}</p>
        </div>
      </header>

      <form className="tarjeta-registro-docente" onSubmit={manejarEnvio}>
        <header className="tarjeta-registro-docente__encabezado">
          <div>
            <h2>Datos del docente</h2>
            <p>Los cambios se guardarán en el expediente del docente.</p>
          </div>
          <span className="tarjeta-registro-docente__obligatorios">
            * Campos obligatorios
          </span>
        </header>

        <div className="tarjeta-registro-docente__contenido">
          <div className="formulario-docente__principal">
            <div className="foto-docente">
              <div className="foto-docente__vista">
                {fotoVista ? (
                  <img alt="Foto actual del docente" src={fotoVista} />
                ) : (
                  <span>DOC</span>
                )}
              </div>
              <div className="foto-docente__descripcion">
                <strong>Foto del docente</strong>
                <span>JPG, PNG o WebP; máximo 2 MB.</span>
                {errorFoto && (
                  <span className="formulario-docente__error">{errorFoto}</span>
                )}
              </div>
              <label className="foto-docente__boton" htmlFor="editar-foto-docente">
                Cambiar foto
              </label>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="visualmente-oculto"
                id="editar-foto-docente"
                onChange={manejarFoto}
                type="file"
              />
            </div>

            <div className="formulario-docente__seccion">
              <h3>Información personal</h3>
              <p>Revisa y actualiza los datos registrados.</p>
            </div>

            <div className="formulario-docente__rejilla">
              {campoTexto('nombre', 'Nombre(s)', 'Escribe el nombre', { maxLength: 100 })}
              {campoTexto('apellidoPaterno', 'Apellido paterno', 'Escribe el apellido paterno', { maxLength: 100 })}
              {campoTexto('apellidoMaterno', 'Apellido materno', 'Escribe el apellido materno', { maxLength: 100 })}
              {campoTexto('curp', 'CURP', 'Ej. GARC160101MDFRPN07', {
                maxLength: 18,
                patron: '[A-Za-z0-9]{18}',
              })}
              <label className="formulario-docente__campo" htmlFor="editar-docente-fechaNacimiento">
                <span>Fecha de nacimiento <strong aria-hidden="true">*</strong></span>
                <input
                  aria-describedby={
                    errores.fechaNacimiento
                      ? 'editar-docente-fechaNacimiento-error'
                      : undefined
                  }
                  aria-invalid={Boolean(errores.fechaNacimiento)}
                  id="editar-docente-fechaNacimiento"
                  max={FECHA_MAXIMA}
                  onChange={(evento) =>
                    cambiarCampo('fechaNacimiento', evento.target.value)
                  }
                  required
                  type="date"
                  value={datos.fechaNacimiento}
                />
                {errores.fechaNacimiento && (
                  <span
                    className="formulario-docente__error"
                    id="editar-docente-fechaNacimiento-error"
                  >
                    {errores.fechaNacimiento}
                  </span>
                )}
              </label>
              <label className="formulario-docente__campo" htmlFor="editar-docente-estado">
                <span>Estado <strong aria-hidden="true">*</strong></span>
                <select
                  id="editar-docente-estado"
                  onChange={(evento) => {
                    const estado = evento.target.value
                    if (estado === 'Activo' || estado === 'Inactivo') {
                      cambiarCampo('estado', estado)
                    }
                  }}
                  value={datos.estado}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>
              {campoTexto('telefono', 'Teléfono', '0000000000', {
                maxLength: 10,
                patron: '[0-9]{10}',
                tipo: 'tel',
              })}
              {campoTexto('correo', 'Correo electrónico', 'nombre@correo.com', {
                maxLength: 254,
                tipo: 'email',
              })}
              {campoTexto('direccion', 'Dirección', 'Calle, número, colonia, ciudad', {
                maxLength: 250,
              })}
            </div>
          </div>
        </div>

        {errorEnvio && (
          <p className="formulario-docente__error" role="alert">{errorEnvio}</p>
        )}
        <footer className="tarjeta-registro-docente__pie">
          <span>Editar expediente de docente</span>
          <div>
            <button
              className="boton-secundario-docente"
              disabled={guardando}
              onClick={alCancelar}
              type="button"
            >
              Cancelar
            </button>
            <button className="pagina-docentes__nuevo" disabled={guardando} type="submit">
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </footer>
      </form>
    </section>
  )
}

export default EditarDocente

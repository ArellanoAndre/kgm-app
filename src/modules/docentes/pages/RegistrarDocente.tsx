import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { DatosRegistroDocente, Docente } from '../types/Docente'
import '../styles/docentes.css'

type PropiedadesRegistrarDocente = {
  docentesExistentes: Docente[]
  alCancelar: () => void
  alGuardar: (datos: DatosRegistroDocente) => void
}

type ErroresFormulario = Partial<Record<keyof DatosRegistroDocente, string>>

const FORMULARIO_VACIO: DatosRegistroDocente = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  curp: '',
  fechaNacimiento: '',
  estado: 'Activo',
  telefono: '',
  correo: '',
  direccion: '',
}

const FECHA_MAXIMA = new Date().toISOString().slice(0, 10)

function RegistrarDocente({
  docentesExistentes,
  alCancelar,
  alGuardar,
}: PropiedadesRegistrarDocente) {
  const [datos, setDatos] = useState<DatosRegistroDocente>(FORMULARIO_VACIO)
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [errorFoto, setErrorFoto] = useState('')

  function cambiarCampo(campo: keyof DatosRegistroDocente, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }))
  }

  function manejarFoto(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setErrorFoto('Selecciona un archivo de imagen válido.')
      return
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setErrorFoto('La imagen debe pesar 2 MB o menos.')
      return
    }

    const lector = new FileReader()
    lector.onload = () => {
      const resultado = lector.result
      if (typeof resultado === 'string') {
        setDatos((actuales) => ({ ...actuales, foto: resultado }))
        setErrorFoto('')
      } else {
        setErrorFoto('No se pudo leer la imagen. Intenta con otro archivo.')
      }
    }
    lector.onerror = () => {
      setErrorFoto('No se pudo leer la imagen. Intenta con otro archivo.')
    }
    lector.readAsDataURL(archivo)
  }

  function validar(): ErroresFormulario {
    const nuevosErrores: ErroresFormulario = {}
    const curp = datos.curp.trim().toUpperCase()
    const correo = datos.correo.trim().toLocaleLowerCase()

    if (!/^[A-Z0-9]{18}$/.test(curp)) {
      nuevosErrores.curp = 'La CURP debe tener 18 caracteres alfanuméricos.'
    } else if (
      docentesExistentes.some((docente) => docente.curp.toUpperCase() === curp)
    ) {
      nuevosErrores.curp = 'Ya existe un docente registrado con esta CURP.'
    }

    if (
      docentesExistentes.some(
        (docente) => docente.correo.trim().toLocaleLowerCase() === correo,
      )
    ) {
      nuevosErrores.correo = 'Ya existe un docente registrado con este correo.'
    }

    if (!/^\d{10}$/.test(datos.telefono.trim())) {
      nuevosErrores.telefono = 'Escribe un teléfono de 10 dígitos.'
    }

    if (datos.fechaNacimiento > FECHA_MAXIMA) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
    }

    for (const campo of [
      'nombre',
      'apellidoPaterno',
      'apellidoMaterno',
      'fechaNacimiento',
      'direccion',
    ] as const) {
      if (!datos[campo].trim()) {
        nuevosErrores[campo] = 'Este campo es obligatorio.'
      }
    }

    return nuevosErrores
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    alGuardar({
      ...datos,
      nombre: datos.nombre.trim(),
      apellidoPaterno: datos.apellidoPaterno.trim(),
      apellidoMaterno: datos.apellidoMaterno.trim(),
      curp: datos.curp.trim().toUpperCase(),
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim().toLocaleLowerCase(),
      direccion: datos.direccion.trim(),
    })
  }

  function campoTexto(
    campo: 'nombre' | 'apellidoPaterno' | 'apellidoMaterno' | 'curp' | 'telefono' | 'correo' | 'direccion',
    etiqueta: string,
    marcador: string,
    propiedades: { maxLength?: number; tipo?: string; patron?: string } = {},
  ) {
    const etiquetaId = `docente-${campo}`
    const esCurp = campo === 'curp'

    return (
      <label className="formulario-docente__campo" htmlFor={etiquetaId}>
        <span>
          {etiqueta} <strong aria-hidden="true">*</strong>
        </span>
        <input
          aria-describedby={errores[campo] ? `${etiquetaId}-error` : undefined}
          aria-invalid={Boolean(errores[campo])}
          autoComplete={
            campo === 'correo'
              ? 'email'
              : campo === 'telefono'
                ? 'tel'
                : campo === 'nombre'
                  ? 'given-name'
                  : campo === 'apellidoPaterno' || campo === 'apellidoMaterno'
                    ? 'family-name'
                    : undefined
          }
          id={etiquetaId}
          maxLength={propiedades.maxLength}
          onChange={(evento) =>
            cambiarCampo(
              campo,
              esCurp ? evento.target.value.toUpperCase() : evento.target.value,
            )
          }
          pattern={propiedades.patron}
          placeholder={marcador}
          required
          type={propiedades.tipo ?? 'text'}
          value={datos[campo]}
        />
        {errores[campo] && (
          <span className="formulario-docente__error" id={`${etiquetaId}-error`}>
            {errores[campo]}
          </span>
        )}
      </label>
    )
  }

  return (
    <section aria-labelledby="titulo-registro-docente" className="pagina-docentes pagina-registro-docente">
      <header className="pagina-docentes__encabezado">
        <div>
          <h1 id="titulo-registro-docente">Registrar docente</h1>
          <p>Captura la información del nuevo docente</p>
        </div>
        <button
          className="pagina-docentes__nuevo"
          form="formulario-registro-docente"
          type="submit"
        >
          Guardar docente
        </button>
      </header>

      <form
        className="tarjeta-registro-docente"
        id="formulario-registro-docente"
        onSubmit={manejarEnvio}
      >
        <header className="tarjeta-registro-docente__encabezado">
          <div>
            <h2>Datos del docente</h2>
            <p>Completa la información obligatoria para registrar al nuevo docente.</p>
          </div>
          <span className="tarjeta-registro-docente__obligatorios">
            * Campos obligatorios
          </span>
        </header>

        <div className="tarjeta-registro-docente__contenido">
          <div className="formulario-docente">
            <div className="formulario-docente__principal">
              <div className="foto-docente">
                <div className="foto-docente__vista">
                  {datos.foto ? (
                    <img alt="Vista previa del docente" src={datos.foto} />
                  ) : (
                    <span>DOC</span>
                  )}
                </div>
                <div className="foto-docente__descripcion">
                  <strong>Foto del docente</strong>
                  <span>Sube una imagen de perfil o mantén el avatar por defecto.</span>
                  {errorFoto && <span className="formulario-docente__error">{errorFoto}</span>}
                </div>
                <label className="foto-docente__boton" htmlFor="foto-docente">
                  Subir
                </label>
                <input
                  accept="image/*"
                  className="visualmente-oculto"
                  id="foto-docente"
                  onChange={manejarFoto}
                  type="file"
                />
              </div>

              <div className="formulario-docente__seccion">
                <h3>Información personal</h3>
                <p>Los campos marcados con * son obligatorios para completar el registro.</p>
              </div>

              <div className="formulario-docente__rejilla">
                {campoTexto('nombre', 'Nombre(s)', 'Escribe el nombre', {
                  maxLength: 100,
                })}
                {campoTexto('apellidoPaterno', 'Apellido paterno', 'Escribe el apellido paterno', {
                  maxLength: 60,
                })}
                {campoTexto('apellidoMaterno', 'Apellido materno', 'Escribe el apellido materno', {
                  maxLength: 60,
                })}
                {campoTexto('curp', 'CURP', 'Ej. GARC160101MDFRPN07', {
                  maxLength: 18,
                  patron: '[A-Za-z0-9]{18}',
                })}
              </div>

              <div className="aviso-docentes aviso-docentes--formulario">
                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5m0-8h.01" />
                </svg>
                <span>
                  <strong>Validación de duplicados</strong>
                  <br />
                  Antes de guardar, verifica que CURP y correo no estén registrados para otro docente.
                </span>
              </div>

              <div className="formulario-docente__rejilla">
                <label className="formulario-docente__campo" htmlFor="docente-fechaNacimiento">
                  <span>Fecha de nacimiento <strong aria-hidden="true">*</strong></span>
                  <input
                    aria-invalid={Boolean(errores.fechaNacimiento)}
                    id="docente-fechaNacimiento"
                    aria-describedby={
                      errores.fechaNacimiento ? 'docente-fechaNacimiento-error' : undefined
                    }
                    max={FECHA_MAXIMA}
                    onChange={(evento) => cambiarCampo('fechaNacimiento', evento.target.value)}
                    required
                    type="date"
                    value={datos.fechaNacimiento}
                  />
                  {errores.fechaNacimiento && (
                    <span
                      className="formulario-docente__error"
                      id="docente-fechaNacimiento-error"
                    >
                      {errores.fechaNacimiento}
                    </span>
                  )}
                </label>
                <label className="formulario-docente__campo" htmlFor="docente-estado">
                  <span>Estado <strong aria-hidden="true">*</strong></span>
                  <select
                    id="docente-estado"
                    onChange={(evento) => {
                      const valor = evento.target.value
                      if (valor === 'Activo' || valor === 'Inactivo') {
                        cambiarCampo('estado', valor)
                      }
                    }}
                    required
                    value={datos.estado}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </label>
                {campoTexto('telefono', 'Teléfono', '+52 000 000 0000', {
                  maxLength: 10,
                  patron: '[0-9]{10}',
                  tipo: 'tel',
                })}
                {campoTexto('correo', 'Correo electrónico', 'nombre@correo.com', {
                  maxLength: 254,
                  tipo: 'email',
                })}
                <label className="formulario-docente__campo formulario-docente__campo--completo" htmlFor="docente-direccion">
                  <span>Dirección <strong aria-hidden="true">*</strong></span>
                  <input
                    aria-invalid={Boolean(errores.direccion)}
                    id="docente-direccion"
                    maxLength={250}
                    onChange={(evento) => cambiarCampo('direccion', evento.target.value)}
                    placeholder="Calle, número, colonia, ciudad"
                    required
                    value={datos.direccion}
                  />
                  {errores.direccion && (
                    <span className="formulario-docente__error">{errores.direccion}</span>
                  )}
                </label>
              </div>
            </div>

            <aside aria-label="Resumen del registro" className="resumen-registro">
              <h2>Resumen del registro</h2>
              <p>Completa la información del docente y valida los datos antes de guardar.</p>
              <section className="resumen-registro__bloque">
                <h3>Paso actual</h3>
                <strong>Datos del docente</strong>
                <p>Completa los datos básicos antes de continuar.</p>
              </section>
              <section className="resumen-registro__bloque">
                <h3>Requisitos</h3>
                <ul>
                  <li>CURP válida</li>
                  <li>Correo electrónico único</li>
                  <li>Contacto principal</li>
                </ul>
              </section>
              <section className="resumen-registro__bloque">
                <h3>Confirmación</h3>
                <p>Después de guardar, se mostrará un mensaje de confirmación para validar el registro.</p>
              </section>
            </aside>
          </div>
        </div>

        <footer className="tarjeta-registro-docente__pie">
          <span>Formulario de registro</span>
          <div>
            <button
              className="boton-secundario-docente"
              onClick={alCancelar}
              type="button"
            >
              Cancelar
            </button>
            <button className="pagina-docentes__nuevo" type="submit">
              Guardar docente
            </button>
          </div>
        </footer>
      </form>
    </section>
  )
}

export default RegistrarDocente

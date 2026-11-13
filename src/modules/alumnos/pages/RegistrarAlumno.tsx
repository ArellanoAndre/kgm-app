const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'
import { useEffect, useState, type FormEvent } from 'react'
import '../styles/alumnos.css'
import { crearTutor, consultarTutores } from '../services/tutorService'
import type { Tutor } from '../types/Tutor'

type Props = {
  alVolver: () => void
}

type DatosAlumno = {
  matricula: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaNacimiento: string
  nacionalidad: string
  genero: string
  telefono: string
  correo: string
  direccion: string
  grado: string
  grupo: string
  turno: string
  tutorNombre: string
  tutorParentesco: string
  tutorTelefono: string
  documentos: string[]
}

const INICIALES: DatosAlumno = {
  matricula: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  curp: '',
  fechaNacimiento: '',
  nacionalidad: 'Mexicana',
  genero: '',
  telefono: '',
  correo: '',
  direccion: '',
  grado: '',
  grupo: '',
  turno: '',
  tutorNombre: '',
  tutorParentesco: '',
  tutorTelefono: '',
  documentos: [],
}

type OpcionesEscolares = {
  ciclos: { id: number; nombre: string }[]
  grados: { id: number; nombre: string }[]
  grupos: { id: number; gradoId: number; nombre: string }[]
}
const PASOS = [
  'Datos personales',
  'Datos escolares',
  'Padres / Tutores',
  'Documentos',
  'Confirmación',
]

export default function RegistrarAlumno({ alVolver }: Props) {
  const [opciones, setOpciones] = useState<OpcionesEscolares>({
    ciclos: [],
    grados: [],
    grupos: [],
  })

  useEffect(() => {
    fetch(`${API_URL}/alumnos/asignaciones/opciones?escuelaId=1`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('No se pudieron cargar las opciones escolares.')
        return respuesta.json() as Promise<OpcionesEscolares>
      })
      .then(setOpciones)
      .catch((error) => setError(error.message))
  }, [])
  const [paso, setPaso] = useState(0)
  const [datos, setDatos] = useState<DatosAlumno>(INICIALES)
  const [error, setError] = useState('')
  const [finalizado, setFinalizado] = useState(false)
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [tutorId, setTutorId] = useState<number | null>(null)
  const [busquedaTutor, setBusquedaTutor] = useState('')
  const [creandoTutor, setCreandoTutor] = useState(false)
  const [guardandoTutor, setGuardandoTutor] = useState(false)
  const [nuevoTutor, setNuevoTutor] = useState({
    nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    curp: '', telefono: '', email: '', parentesco: '', direccion: '',
  })

  useEffect(() => {
    consultarTutores().then(setTutores)
      .catch(() => setError('No fue posible cargar los tutores.'))
  }, [])

  function seleccionarTutor(tutor: Tutor) {
    setTutorId(tutor.id)
    setDatos((actuales) => ({
      ...actuales,
      tutorNombre: [tutor.nombre, tutor.apellidoPaterno, tutor.apellidoMaterno]
        .filter(Boolean).join(' '),
      tutorParentesco: tutor.parentesco,
      tutorTelefono: tutor.telefono,
    }))
    setCreandoTutor(false)
    setError('')
  }

  async function registrarTutorNuevo() {
    if (!nuevoTutor.nombre.trim() || !nuevoTutor.apellidoPaterno.trim() ||
        !/^[A-Z0-9]{18}$/.test(nuevoTutor.curp.trim().toUpperCase()) ||
        !/^\d{10}$/.test(nuevoTutor.telefono.trim()) ||
        !nuevoTutor.parentesco.trim()) {
      setError('Completa nombre, apellido, CURP de 18 caracteres, telefono de 10 digitos y parentesco.')
      return
    }
    if (nuevoTutor.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoTutor.email.trim())) {
      setError('Ingresa un correo electronico valido.')
      return
    }
    setGuardandoTutor(true)
    setError('')
    try {
      const tutor = await crearTutor({
        ...nuevoTutor,
        curp: nuevoTutor.curp.trim().toUpperCase(),
        email: nuevoTutor.email.trim().toLowerCase(),
      })
      setTutores((actuales) => [...actuales, tutor])
      seleccionarTutor(tutor)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar el tutor.')
    } finally {
      setGuardandoTutor(false)
    }
  }

  function actualizar(campo: keyof DatosAlumno, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setError('')
  }

  function validarPasoRegistro(numeroPaso: number): string | null {
    if (numeroPaso === 0) {
      if (!datos.matricula.trim() || !datos.nombre.trim() ||
          !datos.apellidoPaterno.trim() || !datos.curp.trim() ||
          !datos.fechaNacimiento) {
        return 'Completa matricula, nombre, apellido paterno, CURP y fecha de nacimiento.'
      }

      if (!/^[A-Z0-9]{18}$/.test(datos.curp.trim().toUpperCase())) {
        return 'La CURP debe tener 18 caracteres alfanumericos.'
      }

      const fecha = datos.fechaNacimiento
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return 'Ingresa una fecha de nacimiento valida.'
      }
      const [anio, mes, dia] = fecha.split('-').map(Number)
      const fechaComprobada = new Date(Date.UTC(anio, mes - 1, dia))
      const hoy = new Date()
      const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      if (anio < 1900 || fechaComprobada.getUTCFullYear() !== anio ||
          fechaComprobada.getUTCMonth() !== mes - 1 ||
          fechaComprobada.getUTCDate() !== dia ||
          fechaComprobada.getTime() > hoyUTC) {
        return 'La fecha de nacimiento debe ser real, no futura y posterior a 1899.'
      }

      if (datos.correo.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
        return 'Ingresa un correo electronico valido.'
      }
      if (datos.telefono.trim() && !/^\d{10}$/.test(datos.telefono.trim())) {
        return 'El telefono del alumno debe contener 10 digitos.'
      }
    }

    if (numeroPaso === 1) {
      if (!datos.grado || !datos.grupo || !datos.turno) {
        return 'Selecciona grado, grupo y turno.'
      }
      const grado = opciones.grados.find((item) => item.nombre === datos.grado)
      const grupoValido = opciones.grupos.some((item) =>
        item.gradoId === grado?.id && item.nombre === datos.grupo)
      if (!grado || !grupoValido || !['Matutino', 'Vespertino'].includes(datos.turno)) {
        return 'Selecciona un grado, grupo y turno validos.'
      }
    }

    if (numeroPaso === 2 && tutorId === null) {
      return 'Selecciona o registra un tutor antes de continuar.'
    }
    return null
  }

  function siguiente() {
    const mensaje = validarPasoRegistro(paso)
    if (mensaje) {
      setError(mensaje)
      return
    }
    setError('')
    setPaso((actual) => Math.min(actual + 1, PASOS.length - 1))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (paso !== PASOS.length - 1) {
      siguiente()
      return
    }

    for (const numeroPaso of [0, 1, 2]) {
      const mensaje = validarPasoRegistro(numeroPaso)
      if (mensaje) {
        setError(mensaje)
        setPaso(numeroPaso)
        return
      }
    }

    const gradoSeleccionado = opciones.grados.find(
      (grado) => grado.nombre === datos.grado,
    )

    const grupoSeleccionado = opciones.grupos.find(
      (grupo) =>
        grupo.gradoId === gradoSeleccionado?.id &&
        grupo.nombre === datos.grupo,
    )

    const cicloSeleccionado = opciones.ciclos[0]

    if (!grupoSeleccionado || !cicloSeleccionado) {
      setError('Selecciona un grado y grupo disponibles.')
      return
    }
    setError('')

    try {
      const respuesta = await fetch(`${API_URL}/alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escuelaId: 1,
          tutorId,
          grupoId: grupoSeleccionado.id,
          cicloId: cicloSeleccionado.id,
          matricula: datos.matricula.trim(),
          curp: datos.curp.trim().toUpperCase(),
          nombre: datos.nombre.trim(),
          apellidoPaterno: datos.apellidoPaterno.trim(),
          apellidoMaterno: datos.apellidoMaterno.trim(),
          fechaNacimiento: datos.fechaNacimiento,
          nacionalidad: datos.nacionalidad.trim(),
          genero: datos.genero || undefined,
          telefono: datos.telefono || undefined,
          correo: datos.correo || undefined,
          direccion: datos.direccion || undefined,
        }),
      })

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          throw new Error('La matrícula o CURP ya está registrada.')
        }

        throw new Error(`No se pudo registrar el alumno (HTTP ${respuesta.status}).`)
      }

      setFinalizado(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar el alumno.',
      )
    }
  }
  const campo = (
    titulo: string,
    clave: keyof DatosAlumno,
    tipo = 'text',
    obligatorio = false,
  ) => (
    <label className="registro-campo" key={clave}>
      <span>{titulo}{obligatorio ? ' *' : ''}</span>
      <input
        type={tipo}
        value={datos[clave] as string}
        onChange={(evento) => actualizar(clave, evento.target.value)}
        required={obligatorio}
      />
    </label>
  )

  if (finalizado) {
    return (
      <section className="pagina-alumnos registro-pagina">
        <header className="registro-confirmacion-encabezado">
          <h1>Alumno registrado</h1>
          <p>Confirmación del registro exitoso</p>
        </header>

        <div className="registro-confirmacion-tarjeta">
          <div className="registro-confirmacion-icono">✓</div>

          <h2>El alumno fue registrado correctamente</h2>
          <p className="registro-confirmacion-descripcion">
            El alumno y su tutor quedaron registrados y asociados en el sistema.
          </p>

          <div className="registro-confirmacion-contenido">
            <h3>Resumen del alumno registrado</h3>

            <div className="registro-confirmacion-resumen">
              <div className="registro-confirmacion-dato">
                <span>NOMBRE</span>
                <strong>
                  {datos.nombre} {datos.apellidoPaterno} {datos.apellidoMaterno}
                </strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>CURP</span>
                <strong>{datos.curp.toUpperCase()}</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>GRADO</span>
                <strong>{datos.grado}</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>GRUPO</span>
                <strong>{datos.grupo}</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>ESTADO</span>
                <strong className="registro-confirmacion-estado">Activo</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>TURNO</span>
                <strong>{datos.turno}</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>TUTOR</span>
                <strong>{datos.tutorNombre}</strong>
              </div>

              <div className="registro-confirmacion-dato">
                <span>DOCUMENTOS SELECCIONADOS</span>
                <strong>
                  {datos.documentos.length > 0
                    ? datos.documentos.join(', ')
                    : 'Ninguno'}
                </strong>
              </div>
            </div>

            <div className="registro-confirmacion-botones">
              <button
                type="button"
                className="boton-primario-alumnos"
                onClick={alVolver}
              >
                Ver ficha del alumno
              </button>

              <button
                type="button"
                className="registro-secundario"
                onClick={() => {
                  setTutorId(null)
                  setBusquedaTutor('')
                  setCreandoTutor(false)
                  setNuevoTutor({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', curp: '', telefono: '', email: '', parentesco: '', direccion: '' })
                  setDatos(INICIALES)
                  setPaso(0)
                  setError('')
                  setFinalizado(false)
                }}
              >
                Registrar otro alumno
              </button>

              <button
                type="button"
                className="registro-secundario"
                onClick={alVolver}
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="pagina-alumnos registro-pagina">
      <header className="registro-encabezado">
        <div>
          <h1>Registrar nuevo alumno</h1>
          <p>Completa la información para incorporar un alumno al sistema.</p>
        </div>
        <button type="button" className="registro-secundario" onClick={alVolver}>
          Volver a alumnos
        </button>
      </header>

      <nav className="registro-pasos" aria-label="Pasos del registro">
        {PASOS.map((nombre, indice) => (
          <div
            key={nombre}
            className={`registro-paso ${indice === paso ? 'registro-paso--activo' : ''}`}
          >
            <span>{indice + 1}</span>
            <small>{nombre}</small>
          </div>
        ))}
      </nav>

      <form className="registro-panel" onSubmit={enviar} noValidate>
        <h2>{PASOS[paso]}</h2>
        <p className="registro-descripcion">
          Paso {paso + 1} de {PASOS.length}
        </p>

        {paso === 0 && (
          <div className="registro-grid">
            {campo('Matrícula', 'matricula', 'text', true)}
            {campo('Nombre(s)', 'nombre', 'text', true)}
            {campo('Apellido paterno', 'apellidoPaterno', 'text', true)}
            {campo('Apellido materno', 'apellidoMaterno')}
            {campo('CURP', 'curp', 'text', true)}
            <label className="registro-campo">
              <span>Fecha de nacimiento *</span>
              <input
                type="date"
                required
                min="1900-01-01"
                max={new Date().toLocaleDateString('sv-SE')}
                value={datos.fechaNacimiento}
                onChange={(e) => actualizar('fechaNacimiento', e.target.value)}
              />
            </label>
            <label className="registro-campo">
              <span>Nacionalidad *</span>
              <select
                value={datos.nacionalidad}
                onChange={(e) => actualizar('nacionalidad', e.target.value)}
              >
                <option value="">Seleccionar nacionalidad</option>
                <option value="Mexicana">Mexicana</option>
                <option value="Estadounidense">Estadounidense</option>
                <option value="Otra">Otra</option>
              </select>
            </label>
            <label className="registro-campo">
              <span>Género</span>
              <select value={datos.genero}
                onChange={(e) => actualizar('genero', e.target.value)}>
                <option value="">Seleccionar</option>
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
                <option>Prefiero no decirlo</option>
              </select>
            </label>
            {campo('Teléfono', 'telefono', 'tel')}
            {campo('Correo electrónico', 'correo', 'email')}
            {campo('Dirección', 'direccion')}
          </div>
        )}

        {paso === 1 && (
          <div className="registro-grid">
            <label className="registro-campo">
              <span>Grado *</span>
              <select value={datos.grado}
                onChange={(e) => { actualizar('grado', e.target.value); setDatos((actuales) => ({ ...actuales, grupo: '' })) }}>
                <option value="">Seleccionar grado</option>
                {opciones.grados.map((grado) =>
                  <option key={grado.id} value={grado.nombre}>{grado.nombre}</option>)}
              </select>
            </label>
            <label className="registro-campo">
              <span>Grupo *</span>
              <select value={datos.grupo}
                onChange={(e) => actualizar('grupo', e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {opciones.grupos
                  .filter((grupo) =>
                    grupo.gradoId === opciones.grados.find(
                      (grado) => grado.nombre === datos.grado,
                    )?.id,
                  )
                  .map((grupo) =>
                  <option key={grupo.id} value={grupo.nombre}>{grupo.nombre}</option>)}
              </select>
            </label>
            <label className="registro-campo">
              <span>Turno *</span>
              <select value={datos.turno}
                onChange={(e) => actualizar('turno', e.target.value)}>
                <option value="">Seleccionar turno</option>
                <option>Matutino</option>
                <option>Vespertino</option>
              </select>
            </label>
          </div>
        )}

        {paso === 2 && (
          <div>
            <p>Selecciona un tutor registrado o crea uno nuevo.</p>
            <label className="registro-campo">
              <span>Buscar tutor existente</span>
              <input type="search" placeholder="Nombre, apellido o CURP"
                value={busquedaTutor}
                onChange={(e) => setBusquedaTutor(e.target.value)} />
            </label>
            <div style={{ maxHeight: 210, overflowY: 'auto', marginTop: 12 }}>
              {tutores.filter((t) =>
                [t.nombre, t.apellidoPaterno, t.apellidoMaterno ?? '', t.curp]
                  .join(' ').toLowerCase()
                  .includes(busquedaTutor.trim().toLowerCase())
              ).map((t) => (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: 10, cursor: 'pointer'
                }}>
                  <input type="radio" name="tutorSeleccionado"
                    checked={tutorId === t.id}
                    onChange={() => seleccionarTutor(t)} />
                  <span>{t.nombre} {t.apellidoPaterno} {t.apellidoMaterno ?? ''}
                    {' - '}{t.parentesco} / {t.telefono}</span>
                </label>
              ))}
            </div>
            {tutorId !== null && (
              <p><strong>Tutor seleccionado:</strong> {datos.tutorNombre}</p>
            )}
            <button type="button" className="registro-secundario"
              onClick={() => { setCreandoTutor((actual) => !actual); setError('') }}>
              {creandoTutor ? 'Cancelar nuevo tutor' : '+ Registrar tutor nuevo'}
            </button>
            {creandoTutor && (
              <div className="registro-grid" style={{ marginTop: 16 }}>
                {([
                  ['nombre', 'Nombre(s)'],
                  ['apellidoPaterno', 'Apellido paterno'],
                  ['apellidoMaterno', 'Apellido materno'],
                  ['curp', 'CURP'],
                  ['telefono', 'Telefono'],
                  ['email', 'Correo electronico'],
                  ['direccion', 'Direccion'],
                ] as const).map(([clave, etiqueta]) => (
                  <label className="registro-campo" key={clave}>
                    <span>{etiqueta}</span>
                    <input value={nuevoTutor[clave]}
                      onChange={(e) => setNuevoTutor((actual) => ({
                        ...actual, [clave]: e.target.value
                      }))} />
                  </label>
                ))}
                <label className="registro-campo">
                  <span>Parentesco *</span>
                  <select value={nuevoTutor.parentesco}
                    onChange={(e) => setNuevoTutor((actual) => ({
                      ...actual, parentesco: e.target.value
                    }))}>
                    <option value="">Seleccionar</option>
                    <option>Madre</option><option>Padre</option>
                    <option>Tutor legal</option><option>Otro</option>
                  </select>
                </label>
                <button type="button" className="boton-primario-alumnos"
                  disabled={guardandoTutor} onClick={registrarTutorNuevo}>
                  {guardandoTutor ? 'Guardando...' : 'Guardar y seleccionar tutor'}
                </button>
              </div>
            )}
          </div>
        )}

        {paso === 3 && (
          <div>
            <p>
              En esta primera versión puedes continuar sin adjuntar documentos.
              La carga de archivos se implementará posteriormente.
            </p>
            <div className="registro-documentos">
              {['Acta de nacimiento', 'CURP', 'Comprobante de domicilio',
                'Certificado de estudios'].map((documento) => (
                <label key={documento}>
                  <input type="checkbox"
                    checked={datos.documentos.includes(documento)}
                    onChange={(e) => setDatos((actuales) => ({
                      ...actuales,
                      documentos: e.target.checked
                        ? [...actuales.documentos, documento]
                        : actuales.documentos.filter((d) => d !== documento),
                    }))}
                  />
                  {documento} (marcar como entregado)
                </label>
              ))}
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="registro-resumen">
            <h3>Revisar información</h3>
            <p><strong>Alumno:</strong> {datos.nombre} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
            <p><strong>CURP:</strong> {datos.curp.toUpperCase()}</p>
            <p><strong>Fecha de nacimiento:</strong> {datos.fechaNacimiento}</p>
            <p><strong>Grado y grupo:</strong> {datos.grado} {datos.grupo}</p>
            <p><strong>Turno:</strong> {datos.turno}</p>
            <p><strong>Tutor:</strong> {datos.tutorNombre} ({datos.tutorParentesco})</p>
            <div className="registro-documentos-resumen">
  <h3>Documentos seleccionados</h3>
  {datos.documentos.length > 0 ? (
    <ul>
      {datos.documentos.map((documento) => (
        <li key={documento}>
          <span className="registro-documento-icono">✓</span>
          {documento}
        </li>
      ))}
    </ul>
  ) : (
    <p>No se seleccionaron documentos.</p>
  )}
</div>
            <p className="registro-aviso">
              Al confirmar se registrará el alumno en el sistema.
              Verifica que los datos sean correctos antes de continuar.
            </p>
          </div>
        )}

        {error && <p className="registro-error" role="alert">{error}</p>}

        <footer className="registro-acciones">
          <button
            type="button"
            className="registro-secundario"
            onClick={() => {
              if (paso === 0) alVolver()
              else {
                setPaso((actual) => actual - 1)
                setError('')
              }
            }}
          >
            {paso === 0 ? 'Cancelar' : 'Anterior'}
          </button>

          <button type="submit" className="boton-primario-alumnos">
            {paso === 4 ? 'Confirmar registro' : 'Siguiente'}
          </button>
        </footer>
      </form>
    </section>
  )
}

import '../styles/registro-alumno.css'

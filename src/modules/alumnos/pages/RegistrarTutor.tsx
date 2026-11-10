import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { crearTutor, consultarTutores, TutorApiError } from '../services/tutorService'
import { obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno } from '../types/Alumno'
import type { CrearTutor, Tutor } from '../types/Tutor'
import '../styles/alumnos.css'

type DatosFormulario = Omit<CrearTutor, 'escuelaId'>
type FormErrors = Partial<Record<keyof CrearTutor, string>>

const FORMULARIO_VACIO: DatosFormulario = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  curp: '',
  telefono: '',
  email: '',
  parentesco: '',
  direccion: '',
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(datos: DatosFormulario): FormErrors {
  const errores: FormErrors = {}
  if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!datos.apellidoPaterno.trim()) errores.apellidoPaterno = 'El apellido paterno es obligatorio.'
  if (!/^[A-Z0-9]{18}$/.test(datos.curp.trim().toUpperCase())) errores.curp = 'El CURP debe tener 18 caracteres alfanuméricos.'
  if (!/^\d{10}$/.test(datos.telefono.trim())) errores.telefono = 'El teléfono debe contener 10 dígitos.'
  const email = datos.email?.trim() ?? ''
  if (email && !emailPattern.test(email)) errores.email = 'Ingresa un correo electrónico válido.'
  if (!datos.parentesco.trim()) errores.parentesco = 'El parentesco es obligatorio.'
  return errores
}

interface RegistrarTutorProps {
  alumnoId: number
  onCancel: () => void
}

export default function RegistrarTutor({ alumnoId, onCancel }: RegistrarTutorProps) {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [datos, setDatos] = useState<DatosFormulario>(FORMULARIO_VACIO)
  const [errores, setErrores] = useState<FormErrors>({})
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(() => {
    obtenerAlumnoPorId(alumnoId).then(setAlumno).catch(() => setMensaje('No fue posible cargar el alumno.'))
    consultarTutores().then(setTutores).catch(() => setMensaje('No fue posible cargar los tutores asociados.'))
  }, [alumnoId])

  const tutoresFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return tutores
    return tutores.filter((tutor) => `${tutor.nombre} ${tutor.apellidoPaterno} ${tutor.email}`.toLowerCase().includes(termino))
  }, [busqueda, tutores])

  function cambiarCampo(campo: keyof DatosFormulario, value: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: value }))
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }))
    setMensaje(null)
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)
    setMensaje(null)
    setExito(false)
    if (Object.keys(nuevosErrores).length > 0) return
    setGuardando(true)
    try {
      await crearTutor({ ...datos, alumnoId, curp: datos.curp.trim().toUpperCase(), email: datos.email?.trim().toLowerCase() ?? '' })
      setDatos(FORMULARIO_VACIO)
      setExito(true)
      setMensaje('Tutor guardado exitosamente.')
      setTutores(await consultarTutores())
    } catch (error: unknown) {
      setMensaje(error instanceof TutorApiError && error.status === 409 ? error.message : error instanceof Error ? error.message : 'No fue posible registrar el tutor.')
    } finally { setGuardando(false) }
  }

  if (!alumno) return <div className="page-state">Cargando alumno…</div>
  const nombreAlumno = `${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.trim()
  const iniciales = `${alumno.nombres[0] ?? ''}${alumno.apellidoPaterno[0] ?? ''}`.toUpperCase()

  return (
    <main className="tutor-page">
      <header className="tutor-heading">
        <div>
          <button className="tutor-back" type="button" onClick={onCancel}>← Alumnos</button>
          <h1>Registrar padre o tutor</h1>
          <p>Asocia un nuevo contacto responsable al expediente del alumno.</p>
        </div>
        <button className="button button--secondary" type="button" onClick={() => setDatos(FORMULARIO_VACIO)}>＋ Registrar nuevo tutor</button>
      </header>
      <section className="tutor-student-card">
        <div className="tutor-avatar">{iniciales}</div>
        <div>
          <h2>{nombreAlumno}</h2>
          <p>CURP {alumno.curp}</p>
          <div className="tutor-student-data">
            <span><b>GRADO</b>{alumno.grado}</span>
            <span><b>GRUPO</b>{alumno.grupo}</span>
            <span><b>CICLO ESCOLAR</b>{alumno.cicloEscolar}</span>
            <span><b>ESTADO</b><em>{alumno.estado}</em></span>
          </div>
        </div>
      </section>
      <section className="tutor-panel">
        <div className="tutor-panel-title">
          <h2>Tutores asociados</h2>
          <span>{tutoresFiltrados.length} tutor{tutoresFiltrados.length === 1 ? '' : 'es'}</span>
        </div>
        {tutoresFiltrados.length ? (
          <div className="tutor-associated-list">
            {tutoresFiltrados.map((tutor) => (
              <article key={tutor.id}>
                <strong>{tutor.nombre} {tutor.apellidoPaterno}</strong>
                <small>{tutor.parentesco}</small>
                <b>TELÉFONO</b>
                <span>{tutor.telefono}</span>
                <b>CORREO ELECTRÓNICO</b>
                <span>{tutor.email || '—'}</span>
                <b>DOMICILIO</b>
                <span>{tutor.direccion || '—'}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="tutor-muted">No hay tutores asociados.</p>
        )}
      </section>
      <section className="tutor-panel">
        <h2>Buscar tutor existente</h2>
        <input className="tutor-search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="⌕  Buscar por nombre o correo…" />
      </section>
      <form className="tutor-panel tutor-form" onSubmit={enviar} noValidate>
        <h2>Datos del nuevo tutor</h2>
        <p>Completa la información del contacto responsable que se asociará al expediente del alumno.</p>
        <div className="tutor-grid">
          {([
            ['nombre', 'Nombre(s)', 'Ej. María'],
            ['apellidoPaterno', 'Apellido paterno', 'Ej. López'],
            ['apellidoMaterno', 'Apellido materno', 'Ej. Hernández'],
            ['parentesco', 'Parentesco', 'Selecciona una opción'],
            ['telefono', 'Teléfono', 'Ej. 55 1234 5678'],
            ['email', 'Correo electrónico', 'Ej. nombre@correo.com'],
            ['direccion', 'Dirección', 'Ej. Calle de las Flores 18, Col. Centro, C.P. 64000'],
          ] as const).map(([campo, label, placeholder]) => (
            <label className={campo === 'direccion' ? 'tutor-span-3' : ''} key={campo}>
              <span>{label}{['nombre', 'apellidoPaterno', 'parentesco', 'telefono'].includes(campo) ? ' *' : ''}</span>
              {campo === 'parentesco' ? (
                <select value={datos[campo] ?? ''} onChange={(event) => cambiarCampo(campo, event.target.value)}>
                  <option value="">{placeholder}</option>
                  <option>Padre</option>
                  <option>Madre</option>
                  <option>Tutor legal</option>
                  <option>Otro</option>
                </select>
              ) : (
                <input
                  type={campo === 'email' ? 'email' : campo === 'telefono' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  value={datos[campo] ?? ''}
                  onChange={(event) => cambiarCampo(campo, event.target.value)}
                />
              )}
              {errores[campo] && <small className="field-error">{errores[campo]}</small>}
            </label>
          ))}
        </div>
        <label className="tutor-principal">
          <span>Tutor principal</span>
          <select>
            <option>No · Opciones: Sí / No</option>
            <option>Sí</option>
          </select>
        </label>
        <div className="tutor-note">
          <strong>ⓘ Evita duplicados</strong>
          <span>Antes de registrar un nuevo tutor, busca primero si el contacto ya existe en la base para mantener la información consistente.</span>
        </div>
        <div className="tutor-actions">
          <span>Puedes asociar varios tutores al alumno.</span>
          <div>
            <button className="button button--secondary" type="button" onClick={onCancel}>Cancelar</button>
            <button className="button button--primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar tutor'}</button>
          </div>
        </div>
        {mensaje && <div className={`feedback-banner feedback-banner--${exito ? 'success' : 'error'}`} role="status">{mensaje}</div>}
      </form>
    </main>
  )
}

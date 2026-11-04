import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AlumnoForm } from '../components/AlumnoForm'
import { actualizarAlumno, obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno, AlumnoEditable } from '../types/Alumno'
import '../styles/alumnos.css'

type FormErrors = Partial<Record<string, string>>
type FeedbackKind = 'success' | 'info' | 'error'
type IconName = 'school' | 'students' | 'academic' | 'teachers' | 'reports' | 'search' | 'bell'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    school: <><path d="M4 5.5h16v13H4z"/><path d="M8 9h8M8 12h8M8 15h5"/></>,
    students: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.4-3.3 2.3-5 5.5-5s5.1 1.7 5.5 5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.7 14.6c2.9-.2 4.5 1.2 4.8 4.4"/></>,
    academic: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    teachers: <><circle cx="12" cy="8" r="3"/><path d="M6.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6"/></>,
    reports: <><path d="M5 20V10M10 20V4M15 20v-7M20 20V7"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  }

  return (
    <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function editableFrom(alumno: Alumno): AlumnoEditable {
  return {
    nombres: alumno.nombres,
    apellidoPaterno: alumno.apellidoPaterno,
    apellidoMaterno: alumno.apellidoMaterno,
    fechaNacimiento: alumno.fechaNacimiento,
    genero: alumno.genero,
    nacionalidad: alumno.nacionalidad,
    telefono: alumno.telefono,
    correo: alumno.correo,
    direccion: alumno.direccion,
    turno: alumno.turno,
    fechaIngreso: alumno.fechaIngreso,
    observaciones: alumno.observaciones,
    tutor: alumno.tutor,
  }
}

function validate(alumno: Alumno): FormErrors {
  const errors: FormErrors = {}

  if (!alumno.nombres.trim()) errors.nombres = 'El nombre es obligatorio.'
  if (!alumno.apellidoPaterno.trim()) errors.apellidoPaterno = 'El apellido paterno es obligatorio.'
  if (alumno.correo && !emailPattern.test(alumno.correo)) errors.correo = 'Ingresa un correo válido.'
  if (alumno.tutor.correo && !emailPattern.test(alumno.tutor.correo)) errors.tutorCorreo = 'Ingresa un correo válido.'

  return errors
}

export default function EditarAlumno() {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [original, setOriginal] = useState<Alumno | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>('info')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    obtenerAlumnoPorId(1)
      .then((data) => {
        setAlumno(data)
        setOriginal(structuredClone(data))
      })
      .catch(() => setLoadError('No fue posible cargar la información del alumno.'))
      .finally(() => setLoading(false))
  }, [])

  const fullName = useMemo(() => {
    if (!alumno) return ''
    return `${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.trim()
  }, [alumno])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!alumno) return

    const nextErrors = validate(alumno)
    setErrors(nextErrors)
    setMessage(null)
    if (Object.keys(nextErrors).length > 0) {
      setFeedbackKind('error')
      setMessage('Revisa los campos marcados antes de guardar.')
      return
    }

    try {
      setSaving(true)
      const updated = await actualizarAlumno(alumno.id, editableFrom(alumno))
      setAlumno(updated)
      setOriginal(structuredClone(updated))
      setFeedbackKind('success')
      setMessage('Cambios guardados correctamente.')
    } catch {
      setFeedbackKind('error')
      setMessage('No fue posible guardar los cambios. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (!original) return
    setAlumno(structuredClone(original))
    setErrors({})
    setFeedbackKind('info')
    setMessage('Los cambios sin guardar fueron descartados.')
  }

  if (loading) return <div className="page-state">Cargando alumno…</div>
  if (loadError || !alumno) return <div className="page-state page-state--error">{loadError ?? 'Alumno no encontrado.'}</div>

  return (
    <div className="kgm-shell">
      <aside className="kgm-sidebar">
        <div className="brand">
          <span className="brand-mark"><Icon name="school" /></span>
          <strong>Escuela</strong>
        </div>

        <span className="sidebar-label">MÓDULOS</span>
        <nav aria-label="Módulos del sistema">
          <a className="nav-item nav-item--active" href="#alumnos"><Icon name="students" />Alumnos</a>
          <a className="nav-item" href="#academica"><Icon name="academic" />Gestión académica</a>
          <a className="nav-item" href="#docentes"><Icon name="teachers" />Docentes</a>
          <a className="nav-item" href="#reportes"><Icon name="reports" />Reportes</a>
        </nav>
      </aside>

      <main className="kgm-main">
        <header className="kgm-topbar">
          <label className="global-search">
            <Icon name="search" />
            <input placeholder="Buscar..." aria-label="Buscar" />
          </label>
          <div className="topbar-user">
            <button className="icon-button" type="button" aria-label="Notificaciones"><Icon name="bell" /></button>
            <span className="avatar">JD</span>
          </div>
        </header>

        <section className="edit-page">
          <div className="page-heading">
            <div>
              <h1>Editar alumno</h1>
              <p>{fullName} · CURP {alumno.curp}</p>
            </div>
            <button
              className="button button--primary button--top"
              type="button"
              onClick={() => (document.getElementById('editar-alumno-form') as HTMLFormElement | null)?.requestSubmit()}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

          {message && <div className={`feedback-banner feedback-banner--${feedbackKind}`} role="status">{message}</div>}

          <AlumnoForm
            alumno={alumno}
            errors={errors}
            saving={saving}
            onChange={(value) => {
              setAlumno(value)
              setMessage(null)
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </section>
      </main>
    </div>
  )
}

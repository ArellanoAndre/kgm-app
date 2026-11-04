import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlumnoForm } from '../components/AlumnoForm'
import { actualizarAlumno, obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno, AlumnoEditable } from '../types/Alumno'
import '../styles/alumnos.css'

type FormErrors = Partial<Record<string, string>>
type FeedbackKind = 'success' | 'info' | 'error'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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
  )
}

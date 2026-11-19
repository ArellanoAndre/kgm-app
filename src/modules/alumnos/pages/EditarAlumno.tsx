import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlumnoForm } from '../components/AlumnoForm'
import { actualizarAlumno, obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno, AlumnoEditable } from '../types/Alumno'
import '../styles/alumnos.css'
import { listarDocumentos } from '../services/documentoService'
import type { DocumentoAlumno } from '../types/documentos'

type FormErrors = Partial<Record<string, string>>
type FeedbackKind = 'success' | 'info' | 'error'

interface EditarAlumnoProps {
  alumnoId?: number
  onAbrirRegistroTutor?: (alumnoId: number) => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nombrePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]*$/
const telefonoPattern = /^\d{10}$/


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
  }
}
function fechaActualLocal(): string {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function validate(alumno: Alumno): FormErrors {
  const errors: FormErrors = {}
  const hoy = fechaActualLocal()

  if (!alumno.nombres.trim()) {
    errors.nombres = 'El nombre es obligatorio.'
  } else if (!nombrePattern.test(alumno.nombres.trim())) {
    errors.nombres = 'El nombre solo puede contener letras, espacios, guiones y apóstrofes.'
  }

  if (!alumno.apellidoPaterno.trim()) {
    errors.apellidoPaterno = 'El apellido paterno es obligatorio.'
  } else if (!nombrePattern.test(alumno.apellidoPaterno.trim())) {
    errors.apellidoPaterno = 'El apellido paterno contiene caracteres no válidos.'
  }

  if (alumno.apellidoMaterno.trim() && !nombrePattern.test(alumno.apellidoMaterno.trim())) {
    errors.apellidoMaterno = 'El apellido materno contiene caracteres no válidos.'
  }

  if (!alumno.fechaNacimiento) {
    errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
  } else if (alumno.fechaNacimiento >= hoy) {
    errors.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy.'
  }

  if (!alumno.nacionalidad.trim()) {
    errors.nacionalidad = 'La nacionalidad es obligatoria.'
  } else if (!nombrePattern.test(alumno.nacionalidad.trim())) {
    errors.nacionalidad = 'La nacionalidad contiene caracteres no válidos.'
  }

  if (alumno.telefono && !telefonoPattern.test(alumno.telefono.replace(/\s/g, ''))) {
    errors.telefono = 'El teléfono debe contener 10 dígitos.'
  }

  if (alumno.correo && !emailPattern.test(alumno.correo.trim())) {
    errors.correo = 'Ingresa un correo válido.'
  }

  if (!alumno.turno) {
    errors.turno = 'Selecciona un turno.'
  } else if (!['Matutino', 'Vespertino'].includes(alumno.turno)) {
    errors.turno = 'Selecciona un turno válido.'
  }

  if (alumno.fechaIngreso) {
    if (alumno.fechaIngreso > hoy) {
      errors.fechaIngreso = 'La fecha de ingreso no puede ser futura.'
    } else if (alumno.fechaNacimiento && alumno.fechaIngreso < alumno.fechaNacimiento) {
      errors.fechaIngreso = 'La fecha de ingreso no puede ser anterior al nacimiento.'
    }
  }

  if (alumno.observaciones.length > 500) {
    errors.observaciones = 'Las observaciones no pueden exceder 500 caracteres.'
  }

  return errors
}

export default function EditarAlumno({ alumnoId = 1, onAbrirRegistroTutor }: EditarAlumnoProps) {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [original, setOriginal] = useState<Alumno | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>('info')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [documentos, setDocumentos] = useState<DocumentoAlumno[]>([])

  useEffect(() => {
    setLoading(true)
    setLoadError(null)

    obtenerAlumnoPorId(alumnoId)
      .then((data) => {
        setAlumno(data)
        setOriginal(structuredClone(data))
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'No fue posible cargar la información del alumno.')
      })
      .finally(() => setLoading(false))
    listarDocumentos(alumnoId).then(setDocumentos)
  }, [alumnoId])


  const fullName = useMemo(() => {
    if (!alumno) return ''
    return `${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.trim()
  }, [alumno])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!alumno) return

    if (!original || JSON.stringify(editableFrom(alumno)) === JSON.stringify(editableFrom(original))) {
      setErrors({})
      setFeedbackKind('info')
      setMessage('No hay cambios por guardar.')
      return
    }

    const nextErrors = validate(alumno)
    setErrors(nextErrors)
    setMessage(null)
    if (Object.keys(nextErrors).length > 0) {
      setFeedbackKind('error')
      setMessage('Revisa los campos marcados antes de guardar.')
      return
    }

    const confirmado = window.confirm(
      `¿Deseas guardar los cambios de ${fullName}?`,
    )
    if (!confirmado) return

    try {
      setSaving(true)
      const updated = await actualizarAlumno(alumno.id, editableFrom(alumno))
      setAlumno(updated)
      setOriginal(structuredClone(updated))
      setFeedbackKind('success')
      setMessage('Cambios guardados correctamente.')
    } catch (error: unknown) {
      setFeedbackKind('error')
      setMessage(error instanceof Error ? error.message : 'No fue posible guardar los cambios.')
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
        {onAbrirRegistroTutor && (
          <button
            className="button button--secondary button--top"
            type="button"
            onClick={() => onAbrirRegistroTutor(alumno.id)}
          >
            HU-1.5 · Registrar tutor
          </button>
        )}
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
        documentos={documentos}
      />
    </section>
  )
}

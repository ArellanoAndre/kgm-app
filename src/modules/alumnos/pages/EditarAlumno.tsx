import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlumnoForm } from '../components/AlumnoForm'
import { actualizarAlumno, obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno, AlumnoEditable } from '../types/Alumno'
import '../styles/alumnos.css'
import { listarDocumentos, subirDocumento } from '../services/documentoService'
import { TIPOS_DOCUMENTO, type DocumentoAlumno, type TipoDocumento } from '../types/documentos'

type FormErrors = Partial<Record<string, string>>
type FeedbackKind = 'success' | 'info' | 'error'

interface EditarAlumnoProps {
  alumnoId?: number
  onAbrirRegistroTutor?: (alumnoId: number) => void
  onAbrirExpediente?: (alumnoId: number) => void
}

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
  }
}

function validate(alumno: Alumno): FormErrors {
  const errors: FormErrors = {}

  if (!alumno.nombres.trim()) errors.nombres = 'El nombre es obligatorio.'
  if (!alumno.apellidoPaterno.trim()) errors.apellidoPaterno = 'El apellido paterno es obligatorio.'
  if (alumno.correo && !emailPattern.test(alumno.correo)) errors.correo = 'Ingresa un correo válido.'

  return errors
}

export default function EditarAlumno({ alumnoId = 1, onAbrirRegistroTutor, onAbrirExpediente }: EditarAlumnoProps) {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [original, setOriginal] = useState<Alumno | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>('info')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [documentos, setDocumentos] = useState<DocumentoAlumno[]>([])
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>(TIPOS_DOCUMENTO[0])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [documentoMessage, setDocumentoMessage] = useState<string | null>(null)

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
    listarDocumentos(alumnoId).then(setDocumentos).catch(() => setDocumentoMessage('No fue posible consultar el expediente.'))
  }, [alumnoId])

  const handleUpload = async () => {
    if (!archivo) return setDocumentoMessage('Selecciona un archivo.')
    try {
      const documento = await subirDocumento(alumnoId, tipoDocumento, archivo)
      setDocumentos((actuales) => [documento, ...actuales])
      setArchivo(null)
      setDocumentoMessage('Documento adjuntado correctamente.')
    } catch (error) {
      setDocumentoMessage(error instanceof Error ? error.message : 'No fue posible adjuntar el documento.')
    }
  }

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
        <button
          className="button button--primary button--top"
          type="button"
          onClick={() => (document.getElementById('editar-alumno-form') as HTMLFormElement | null)?.requestSubmit()}
          disabled={saving}
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {onAbrirRegistroTutor && (
          <button
            className="button button--secondary button--top"
            type="button"
            onClick={() => onAbrirRegistroTutor(alumno.id)}
          >
            HU-1.5 · Registrar tutor
          </button>
        )}
        {onAbrirExpediente && (
          <button className="button button--secondary button--top" type="button" onClick={() => onAbrirExpediente(alumno.id)}>
            HU-1.6 · Expediente digital
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
        tipoDocumento={tipoDocumento}
        documentoMessage={documentoMessage}
        onTipoDocumentoChange={setTipoDocumento}
        onArchivoChange={setArchivo}
        onAgregarDocumento={handleUpload}
      />
    </section>
  )
}

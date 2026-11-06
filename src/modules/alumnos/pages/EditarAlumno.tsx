import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlumnoForm } from '../components/AlumnoForm'
import { actualizarAlumno, obtenerAlumnoPorId } from '../services/alumnoService'
import type { Alumno, AlumnoEditable } from '../types/Alumno'
import '../styles/alumnos.css'
import { listarDocumentos, subirDocumento, urlDocumento } from '../services/documentoService'
import { TIPOS_DOCUMENTO, type DocumentoAlumno } from '../types/documentos'

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
  const [tipoDocumento, setTipoDocumento] = useState(TIPOS_DOCUMENTO[0])
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

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!archivo) return setDocumentoMessage('Selecciona un archivo.')
    try {
      const documento = await subirDocumento(alumnoId, tipoDocumento, archivo)
      setDocumentos((actuales) => [documento, ...actuales])
      setArchivo(null)
      event.currentTarget.reset()
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
            Registrar tutor
          </button>
        )}
        {onAbrirExpediente && (
          <button className="button button--secondary button--top" type="button" onClick={() => onAbrirExpediente(alumno.id)}>
            Expediente digital
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
      />
      <section className="alumno-card expediente-card">
        <h2>Expediente digital</h2>
        <form className="document-upload" onSubmit={handleUpload}>
          <label><span>Tipo de documento</span><select value={tipoDocumento} onChange={(event) => setTipoDocumento(event.target.value as typeof tipoDocumento)}>{TIPOS_DOCUMENTO.map((tipo) => <option key={tipo}>{tipo}</option>)}</select></label>
          <label><span>Archivo PDF, JPG o PNG (máximo 5 MB)</span><input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setArchivo(event.target.files?.[0] ?? null)} /></label>
          <button className="button button--secondary" type="submit">Adjuntar documento</button>
        </form>
        {documentoMessage && <p className="form-caption">{documentoMessage}</p>}
        <div className="document-list">{documentos.map((documento) => <a key={documento.id} href={urlDocumento(documento.id)} target="_blank" rel="noreferrer">{documento.tipo} · {documento.nombreArchivo}</a>)}</div>
      </section>
    </section>
  )
}

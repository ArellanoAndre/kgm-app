import { useState, type FormEvent } from 'react'
import { TutorForm } from '../components/TutorForm'
import { crearTutor, TutorApiError } from '../services/tutorService'
import type { CrearTutor } from '../types/Tutor'
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
  const [datos, setDatos] = useState<DatosFormulario>(FORMULARIO_VACIO)
  const [errores, setErrores] = useState<FormErrors>({})
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

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
      await crearTutor({
        ...datos,
        alumnoId,
        curp: datos.curp.trim().toUpperCase(),
        email: datos.email?.trim().toLowerCase() ?? '',
      })
      setDatos(FORMULARIO_VACIO)
      setExito(true)
      setMensaje('Tutor guardado exitosamente.')
    } catch (error: unknown) {
      setMensaje(error instanceof TutorApiError && error.status === 409
        ? error.message
        : error instanceof Error ? error.message : 'No fue posible registrar el tutor.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="edit-page">
      <div className="page-heading">
        <div>
          <h1>Registrar padre o tutor</h1>
          <p>Captura los datos de contacto del responsable del alumno.</p>
        </div>
      </div>
      {mensaje && <div className={`feedback-banner feedback-banner--${exito ? 'success' : 'error'}`} role="status">{mensaje}</div>}
      <TutorForm datos={datos} errores={errores} guardando={guardando} onChange={cambiarCampo} onSubmit={enviar} onCancel={onCancel} />
    </section>
  )
}

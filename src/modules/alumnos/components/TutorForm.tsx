import type { ChangeEvent, FormEvent } from 'react'
import type { CrearTutor } from '../types/Tutor'

type FormErrors = Partial<Record<keyof CrearTutor, string>>

interface TutorFormProps {
  datos: Omit<CrearTutor, 'escuelaId'>
  errores: FormErrors
  guardando: boolean
  onChange: (campo: keyof Omit<CrearTutor, 'escuelaId'>, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

const campos: Array<{
  key: keyof Omit<CrearTutor, 'escuelaId'>
  label: string
  required?: boolean
  type?: string
  maxLength?: number
}> = [
  { key: 'nombre', label: 'Nombre', required: true, maxLength: 100 },
  { key: 'apellidoPaterno', label: 'Apellido paterno', required: true, maxLength: 100 },
  { key: 'apellidoMaterno', label: 'Apellido materno', maxLength: 100 },
  { key: 'curp', label: 'CURP', required: true, maxLength: 18 },
  { key: 'telefono', label: 'Teléfono', required: true, maxLength: 10, type: 'tel' },
  { key: 'email', label: 'Correo electrónico', required: true, type: 'email', maxLength: 255 },
  { key: 'parentesco', label: 'Parentesco', maxLength: 50 },
  { key: 'direccion', label: 'Dirección' },
]

export function TutorForm({ datos, errores, guardando, onChange, onSubmit, onCancel }: TutorFormProps) {
  const inputValue = (event: ChangeEvent<HTMLInputElement>) => event.target.value

  return (
    <form className="alumno-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid form-grid--three">
        {campos.map((campo) => (
          <label className={campo.key === 'direccion' ? 'form-span-3' : ''} key={campo.key}>
            <span>{campo.label}{campo.required ? ' *' : ''}</span>
            <input
              aria-invalid={Boolean(errores[campo.key])}
              maxLength={campo.maxLength}
              type={campo.type ?? 'text'}
              value={datos[campo.key] ?? ''}
              onChange={(event) => onChange(campo.key, campo.key === 'curp' ? inputValue(event).toUpperCase() : inputValue(event))}
            />
            {errores[campo.key] && <small className="field-error">{errores[campo.key]}</small>}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <span className="form-caption">Los campos marcados con * son obligatorios.</span>
        <div>
          <button className="button button--secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button className="button button--primary" type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar tutor'}
          </button>
        </div>
      </div>
    </form>
  )
}

import React, { useEffect, useState } from 'react'
import { Layers, X } from 'lucide-react'
import type { Grado } from '../types/GradoGrupo'

interface Props {
  abierto: boolean
  gradoEnEdicion?: Grado | null
  onCerrar: () => void
  onGuardar: (nombre: string) => Promise<void>
  cargando?: boolean
}

export const ModalFormularioGrado: React.FC<Props> = ({
  abierto,
  gradoEnEdicion,
  onCerrar,
  onGuardar,
  cargando,
}) => {
  const [nombre, setNombre] = useState('')
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  // Reseteo total de estado y errores cada vez que abre o cambia el grado a editar
  useEffect(() => {
    setErrorLocal(null)
    if (gradoEnEdicion) {
      setNombre(gradoEnEdicion.nombre)
    } else {
      setNombre('')
    }
  }, [gradoEnEdicion, abierto])

  if (!abierto) return null

  const handleCerrar = () => {
    setErrorLocal(null)
    onCerrar()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrorLocal('El nombre del grado es obligatorio.')
      return
    }
    try {
      setErrorLocal(null)
      await onGuardar(nombre.trim())
      handleCerrar()
    } catch (err: unknown) {
      setErrorLocal(err instanceof Error ? err.message : 'Error al guardar el grado.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content card-form" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb' }}>
            <Layers size={20} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {gradoEnEdicion ? 'Editar Grado' : 'Nuevo Grado'}
            </h3>
          </div>
          <button className="btn-secondary" onClick={handleCerrar} style={{ padding: '4px 8px' }} type="button">
            <X size={16} />
          </button>
        </div>

        {errorLocal && (
          <div className="materias-mensaje materias-mensaje--error margin-bottom-md" role="alert">
            <span>{errorLocal}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Nombre del Grado:</label>
            <input
              className="form-control"
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. 1° PRIMARIA, KÍNDER 1"
              required
              type="text"
              value={nombre}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleCerrar} type="button">
              Cancelar
            </button>
            <button className="btn-primary" disabled={cargando} type="submit">
              {cargando ? 'Guardando...' : gradoEnEdicion ? 'Guardar Cambios' : 'Crear Grado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
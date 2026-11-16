import React, { useEffect, useState } from 'react'
import { Users, X } from 'lucide-react'
import type { CrearGrupoPayload, GrupoItem } from '../types/GradoGrupo'

interface Props {
  abierto: boolean
  gradoNombre: string
  gradoId: number
  grupoEnEdicion?: GrupoItem | null
  onCerrar: () => void
  onGuardar: (payload: Partial<CrearGrupoPayload>) => Promise<void>
  cargando?: boolean
}

export const ModalFormularioGrupo: React.FC<Props> = ({
  abierto,
  gradoNombre,
  gradoId,
  grupoEnEdicion,
  onCerrar,
  onGuardar,
  cargando,
}) => {
  const [nombre, setNombre] = useState('')
  const [turno, setTurno] = useState('Matutino')
  const [capacidad, setCapacidad] = useState<number>(30)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  // Reseteo limpio al abrir o cambiar selección
  useEffect(() => {
    setErrorLocal(null)
    if (grupoEnEdicion) {
      setNombre(grupoEnEdicion.nombre)
      setTurno(grupoEnEdicion.turno || 'Matutino')
      setCapacidad(grupoEnEdicion.capacidad || 30)
    } else {
      setNombre('')
      setTurno('Matutino')
      setCapacidad(30)
    }
  }, [grupoEnEdicion, abierto])

  if (!abierto) return null

  const handleCerrar = () => {
    setErrorLocal(null)
    onCerrar()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrorLocal('El nombre del grupo es obligatorio.')
      return
    }
    try {
      setErrorLocal(null)
      await onGuardar({
        gradoId,
        nombre: nombre.trim(),
        turno,
        capacidad: Number(capacidad) || 30,
      })
      handleCerrar()
    } catch (err: unknown) {
      setErrorLocal(err instanceof Error ? err.message : 'Error al guardar el grupo.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content card-form" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb' }}>
            <Users size={20} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {grupoEnEdicion ? `Editar grupo ${grupoEnEdicion.nombre}` : `Nuevo grupo en ${gradoNombre}`}
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
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Nombre del Grupo:</label>
            <input
              className="form-control"
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. A, B o 1° A"
              required
              type="text"
              value={nombre}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Turno:</label>
              <select className="form-select" onChange={(e) => setTurno(e.target.value)} value={turno}>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
              </select>
            </div>
            <div>
              <label className="form-label">Capacidad (Alumnos):</label>
              <input
                className="form-control"
                min={1}
                onChange={(e) => setCapacidad(Number(e.target.value))}
                required
                type="number"
                value={capacidad}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleCerrar} type="button">
              Cancelar
            </button>
            <button className="btn-primary" disabled={cargando} type="submit">
              {cargando ? 'Guardando...' : grupoEnEdicion ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
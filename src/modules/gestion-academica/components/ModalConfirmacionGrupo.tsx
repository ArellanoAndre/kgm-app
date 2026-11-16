import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  abierto: boolean
  nombre: string
  gradoNombre: string
  turno: string
  capacidad: number
  esEdicion: boolean
  onConfirmar: () => void
  onCancelar: () => void
  cargando?: boolean
}

export const ModalConfirmacionGrupo: React.FC<Props> = ({
  abierto,
  nombre,
  gradoNombre,
  turno,
  capacidad,
  esEdicion,
  onConfirmar,
  onCancelar,
  cargando,
}) => {
  if (!abierto) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content card-form" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2563eb', marginBottom: '12px' }}>
          <AlertCircle size={24} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {esEdicion ? 'Confirmar cambios en el grupo' : 'Confirmar creación de grupo'}
          </h3>
        </div>

        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
          Por favor verifique los datos del grupo antes de proceder con el registro:
        </p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><strong>Grado:</strong> {gradoNombre}</div>
          <div><strong>Grupo:</strong> {nombre}</div>
          <div><strong>Turno:</strong> {turno}</div>
          <div><strong>Capacidad:</strong> {capacidad} alumnos</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onCancelar} disabled={cargando} type="button">
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirmar} disabled={cargando} type="button">
            {cargando ? 'Guardando...' : esEdicion ? 'Sí, guardar cambios' : 'Sí, crear grupo'}
          </button>
        </div>
      </div>
    </div>
  )
}
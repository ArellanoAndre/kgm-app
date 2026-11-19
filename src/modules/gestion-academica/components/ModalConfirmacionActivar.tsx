import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { CicloEscolar } from '../types/CicloEscolar'

interface Props {
  abierto: boolean
  ciclo: CicloEscolar | null
  onConfirmar: () => void
  onCancelar: () => void
  cargando?: boolean
}

export const ModalConfirmacionActivar: React.FC<Props> = ({
  abierto,
  ciclo,
  onConfirmar,
  onCancelar,
  cargando,
}) => {
  if (!abierto || !ciclo) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content card-form" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706', marginBottom: '12px' }}>
          <AlertTriangle size={24} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>¿Activar ciclo escolar?</h3>
        </div>

        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
          Está a punto de activar el ciclo <strong>"{ciclo.nombre}"</strong>.
        </p>

        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '6px', marginBottom: '20px', color: '#92400e', fontSize: '13px' }}>
          <strong>¡Atención!</strong> Al activar este ciclo, cualquier otro ciclo escolar que se encuentre <strong>Activo</strong> en este momento pasará automáticamente a estado <strong>Cerrado</strong>.
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onCancelar} disabled={cargando} type="button">
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirmar} disabled={cargando} style={{ backgroundColor: '#d97706', borderColor: '#d97706' }} type="button">
            {cargando ? 'Activando...' : 'Sí, activar ahora'}
          </button>
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  abierto: boolean
  nombre: string
  fechaInicio: string
  fechaFin: string
  onConfirmar: () => void
  onCancelar: () => void
  cargando?: boolean
}

export const ModalConfirmacionCrear: React.FC<Props> = ({
  abierto,
  nombre,
  fechaInicio,
  fechaFin,
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Confirmar creación de ciclo</h3>
        </div>

        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
          Está a punto de registrar el siguiente ciclo escolar. Tenga en cuenta que se guardará inicialmente en estado <strong>Programado</strong>.
        </p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          <div><strong>Ciclo:</strong> {nombre}</div>
          <div><strong>Inicio:</strong> {fechaInicio}</div>
          <div><strong>Fin:</strong> {fechaFin}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onCancelar} disabled={cargando} type="button">
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirmar} disabled={cargando} type="button">
            {cargando ? 'Guardando...' : 'Sí, crear ciclo'}
          </button>
        </div>
      </div>
    </div>
  )
}
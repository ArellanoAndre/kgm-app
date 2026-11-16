import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  abierto: boolean
  nombre: string
  esEdicion: boolean
  onConfirmar: () => void
  onCancelar: () => void
  cargando?: boolean
}

export const ModalConfirmacionGrado: React.FC<Props> = ({
  abierto,
  nombre,
  esEdicion,
  onConfirmar,
  onCancelar,
  cargando,
}) => {
  if (!abierto) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content card-form" style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2563eb', marginBottom: '12px' }}>
          <AlertCircle size={24} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {esEdicion ? 'Confirmar edición de grado' : 'Confirmar creación de grado'}
          </h3>
        </div>

        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
          Está a punto de {esEdicion ? 'actualizar el nombre del' : 'registrar el siguiente'} grado escolar en el sistema:
        </p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          <div><strong>Grado:</strong> {nombre}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onCancelar} disabled={cargando} type="button">
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirmar} disabled={cargando} type="button">
            {cargando ? 'Guardando...' : esEdicion ? 'Sí, actualizar' : 'Sí, crear grado'}
          </button>
        </div>
      </div>
    </div>
  )
}
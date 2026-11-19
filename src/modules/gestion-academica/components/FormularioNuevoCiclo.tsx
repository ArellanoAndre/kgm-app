import React, { useState } from 'react';
import type { CicloEscolar, EstadoCiclo } from '../types/CicloEscolar';

interface Props {
  onCrearCiclo: (nuevo: Omit<CicloEscolar, 'id' | 'escuelaId'>) => void;
  alCancelar?: () => void;
}

export const FormularioNuevoCiclo: React.FC<Props> = ({ onCrearCiclo, alCancelar }) => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado] = useState<EstadoCiclo>('Programado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrearCiclo({ nombre, fechaInicio, fechaFin, estado });
  };

  return (
    <div className="card-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Nuevo ciclo escolar</h2>
          <p className="academico-subtitle" style={{ marginBottom: '20px' }}>
            Define el ciclo y valida que no exista un registro duplicado.
          </p>
        </div>
        {alCancelar && (
          <button 
            type="button" 
            onClick={alCancelar} 
            className="action-link"
            style={{ fontSize: '18px', cursor: 'pointer', border: 'none', background: 'transparent' }}
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre del ciclo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
            placeholder="Ej. 2027–2028"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" className="btn-primary">Crear ciclo</button>
          {alCancelar && (
            <button type="button" onClick={alCancelar} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
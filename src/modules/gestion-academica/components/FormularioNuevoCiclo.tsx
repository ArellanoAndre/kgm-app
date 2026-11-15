import React, { useState } from 'react';
import type { CicloEscolar, EstadoCiclo } from '../types/CicloEscolar';

interface Props {
  onCrearCiclo: (nuevo: Omit<CicloEscolar, 'id'>) => void;
}

export const FormularioNuevoCiclo: React.FC<Props> = ({ onCrearCiclo }) => {
  const [nombre, setNombre] = useState('2028–2029');
  const [fechaInicio, setFechaInicio] = useState('2028-08-21');
  const [fechaFin, setFechaFin] = useState('2029-06-30');
  const [estado, setEstado] = useState<EstadoCiclo>('Programado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrearCiclo({ nombre, fechaInicio, fechaFin, estado });
  };

  return (
    <div className="card-form">
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Nuevo ciclo escolar</h2>
      <p className="academico-subtitle" style={{ marginBottom: '20px' }}>
        Define el ciclo y valida que no exista un registro duplicado.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre del ciclo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
            placeholder="Ciclo"
          />
          <div className="validation-banner">
            <strong>Validación:</strong> Este nombre aún no existe en el catálogo.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoCiclo)}
            className="form-select"
          >
            <option value="Programado">Programado</option>
            <option value="Activo">Activo</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-primary">Crear ciclo</button>
          <p className="ciclo-subtitulo" style={{ marginTop: '8px' }}>
            El nombre del ciclo debe ser único para evitar duplicados.
          </p>
        </div>
      </form>
    </div>
  );
};
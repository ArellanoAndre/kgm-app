// src/modules/gestion-academica/components/CiclosTabla.tsx

import React from 'react';
import type { CicloEscolar } from '../types/CicloEscolar';

interface Props {
  ciclos: CicloEscolar[];
  onActivarCiclo?: (cicloId: number) => Promise<void> | void;
}

export const CiclosTabla: React.FC<Props> = ({ ciclos, onActivarCiclo }) => {
  const getBadgeClass = (estado: CicloEscolar['estado']) => {
    switch (estado) {
      case 'Activo':
        return 'badge badge-activo';
      case 'Cerrado':
        return 'badge badge-cerrado';
      case 'Programado':
        return 'badge badge-programado';
      default:
        return 'badge';
    }
  };

  return (
    <table className="academico-table">
      <thead>
        <tr>
          <th>Ciclo Escolar</th>
          <th>Fecha de Inicio</th>
          <th>Fecha de Fin</th>
          <th>Estado</th>
          <th style={{ textAlign: 'right' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ciclos.map((ciclo) => (
          <tr key={ciclo.id}>
            <td>
              <div className="ciclo-nombre">{ciclo.nombre}</div>
            </td>
            <td>{new Date(ciclo.fechaInicio).toLocaleDateString()}</td>
            <td>{new Date(ciclo.fechaFin).toLocaleDateString()}</td>
            <td>
              <span className={getBadgeClass(ciclo.estado)}>{ciclo.estado}</span>
            </td>
            <td style={{ textAlign: 'right' }}>
              {/* 🛡️ Solo permitimos activar si el ciclo está en estado "Programado" */}
              {ciclo.estado === 'Programado' && onActivarCiclo && (
                <button
                  className="action-link"
                  onClick={() => onActivarCiclo(ciclo.id)}
                  type="button"
                >
                  Activar
                </button>
              )}
              <button className="action-link" type="button">
                Ver
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
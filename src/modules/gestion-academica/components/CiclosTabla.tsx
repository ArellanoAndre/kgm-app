import React from 'react';
import type { CicloEscolar } from '../types/CicloEscolar';

interface Props {
  ciclos: CicloEscolar[];
}

export const CiclosTabla: React.FC<Props> = ({ ciclos }) => {
  const getBadgeClass = (estado: CicloEscolar['estado']) => {
    switch (estado) {
      case 'Activo': return 'badge badge-activo';
      case 'Cerrado': return 'badge badge-cerrado';
      case 'Programado': return 'badge badge-programado';
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
            <td><div className="ciclo-nombre">{ciclo.nombre}</div></td>
            <td>{ciclo.fechaInicio}</td>
            <td>{ciclo.fechaFin}</td>
            <td>
              <span className={getBadgeClass(ciclo.estado)}>{ciclo.estado}</span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-link">Ver</button>
              <button className="action-link">Editar</button>
              <button className="action-link">Más opciones</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
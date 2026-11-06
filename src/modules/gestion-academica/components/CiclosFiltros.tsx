import React from 'react';
import { Filter } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  estadoFilter: string;
  onEstadoFilterChange: (value: string) => void;
}

export const CiclosFiltros: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  estadoFilter,
  onEstadoFilterChange,
}) => (
  <div className="table-filters">
    <input
      type="text"
      placeholder="Buscar ciclo escolar"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="input-search"
    />

    <select
      value={estadoFilter}
      onChange={(e) => onEstadoFilterChange(e.target.value)}
      className="select-filter"
    >
      <option value="Todos">Estado: Todos</option>
      <option value="Activo">Estado: Activo</option>
      <option value="Cerrado">Estado: Cerrado</option>
      <option value="Programado">Estado: Programado</option>
    </select>

    <button className="btn-filter">
      <Filter size={16} style={{ display: 'inline', marginRight: '6px' }} />
      Buscar
    </button>
  </div>
);
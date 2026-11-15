import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import '../styles/gestionCicloEscolar.css';
import type { CicloEscolar } from '../types/CicloEscolar';
import { ciclosServicesMock } from '../mock/CiclosServicesMock';

import { CiclosTabla } from '../components/CiclosTabla';
import { CiclosFiltros } from '../components/CiclosFiltros';
import { FormularioNuevoCiclo } from '../components/FormularioNuevoCiclo';

export const GestionCiclosEscolares: React.FC = () => {
  const [ciclos, setCiclos] = useState<CicloEscolar[]>(() => ciclosServicesMock.getData());
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  // Filtrado
  const ciclosFiltrados = ciclos.filter((ciclo) => {
    const coincideBusqueda = ciclo.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideEstado = estadoFilter === 'Todos' || ciclo.estado === estadoFilter;
    return coincideBusqueda && coincideEstado;
  });

  const handleCrearCiclo = (nuevoCicloData: Omit<CicloEscolar, 'id'>) => {
  const nuevo: CicloEscolar = {
    id: crypto.randomUUID(),
    nombre: nuevoCicloData.nombre,
    fechaInicio: nuevoCicloData.fechaInicio,
    fechaFin: nuevoCicloData.fechaFin,
    estado: nuevoCicloData.estado,
  };

  setCiclos((prev) => [...prev, nuevo]);
};

  return (
    <div className="academico-container">
      {/* Encabezado */}
      <div className="academico-header">
        <div>
          <h1 className="academico-title">Ciclos escolares</h1>
          <p className="academico-subtitle">Consulta y administración de ciclos escolares</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} />
          Nuevo ciclo
        </button>
      </div>

      {/* Tabla con Filtros */}
      <div className="card-table">
        <CiclosFiltros
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          estadoFilter={estadoFilter}
          onEstadoFilterChange={setEstadoFilter}
        />
        <CiclosTabla ciclos={ciclosFiltrados} />
      </div>

      {/* Formulario */}
      <FormularioNuevoCiclo onCrearCiclo={handleCrearCiclo} />
    </div>
  );
};
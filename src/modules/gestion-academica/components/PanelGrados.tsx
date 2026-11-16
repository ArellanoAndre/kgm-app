import React from 'react';
import { Edit2, Plus } from 'lucide-react';
import type { Grado } from '../types/GradoGrupo';

interface Props {
  grados: Grado[];
  gradoSeleccionado: Grado | null;
  cargando: boolean;
  onSeleccionarGrado: (grado: Grado) => void;
  onCrearGrado: () => void;
  onEditarGrado: (grado: Grado) => void;
}

export const PanelGrados: React.FC<Props> = ({
  grados,
  gradoSeleccionado,
  cargando,
  onSeleccionarGrado,
  onCrearGrado,
  onEditarGrado,
}) => {
  return (
    <div className="card-table grados-panel">
      <div className="grados-panel__header">
        <h3 className="grados-panel__titulo">Grados Escolares</h3>
        <button
          className="btn-secondary grados-panel__btn-nuevo"
          onClick={onCrearGrado}
          title="Crear nuevo grado"
          type="button"
        >
          <Plus size={14} />
        </button>
      </div>

      {cargando ? (
        <p className="materias-estado">Cargando grados...</p>
      ) : (
        <div className="grados-lista">
          {grados.map((g) => {
            const esSeleccionado = gradoSeleccionado?.id === g.id;
            return (
              <div
                key={g.id}
                className={`grado-item ${esSeleccionado ? 'grado-item--seleccionado' : ''}`}
                onClick={() => onSeleccionarGrado(g)}
              >
                <span>{g.nombre}</span>
                <div className="grado-item__acciones">
                  <span className="grado-item__badge">
                    {g._count?.grupo ?? 0} grupos
                  </span>
                  <button
                    className="action-link grado-item__btn-editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditarGrado(g);
                    }}
                    title="Editar grado"
                    type="button"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
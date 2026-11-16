import React from 'react';
import { Users } from 'lucide-react';
import type { Grado, GrupoItem } from '../types/GradoGrupo';

interface Props {
  gradoSeleccionado: Grado | null;
  grupos: GrupoItem[];
  cargando: boolean;
  onCrearGrupo: () => void;
  onEditarGrupo: (grupo: GrupoItem) => void;
}

export const TablaGrupos: React.FC<Props> = ({
  gradoSeleccionado,
  grupos,
  cargando,
  onCrearGrupo,
  onEditarGrupo,
}) => {
  if (!gradoSeleccionado) {
    return (
      <div className="card-table">
        <div className="grupos-empty">
          Seleccione un grado del panel izquierdo para consultar sus grupos.
        </div>
      </div>
    );
  }

  return (
    <div className="card-table">
      <div className="grupos-header">
        <h3 className="grupos-header__titulo">
          Grupos asignados a {gradoSeleccionado.nombre}
        </h3>
      </div>

      {cargando ? (
        <p className="materias-estado">Cargando grupos...</p>
      ) : grupos.length === 0 ? (
        <div className="grupos-empty">
          <Users size={32} className="grupos-empty__icono" />
          <p>No hay grupos registrados para este grado.</p>
          <button
            className="btn-secondary margin-bottom-md"
            onClick={onCrearGrupo}
            type="button"
          >
            Crear primer grupo
          </button>
        </div>
      ) : (
        <table className="academico-table">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Turno</th>
              <th>Capacidad / Cupo</th>
              <th>Alumnos Asignados</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((grp) => {
              const porcentajeOcupacion = Math.round((grp.alumnosAsignados / grp.capacidad) * 100);
              const esLleno = porcentajeOcupacion >= 100;
              return (
                <tr key={grp.id}>
                  <td>
                    <strong>{grp.nombre}</strong>
                  </td>
                  <td>{grp.turno}</td>
                  <td>
                    <span>{grp.capacidad} alumnos</span>
                  </td>
                  <td>
                    <div className="grupos-ocupacion">
                      <span>{grp.alumnosAsignados} / {grp.capacidad}</span>
                      <span className={`grupos-ocupacion__badge ${esLleno ? 'grupos-ocupacion__badge--lleno' : 'grupos-ocupacion__badge--normal'}`}>
                        {porcentajeOcupacion}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="action-link"
                      onClick={() => onEditarGrupo(grp)}
                      type="button"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
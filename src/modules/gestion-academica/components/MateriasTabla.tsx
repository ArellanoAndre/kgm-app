import React from 'react'
import type { Materia } from '../types/Materia'

type PropiedadesMateriasTabla = {
  materias: Materia[]
  alEditar: (materia: Materia) => void
}

export const MateriasTabla: React.FC<PropiedadesMateriasTabla> = ({
  materias,
  alEditar,
}) => (
  <table className="academico-table">
    <thead>
      <tr>
        <th>Materia</th>
        <th>Clave</th>
        <th>Grado</th>
        <th style={{ textAlign: 'right' }}>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {materias.length > 0 ? (
        materias.map((materia) => (
          <tr key={materia.id}>
            <td>
              <div className="ciclo-nombre">{materia.nombre}</div>
            </td>
            <td>{materia.clave}</td>
            <td>{materia.grado}</td>
            <td style={{ textAlign: 'right' }}>
              <button
                aria-label={`Ver ${materia.nombre}`}
                className="action-link"
                disabled
                title="Disponible próximamente"
                type="button"
              >
                Ver
              </button>
              <button
                aria-label={`Editar ${materia.nombre}`}
                className="action-link"
                onClick={() => alEditar(materia)}
                type="button"
              >
                Editar
              </button>
              <button
                aria-label={`Más opciones de ${materia.nombre}`}
                className="action-link"
                disabled
                title="Disponible próximamente"
                type="button"
              >
                Más opciones
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="materias-tabla__vacia" colSpan={4}>
            No se encontraron materias con los filtros seleccionados.
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

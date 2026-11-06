import type { CicloEscolar } from '../types/CicloEscolar';

// Arreglo constante de datos
const DATOS_INICIALES: CicloEscolar[] = [
  { id: '1', nombre: '2026–2027', fechaInicio: '21/08/2026', fechaFin: '30/06/2027', estado: 'Activo' },
  { id: '2', nombre: '2025–2026', fechaInicio: '19/08/2025', fechaFin: '30/06/2026', estado: 'Cerrado' },
  { id: '3', nombre: '2024–2025', fechaInicio: '20/08/2024', fechaFin: '30/06/2025', estado: 'Cerrado' },
  { id: '4', nombre: '2027–2028', fechaInicio: '22/08/2027', fechaFin: '30/06/2028', estado: 'Programado' },
];

// Servicio mock que exporta las funciones
export const ciclosServicesMock = {
  getData: (): CicloEscolar[] => {
    return DATOS_INICIALES;
  },
};
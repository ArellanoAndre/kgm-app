import { useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
//import { GestionAcademica } from './modules/gestion-academica/pages/GestionAcademica' Me falta meterlo aun
import type { ModuloId } from './components/layout/modulosBarraLateral'

export function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('gestion-academica')
  const [busqueda, setBusqueda] = useState('')

  return (
    <DashboardLayout
      alCambiarBusqueda={setBusqueda}
      alCambiarModulo={setModuloActivo}
      inicialesUsuario="JU"
      moduloActivo={moduloActivo}
      nombreUsuario="Juan Pérez"
      notificacionesPendientes={3}
      valorBusqueda={busqueda}
    >
      {moduloActivo === 'gestion-academica' && <div>Módulo de Gestion</div>/*<GestionAcademica />*/}
      {moduloActivo === 'alumnos' && <div>Módulo de Alumnos</div>}
      {moduloActivo === 'docentes' && <div>Módulo de Docentes</div>}
      {moduloActivo === 'reportes' && <div>Módulo de Reportes</div>}
    </DashboardLayout>
  )
}

export default App
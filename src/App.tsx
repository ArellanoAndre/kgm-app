import { useState } from 'react'
import BarraLateral from './components/layout/BarraLateral'
import BarraSuperior from './components/layout/BarraSuperior'
import type { ModuloId } from './components/layout/modulosBarraLateral'
import EditarAlumno from './modules/alumnos/pages/EditarAlumno'
import './App.css'

function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('alumnos')
  const [textoBusqueda, setTextoBusqueda] = useState('')

  return (
    <div className="aplicacion">
      <BarraLateral moduloActivo={moduloActivo} alCambiarModulo={setModuloActivo} />
      <div className="contenido-aplicacion">
        <BarraSuperior
          alCambiarBusqueda={setTextoBusqueda}
          inicialesUsuario="JD"
          nombreUsuario="Juan Docente"
          notificacionesPendientes={3}
          valorBusqueda={textoBusqueda}
        />
        <EditarAlumno />
      </div>
    </div>
  )
}

export default App

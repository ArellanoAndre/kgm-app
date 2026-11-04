import { useState } from 'react'
import BarraLateral from './components/layout/BarraLateral'
import BarraSuperior from './components/layout/BarraSuperior'
import type { ModuloId } from './components/layout/modulosBarraLateral'
import ConsultarDocentes from './modules/docentes/pages/ConsultarDocentes'
import './App.css'

function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('docentes')
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
        {moduloActivo === 'docentes' ? (
          <ConsultarDocentes busquedaGlobal={textoBusqueda} />
        ) : (
          <main className="area-prueba">
            <section className="area-prueba__tarjeta">
              <p className="area-prueba__etiqueta">Módulo seleccionado</p>
              <h1>
                {moduloActivo === 'gestion-academica'
                  ? 'Gestión académica'
                  : moduloActivo === 'alumnos'
                    ? 'Alumnos'
                    : 'Reportes'}
              </h1>
              <p>Esta pantalla se implementará en el módulo correspondiente.</p>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
// import { GestionAcademica } from './modules/gestion-academica/pages/GestionAcademica'
import type { ModuloId } from './components/layout/modulosBarraLateral'
import ConsultarDocentes from './modules/docentes/pages/ConsultarDocentes'
import ConsultarAlumnos from './modules/alumnos/pages/ConsultarAlumnos'
import './App.css'

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
      {moduloActivo === 'docentes' ? (
        <ConsultarDocentes
          alLimpiarBusquedaGlobal={() => setBusqueda('')}
          busquedaGlobal={busqueda}
        />
      ) : moduloActivo === 'alumnos' ? (
        <ConsultarAlumnos />
      ) : (
        <section className="area-prueba" aria-labelledby="modulo-seleccionado">
          <div className="area-prueba__tarjeta">
            <p className="area-prueba__etiqueta">Módulo seleccionado</p>
            <h1 id="modulo-seleccionado">
              {moduloActivo === 'gestion-academica'
                ? 'Gestión académica'
                : 'Reportes'}
            </h1>
            <p>Esta pantalla se implementará en el módulo correspondiente.</p>
          </div>
        </section>
      )}
    </DashboardLayout>
  )
}

export default App
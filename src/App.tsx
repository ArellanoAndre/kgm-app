import { useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import type {
  ModuloId,
  OpcionGestionAcademicaId,
} from './components/layout/modulosBarraLateral'
import EditarAlumno from './modules/alumnos/pages/EditarAlumno'
import ConsultarDocentes from './modules/docentes/pages/ConsultarDocentes'
import './App.css'

export function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('gestion-academica')
  const [opcionGestionAcademica, setOpcionGestionAcademica] =
    useState<OpcionGestionAcademicaId | null>(null)
  const [busqueda, setBusqueda] = useState('')

  function cambiarModulo(modulo: ModuloId) {
    setModuloActivo(modulo)
    setOpcionGestionAcademica(null)
  }

  return (
    <DashboardLayout
      alCambiarBusqueda={setBusqueda}
      alCambiarModulo={cambiarModulo}
      alCambiarOpcionGestionAcademica={setOpcionGestionAcademica}
      inicialesUsuario="JU"
      moduloActivo={moduloActivo}
      nombreUsuario="Juan Pérez"
      notificacionesPendientes={3}
      opcionGestionAcademicaActiva={opcionGestionAcademica}
      valorBusqueda={busqueda}
    >
      {moduloActivo === 'docentes' ? (
        <ConsultarDocentes
          alLimpiarBusquedaGlobal={() => setBusqueda('')}
          busquedaGlobal={busqueda}
        />
      ) : moduloActivo === 'alumnos' ? (
        <EditarAlumno />
      ) : moduloActivo === 'gestion-academica' && opcionGestionAcademica ? (
        <section className="area-prueba" aria-labelledby="opcion-gestion-academica">
          <div className="area-prueba__tarjeta">
            <p className="area-prueba__etiqueta">Gestión académica</p>
            <h1 id="opcion-gestion-academica">
              {{
                'ciclos-escolares': 'Ciclos escolares',
                'grados-grupos': 'Grados y grupos',
                materias: 'Materias',
                'asignar-alumno-grupo': 'Asignar alumno a grupo',
                'asignar-docente-grupo-materia':
                  'Asignar docente a grupo y materia',
              }[opcionGestionAcademica]}
            </h1>
            <p>Esta pantalla se implementará en el módulo de Gestión académica.</p>
          </div>
        </section>
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

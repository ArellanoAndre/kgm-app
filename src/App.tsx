import { useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import type {
  ModuloId,
  OpcionGestionAcademicaId,
} from './components/layout/modulosBarraLateral'
import ConsultarAlumnos from './modules/alumnos/pages/ConsultarAlumnos'
import RegistrarAlumno from './modules/alumnos/pages/RegistrarAlumno'
import ConsultarDocentes from './modules/docentes/pages/ConsultarDocentes'
import AsignarAlumnoGrupo from './modules/gestion-academica/pages/AsignarAlumnoGrupo'
import { GestionCiclosEscolares } from './modules/gestion-academica/pages/GestionCiclosEscolares'
import { GestionMaterias } from './modules/gestion-academica/pages/GestionMaterias'
import ReportesInicio from './modules/reportes/pages/ReportesInicio'
import ReporteCalificaciones from './modules/reportes/pages/ReporteCalificaciones'
import './App.css'

type VistaReportes = 'inicio' | 'calificaciones'
type VistaAlumnos = 'consulta' | 'registro'

export function App() {
  const [moduloActivo, setModuloActivo] =
    useState<ModuloId>('gestion-academica')

  const [opcionGestionAcademica, setOpcionGestionAcademica] =
    useState<OpcionGestionAcademicaId | null>(null)

  const [busqueda, setBusqueda] = useState('')
  const [vistaReportes, setVistaReportes] =
    useState<VistaReportes>('inicio')
  const [vistaAlumnos, setVistaAlumnos] =
    useState<VistaAlumnos>('consulta')

  function cambiarModulo(modulo: ModuloId) {
    setModuloActivo(modulo)
    setVistaAlumnos('consulta')
    setOpcionGestionAcademica(null)

    if (modulo === 'reportes') {
      setVistaReportes('inicio')
    }
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
        vistaAlumnos === 'registro' ? (
          <RegistrarAlumno
            alVolver={() => setVistaAlumnos('consulta')}
          />
        ) : (
          <ConsultarAlumnos
            alNuevoAlumno={() => setVistaAlumnos('registro')}
          />
        )
      ) : moduloActivo === 'reportes' &&
        vistaReportes === 'calificaciones' ? (
        <ReporteCalificaciones
          alVolver={() => setVistaReportes('inicio')}
        />
      ) : moduloActivo === 'reportes' ? (
        <ReportesInicio
          alAbrirCalificaciones={() =>
            setVistaReportes('calificaciones')
          }
        />
      ) : moduloActivo === 'gestion-academica' &&
        opcionGestionAcademica === 'asignar-alumno-grupo' ? (
        <AsignarAlumnoGrupo />
      ) : moduloActivo === 'gestion-academica' &&
        opcionGestionAcademica === 'ciclos-escolares' ? (
        <GestionCiclosEscolares />
      ) : moduloActivo === 'gestion-academica' &&
        opcionGestionAcademica === 'materias' ? (
        <GestionMaterias />
      ) : moduloActivo === 'gestion-academica' &&
        opcionGestionAcademica ? (
        <section
          className="area-prueba"
          aria-labelledby="opcion-gestion-academica"
        >
          <div className="area-prueba__tarjeta">
            <p className="area-prueba__etiqueta">
              Gestión académica
            </p>
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
            <p>
              Esta pantalla se implementará en el módulo de
              Gestión académica.
            </p>
          </div>
        </section>
      ) : (
        <section
          className="area-prueba"
          aria-labelledby="modulo-seleccionado"
        >
          <div className="area-prueba__tarjeta">
            <p className="area-prueba__etiqueta">
              Módulo seleccionado
            </p>
            <h1 id="modulo-seleccionado">
              {moduloActivo === 'gestion-academica'
                ? 'Gestión académica'
                : 'Módulo seleccionado'}
            </h1>
            <p>
              Esta pantalla se implementará en el módulo
              correspondiente.
            </p>
          </div>
        </section>
      )}
    </DashboardLayout>
  )
}

export default App

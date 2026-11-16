import type { ReactNode } from 'react'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import type {
  ModuloId,
  OpcionAlumnosId,
  OpcionGestionAcademicaId,
} from './modulosBarraLateral'
import './DashboardLayout.css'

type PropiedadesDashboardLayout = {
  children: ReactNode
  moduloActivo: ModuloId
  alCambiarModulo: (modulo: ModuloId) => void
  opcionAlumnosActiva: OpcionAlumnosId | null
  alCambiarOpcionAlumnos: (opcion: OpcionAlumnosId) => void
  opcionGestionAcademicaActiva: OpcionGestionAcademicaId | null
  alCambiarOpcionGestionAcademica: (opcion: OpcionGestionAcademicaId) => void
  valorBusqueda: string
  alCambiarBusqueda: (valor: string) => void
  nombreUsuario: string
  inicialesUsuario: string
  fotoUsuario?: string
  notificacionesPendientes?: number
  alAbrirNotificaciones?: () => void
  alAbrirPerfil?: () => void
}

export default function DashboardLayout({
  children,
  moduloActivo,
  alCambiarModulo,
  opcionAlumnosActiva,
  alCambiarOpcionAlumnos,
  opcionGestionAcademicaActiva,
  alCambiarOpcionGestionAcademica,
  valorBusqueda,
  alCambiarBusqueda,
  nombreUsuario,
  inicialesUsuario,
  fotoUsuario,
  notificacionesPendientes,
  alAbrirNotificaciones,
  alAbrirPerfil,
}: PropiedadesDashboardLayout) {
  return (
    <div className="dashboard-layout">
      <BarraLateral
        alCambiarModulo={alCambiarModulo}
        alCambiarOpcionAlumnos={alCambiarOpcionAlumnos}
        alCambiarOpcionGestionAcademica={alCambiarOpcionGestionAcademica}
        moduloActivo={moduloActivo}
        opcionAlumnosActiva={opcionAlumnosActiva}
        opcionGestionAcademicaActiva={opcionGestionAcademicaActiva}
      />
      <div className="dashboard-layout__contenedor-principal">
        <BarraSuperior
          alAbrirNotificaciones={alAbrirNotificaciones}
          alAbrirPerfil={alAbrirPerfil}
          alCambiarBusqueda={alCambiarBusqueda}
          fotoUsuario={fotoUsuario}
          inicialesUsuario={inicialesUsuario}
          nombreUsuario={nombreUsuario}
          notificacionesPendientes={notificacionesPendientes}
          valorBusqueda={valorBusqueda}
        />
        <main className="dashboard-layout__contenido">
          {children}
        </main>
      </div>
    </div>
  )
}

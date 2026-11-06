import './BarraSuperior.css'

type PropiedadesBarraSuperior = {
  valorBusqueda: string
  alCambiarBusqueda: (valor: string) => void
  nombreUsuario: string
  inicialesUsuario: string
  fotoUsuario?: string
  notificacionesPendientes?: number
  alAbrirNotificaciones?: () => void
  alAbrirPerfil?: () => void
}

function BarraSuperior({
  valorBusqueda,
  alCambiarBusqueda,
  nombreUsuario,
  inicialesUsuario,
  fotoUsuario,
  notificacionesPendientes = 0,
  alAbrirNotificaciones,
  alAbrirPerfil,
}: PropiedadesBarraSuperior) {
  return (
    <header className="barra-superior">
      <label className="barra-superior__busqueda">
        <svg
          aria-hidden="true"
          className="barra-superior__icono-busqueda"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          aria-label="Buscar"
          onChange={(evento) => alCambiarBusqueda(evento.target.value)}
          placeholder="Buscar..."
          type="search"
          value={valorBusqueda}
        />
      </label>

      <div className="barra-superior__acciones">
        <button
          aria-label={
            notificacionesPendientes > 0
              ? `Notificaciones, ${notificacionesPendientes} pendientes`
              : 'Notificaciones'
          }
          className="barra-superior__boton-icono"
          onClick={alAbrirNotificaciones}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          {notificacionesPendientes > 0 && (
            <span aria-hidden="true" className="barra-superior__indicador">
              {notificacionesPendientes > 9 ? '9+' : notificacionesPendientes}
            </span>
          )}
        </button>

        <button
          aria-label={`Perfil de ${nombreUsuario}`}
          className="barra-superior__usuario"
          onClick={alAbrirPerfil}
          title={nombreUsuario}
          type="button"
        >
          {fotoUsuario ? (
            <img alt="" src={fotoUsuario} />
          ) : (
            <span>{inicialesUsuario}</span>
          )}
        </button>
      </div>
    </header>
  )
}

export default BarraSuperior

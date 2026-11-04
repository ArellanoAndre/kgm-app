import { MODULOS_BARRA_LATERAL, type ModuloId } from './modulosBarraLateral'
import './BarraLateral.css'

type PropiedadesBarraLateral = {
  moduloActivo: ModuloId
  alCambiarModulo: (modulo: ModuloId) => void
}

function IconoModulo({ nombre }: { nombre: (typeof MODULOS_BARRA_LATERAL)[number]['icono'] }) {
  const trazos = {
    usuarios: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    calendario: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    usuario: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    grafica: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className="barra-lateral__icono-modulo"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {trazos[nombre]}
    </svg>
  )
}

function BarraLateral({ moduloActivo, alCambiarModulo }: PropiedadesBarraLateral) {
  return (
    <aside className="barra-lateral">
      <a aria-label="Escuela, inicio" className="barra-lateral__marca" href="/">
        <span aria-hidden="true" className="barra-lateral__icono-marca">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path d="M5 6v15M9 7h7M9 11h7" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <span className="barra-lateral__nombre-marca">Escuela</span>
      </a>

      <nav aria-label="Módulos" className="barra-lateral__navegacion">
        <p className="barra-lateral__etiqueta-seccion">Módulos</p>
        <ul className="barra-lateral__lista-modulos">
          {MODULOS_BARRA_LATERAL.map((modulo) => (
            <li key={modulo.id}>
              <button
                aria-current={moduloActivo === modulo.id ? 'page' : undefined}
                className={`barra-lateral__modulo${moduloActivo === modulo.id ? ' barra-lateral__modulo--activo' : ''}`}
                onClick={() => alCambiarModulo(modulo.id)}
                title={modulo.nombre}
                type="button"
              >
                <IconoModulo nombre={modulo.icono} />
                <span>{modulo.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default BarraLateral

import '../styles/reportesInicio.css'

interface ReportesInicioProps {
  alAbrirCalificaciones: () => void
}

export default function ReportesInicio({
  alAbrirCalificaciones,
}: ReportesInicioProps) {
  return (
    <section
      className="reportes-inicio"
      aria-labelledby="titulo-reportes"
    >
      <header className="reportes-inicio__encabezado">
        <p className="reportes-inicio__etiqueta">
          Módulo de reportes
        </p>
        <h1 id="titulo-reportes">Reportes</h1>
        <p>
          Selecciona el tipo de reporte que deseas consultar o generar.
        </p>
      </header>

      <div className="reportes-inicio__grid">
        <button
          className="reporte-card reporte-card--activo"
          onClick={alAbrirCalificaciones}
          type="button"
        >
          <span className="reporte-card__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path
                d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8 8h8M8 12h8M8 16h4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>

          <span className="reporte-card__contenido">
            <strong>Reporte de calificaciones</strong>
            <small>
              Consulta promedios, alumnos en riesgo y calificaciones por materia.
            </small>
          </span>

          <span className="reporte-card__estado reporte-card__estado--disponible">
            Disponible
          </span>
        </button>

        <article className="reporte-card reporte-card--proximo">
          <span className="reporte-card__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path
                d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
              <path
                d="m9 15 2 2 4-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>

          <span className="reporte-card__contenido">
            <strong>Reporte de asistencia</strong>
            <small>
              Consulta asistencia y faltas por grupo y periodo.
            </small>
          </span>

          <span className="reporte-card__estado">
            Próximamente
          </span>
        </article>

        <article className="reporte-card reporte-card--proximo">
          <span className="reporte-card__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path
                d="M4 20V10M10 20V4M16 20v-7M22 20H2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>

          <span className="reporte-card__contenido">
            <strong>Otros reportes académicos</strong>
            <small>
              Espacio disponible para futuros reportes del sistema.
            </small>
          </span>

          <span className="reporte-card__estado">
            Próximamente
          </span>
        </article>
      </div>

      <aside className="reportes-inicio__nota">
        <strong>Reporte disponible</strong>
        <p>
          Actualmente puedes generar el reporte de calificaciones. Los demás
          tipos se habilitarán conforme se integren sus módulos.
        </p>
      </aside>
    </section>
  )
}

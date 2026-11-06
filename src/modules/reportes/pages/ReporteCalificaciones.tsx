import { useEffect, useMemo, useState } from 'react'
import {
  exportarReporteExcel,
  exportarReportePdf,
  generarReporteCalificaciones,
  obtenerOpcionesReporte,
} from '../services/reporteCalificacionesService'
import type {
  FiltrosReporteCalificaciones,
  OpcionesReporteCalificaciones,
  ReporteCalificaciones as ReporteCalificacionesTipo,
} from '../types/ReporteCalificaciones'
import '../styles/reporteCalificaciones.css'

const OPCIONES_VACIAS: OpcionesReporteCalificaciones = {
  ciclos: [],
  grados: [],
  grupos: [],
  materias: [],
  periodos: [],
}

interface ReporteCalificacionesProps {
  alVolver?: () => void
}

function nota(valor: number | null): string {
  if (valor === null) return '—'
  return Number.isInteger(valor)
    ? String(valor)
    : valor.toFixed(1)
}

export default function ReporteCalificaciones({
  alVolver,
}: ReporteCalificacionesProps) {
  const [opciones, setOpciones] =
    useState(OPCIONES_VACIAS)
  const [filtros, setFiltros] =
    useState<FiltrosReporteCalificaciones | null>(null)
  const [reporte, setReporte] =
    useState<ReporteCalificacionesTipo | null>(null)
  const [cargando, setCargando] = useState(true)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')

  const gruposDisponibles = useMemo(
    () =>
      opciones.grupos.filter(
        (grupo) => grupo.gradoId === filtros?.gradoId,
      ),
    [opciones.grupos, filtros?.gradoId],
  )

  const materiasDisponibles = useMemo(
    () =>
      opciones.materias.filter(
        (materia) => materia.gradoId === filtros?.gradoId,
      ),
    [opciones.materias, filtros?.gradoId],
  )

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const datos = await obtenerOpcionesReporte()

        if (!activo) return

        setOpciones(datos)

        const primerGradoConMaterias =
          datos.grados.find((grado) =>
            datos.materias.some(
              (materia) => materia.gradoId === grado.id,
            ),
          ) ?? datos.grados[0]

        const ciclo = datos.ciclos[0]
        const grado = primerGradoConMaterias
        const grupo = datos.grupos.find(
          (item) => item.gradoId === grado?.id,
        )
        const periodo = datos.periodos[0]

        if (ciclo && grado && grupo && periodo) {
          const iniciales: FiltrosReporteCalificaciones = {
            cicloId: ciclo.id,
            gradoId: grado.id,
            grupoId: grupo.id,
            periodo,
          }

          setFiltros(iniciales)
          setReporte(
            await generarReporteCalificaciones(iniciales),
          )
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'No fue posible cargar el reporte',
        )
      } finally {
        if (activo) setCargando(false)
      }
    }

    void cargar()

    return () => {
      activo = false
    }
  }, [])

  function cambiarGrado(gradoId: number) {
    const primerGrupo = opciones.grupos.find(
      (grupo) => grupo.gradoId === gradoId,
    )

    setFiltros((actual) =>
      actual
        ? {
            ...actual,
            gradoId,
            grupoId: primerGrupo?.id ?? 0,
            materiaId: undefined,
          }
        : actual,
    )
  }

  async function generar() {
    if (!filtros || !filtros.grupoId) return

    setGenerando(true)
    setError('')

    try {
      setReporte(
        await generarReporteCalificaciones(filtros),
      )
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No fue posible generar el reporte',
      )
    } finally {
      setGenerando(false)
    }
  }

  function cancelar() {
    setReporte(null)
  }

  if (cargando) {
    return (
      <div className="reporte-calificaciones__estado">
        Cargando reporte de calificaciones…
      </div>
    )
  }

  return (
    <section
      className="reporte-calificaciones"
      aria-labelledby="titulo-reporte-calificaciones"
    >
      {alVolver ? (
        <button
          className="reporte-calificaciones__volver"
          onClick={alVolver}
          type="button"
        >
          Volver a reportes
        </button>
      ) : null}

      <header className="reporte-calificaciones__encabezado">
        <div>
          <h1 id="titulo-reporte-calificaciones">
            Reporte de calificaciones
          </h1>
          <p>
            Genera un resumen del desempeño del grupo por
            materia y exporta el reporte en PDF o Excel.
          </p>
        </div>

        <div className="reporte-calificaciones__exportar">
          <button
            className="boton boton--secundario"
            disabled={!reporte}
            onClick={() =>
              reporte && exportarReportePdf(reporte)
            }
            type="button"
          >
            Exportar PDF
          </button>

          <button
            className="boton boton--primario"
            disabled={!reporte}
            onClick={() =>
              reporte && exportarReporteExcel(reporte)
            }
            type="button"
          >
            Exportar Excel
          </button>
        </div>
      </header>

      {filtros ? (
        <div className="reporte-calificaciones__filtros">
          <label>
            <span>Ciclo escolar</span>
            <select
              value={filtros.cicloId}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  cicloId: Number(e.target.value),
                })
              }
            >
              {opciones.ciclos.map((ciclo) => (
                <option key={ciclo.id} value={ciclo.id}>
                  {ciclo.nombre ?? `${ciclo.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Grado</span>
            <select
              value={filtros.gradoId}
              onChange={(e) =>
                cambiarGrado(Number(e.target.value))
              }
            >
              {opciones.grados.map((grado) => (
                <option key={grado.id} value={grado.id}>
                  {grado.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Grupo</span>
            <select
              value={filtros.grupoId}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  grupoId: Number(e.target.value),
                })
              }
            >
              {gruposDisponibles.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Materia</span>
            <select
              value={filtros.materiaId ?? ''}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  materiaId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Todas</option>
              {materiasDisponibles.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Periodo</span>
            <select
              value={filtros.periodo}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  periodo: e.target.value,
                })
              }
            >
              {opciones.periodos.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {periodo}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {error ? (
        <div
          className="reporte-calificaciones__error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {reporte ? (
        <>
          <section
            className="reporte-resumen"
            aria-label="Resumen del reporte"
          >
            <div className="reporte-resumen__titulo">
              <strong>Resumen de esta página</strong>
              <span>
                {reporte.filtros.grado}{' '}
                {reporte.filtros.grupo} ·{' '}
                {reporte.filtros.periodo}
              </span>
            </div>

            <div className="reporte-resumen__tarjetas">
              <article>
                <small>PROMEDIO GENERAL</small>
                <strong>
                  {nota(reporte.resumen.promedioGeneral)}
                </strong>
                <p>
                  {reporte.resumen.totalAlumnos} alumnos
                  visibles · {reporte.resumen.totalMaterias}{' '}
                  materias
                </p>
              </article>

              <article>
                <small>APROBADOS</small>
                <strong>
                  {reporte.resumen.aprobados} /{' '}
                  {reporte.resumen.totalAlumnos}
                </strong>
                <p>Promedio igual o mayor a 6.0</p>
              </article>

              <article>
                <small>EN RIESGO</small>
                <strong>
                  {reporte.resumen.enRiesgo} /{' '}
                  {reporte.resumen.totalAlumnos}
                </strong>
                <p>Promedio menor a 6.0</p>
              </article>
            </div>
          </section>

          <div className="reporte-tabla-contenedor">
            <table className="reporte-tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ALUMNO</th>

                  {reporte.materias.map((materia) => (
                    <th key={materia.id}>
                      {materia.nombre.toUpperCase()}
                    </th>
                  ))}

                  <th>PROMEDIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>

              <tbody>
                {reporte.alumnos.map((alumno, index) => (
                  <tr
                    className={
                      alumno.estado === 'EN_RIESGO'
                        ? 'reporte-tabla__fila--riesgo'
                        : ''
                    }
                    key={alumno.id}
                  >
                    <td>{index + 1}</td>

                    <td className="reporte-tabla__alumno">
                      {alumno.nombre}
                    </td>

                    {alumno.calificaciones.map((item) => (
                      <td key={item.materiaId}>
                        {nota(item.valor)}
                      </td>
                    ))}

                    <td className="reporte-tabla__promedio">
                      {nota(alumno.promedio)}
                    </td>

                    <td>
                      <span
                        className={`estado estado--${alumno.estado.toLowerCase()}`}
                      >
                        {alumno.estado === 'APROBADO'
                          ? 'Aprobado'
                          : alumno.estado === 'EN_RIESGO'
                            ? 'En riesgo'
                            : 'Sin calificar'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="reporte-calificaciones__pie">
            <p>
              Mostrando {reporte.alumnos.length} alumnos ·{' '}
              {reporte.materias.length} materias ·{' '}
              {reporte.filtros.periodo}
            </p>

            <div>
              <button
                className="boton boton--secundario"
                onClick={cancelar}
                type="button"
              >
                Cancelar
              </button>

              <button
                className="boton boton--primario"
                disabled={generando}
                onClick={() => void generar()}
                type="button"
              >
                {generando
                  ? 'Generando…'
                  : 'Generar reporte'}
              </button>
            </div>
          </footer>
        </>
      ) : (
        <div className="reporte-calificaciones__vacio">
          Selecciona los filtros y presiona “Generar reporte”.
          <button
            className="boton boton--primario"
            disabled={!filtros || generando}
            onClick={() => void generar()}
            type="button"
          >
            Generar reporte
          </button>
        </div>
      )}
    </section>
  )
}

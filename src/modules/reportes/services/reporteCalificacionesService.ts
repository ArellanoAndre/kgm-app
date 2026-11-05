import type {
  FiltrosReporteCalificaciones,
  OpcionesReporteCalificaciones,
  ReporteCalificaciones,
} from '../types/ReporteCalificaciones'

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3000'

async function procesarRespuesta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detalle = await response.text()
    throw new Error(detalle || `Error HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function obtenerOpcionesReporte(
  escuelaId = 1,
): Promise<OpcionesReporteCalificaciones> {
  const response = await fetch(
    `${API_URL}/reportes/calificaciones/opciones?escuelaId=${escuelaId}`,
  )
  return procesarRespuesta<OpcionesReporteCalificaciones>(response)
}

export async function generarReporteCalificaciones(
  filtros: FiltrosReporteCalificaciones,
  escuelaId = 1,
): Promise<ReporteCalificaciones> {
  const params = new URLSearchParams({
    escuelaId: String(escuelaId),
    cicloId: String(filtros.cicloId),
    gradoId: String(filtros.gradoId),
    grupoId: String(filtros.grupoId),
    periodo: filtros.periodo,
  })

  if (filtros.materiaId) {
    params.set('materiaId', String(filtros.materiaId))
  }

  const response = await fetch(
    `${API_URL}/reportes/calificaciones?${params.toString()}`,
  )
  return procesarRespuesta<ReporteCalificaciones>(response)
}

function escaparHtml(valor: string): string {
  return valor
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function formatoNota(valor: number | null): string {
  if (valor === null) return '—'
  return Number.isInteger(valor) ? String(valor) : valor.toFixed(1)
}

function nombreEstado(estado: string): string {
  if (estado === 'APROBADO') return 'Aprobado'
  if (estado === 'EN_RIESGO') return 'En riesgo'
  return 'Sin calificar'
}

export function exportarReporteExcel(reporte: ReporteCalificaciones): void {
  const encabezadosMaterias = reporte.materias
    .map((materia) => `<th>${escaparHtml(materia.nombre)}</th>`)
    .join('')

  const filas = reporte.alumnos
    .map(
      (alumno, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escaparHtml(alumno.nombre)}</td>
          ${alumno.calificaciones.map((item) => `<td>${formatoNota(item.valor)}</td>`).join('')}
          <td>${formatoNota(alumno.promedio)}</td>
          <td>${nombreEstado(alumno.estado)}</td>
        </tr>`,
    )
    .join('')

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"></head>
      <body>
        <h1>Reporte de calificaciones</h1>
        <p>Ciclo: ${escaparHtml(reporte.filtros.cicloEscolar ?? '')} | Grado: ${escaparHtml(reporte.filtros.grado)} | Grupo: ${escaparHtml(reporte.filtros.grupo)} | Periodo: ${escaparHtml(reporte.filtros.periodo)}</p>
        <p>Promedio general: ${formatoNota(reporte.resumen.promedioGeneral)} | Aprobados: ${reporte.resumen.aprobados}/${reporte.resumen.totalAlumnos} | En riesgo: ${reporte.resumen.enRiesgo}/${reporte.resumen.totalAlumnos}</p>
        <table border="1">
          <thead><tr><th>#</th><th>Alumno</th>${encabezadosMaterias}<th>Promedio</th><th>Estado</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </body>
    </html>`

  const blob = new Blob(['\ufeff', html], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `reporte_calificaciones_${reporte.filtros.grado}_${reporte.filtros.grupo}_${reporte.filtros.periodo.replaceAll(' ', '_')}.xls`
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)
}

export function exportarReportePdf(reporte: ReporteCalificaciones): void {
  const ventana = window.open('', '_blank', 'width=1100,height=800')
  if (!ventana) {
    throw new Error('El navegador bloqueó la ventana para exportar el PDF')
  }

  const encabezadosMaterias = reporte.materias
    .map((materia) => `<th>${escaparHtml(materia.nombre)}</th>`)
    .join('')
  const filas = reporte.alumnos
    .map(
      (alumno, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escaparHtml(alumno.nombre)}</td>
        ${alumno.calificaciones.map((item) => `<td>${formatoNota(item.valor)}</td>`).join('')}
        <td>${formatoNota(alumno.promedio)}</td>
        <td>${nombreEstado(alumno.estado)}</td>
      </tr>`,
    )
    .join('')

  ventana.document.write(`<!doctype html>
    <html><head><meta charset="utf-8"><title>Reporte de calificaciones</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111827}h1{margin:0 0 6px;font-size:24px}p{font-size:12px;color:#4b5563}
      .resumen{display:flex;gap:12px;margin:18px 0}.card{border:1px solid #d1d5db;padding:10px 14px;border-radius:6px;min-width:150px}.card b{font-size:20px;display:block;color:#111827}
      table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #d1d5db;padding:6px;text-align:center}th:nth-child(2),td:nth-child(2){text-align:left}th{background:#f3f4f6}
      @page{size:landscape;margin:10mm}
    </style></head><body>
    <h1>Reporte de calificaciones</h1>
    <p>${escaparHtml(reporte.filtros.cicloEscolar ?? '')} · ${escaparHtml(reporte.filtros.grado)} ${escaparHtml(reporte.filtros.grupo)} · ${escaparHtml(reporte.filtros.periodo)}</p>
    <div class="resumen"><div class="card">Promedio general<b>${formatoNota(reporte.resumen.promedioGeneral)}</b></div><div class="card">Aprobados<b>${reporte.resumen.aprobados}/${reporte.resumen.totalAlumnos}</b></div><div class="card">En riesgo<b>${reporte.resumen.enRiesgo}/${reporte.resumen.totalAlumnos}</b></div></div>
    <table><thead><tr><th>#</th><th>Alumno</th>${encabezadosMaterias}<th>Promedio</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table>
    <script>window.addEventListener('load',()=>{setTimeout(()=>window.print(),150)})<\/script>
    </body></html>`)
  ventana.document.close()
}

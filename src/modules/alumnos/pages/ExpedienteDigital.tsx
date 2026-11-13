import { useEffect, useMemo, useRef, useState } from 'react'
import { eliminarDocumento, listarDocumentos, subirDocumento, urlDocumento } from '../services/documentoService'
import type { DocumentoAlumno } from '../types/documentos'
import type { Alumno } from '../types/Alumno'
import { obtenerAlumnoPorId } from '../services/alumnoService'
import { TIPOS_DOCUMENTO, type TipoDocumento } from '../types/documentos'
import '../styles/expediente.css'

interface ExpedienteDigitalProps {
  alumnoId: number
  onVolver?: () => void
}

const ejemplos = ['Acta de nacimiento', 'CURP', 'Comprobante de domicilio', 'Documento de inscripción', 'Otro']

function iniciales(alumno: Alumno) {
  return `${alumno.nombres[0] ?? ''}${alumno.apellidoPaterno[0] ?? ''}`.toUpperCase()
}

function fecha(value: string | null) {
  return value ? new Date(value).toLocaleDateString('es-MX') : '—'
}

export default function ExpedienteDigital({ alumnoId, onVolver }: ExpedienteDigitalProps) {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [documentos, setDocumentos] = useState<DocumentoAlumno[]>([])
  const [tipo, setTipo] = useState<TipoDocumento | ''>('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    obtenerAlumnoPorId(alumnoId)
      .then(setAlumno)
      .catch(() => setMensaje('No fue posible consultar la información del alumno.'))
  }, [alumnoId])

  useEffect(() => {
    if (!alumno) return
    setCargando(true)
    listarDocumentos(alumno.id)
      .then(setDocumentos)
      .catch(() => setMensaje('No fue posible consultar los documentos del alumno.'))
      .finally(() => setCargando(false))
  }, [alumno])

  const nombreCompleto = useMemo(
    () => alumno
      ? `${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.trim()
      : '',
    [alumno],
  )

  if (!alumno) return <main className="expediente-page"><p className="expediente-empty">Cargando expediente…</p></main>

  const seleccionarArchivo = (file: File | undefined) => {
    if (!file) return
    setArchivo(file)
    setMensaje(null)
  }

  const cargarDocumento = async () => {
    if (!tipo) return setMensaje('Selecciona el tipo de documento.')
    if (!archivo) return setMensaje('Selecciona o arrastra un archivo.')

    try {
      setMensaje(null)
      const documento = await subirDocumento(alumno.id, tipo, archivo)
      setDocumentos((actuales) => [documento, ...actuales])
      setArchivo(null)
      setTipo('')
      if (inputRef.current) inputRef.current.value = ''
      setMensaje('Documento cargado correctamente.')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No fue posible cargar el documento.')
    }
  }

  const quitarArchivo = () => {
    setArchivo(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const borrarDocumento = async (id: number) => {
    if (!window.confirm('¿Eliminar este documento del expediente?')) return
    try {
      await eliminarDocumento(id)
      setDocumentos((actuales) => actuales.filter((documento) => documento.id !== id))
      setMensaje('Documento eliminado correctamente.')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No fue posible eliminar el documento.')
    }
  }

  return (
    <main className="expediente-page">
      <header className="expediente-heading">
        <div>
          {onVolver && <button className="expediente-back" type="button" onClick={onVolver}>← Alumnos</button>}
          <h1>Expediente digital</h1>
          <p>Sube y consulta documentos del alumno en un solo lugar.</p>
        </div>
      </header>

      <section className="expediente-student-card">
        <div className="expediente-avatar">{iniciales(alumno)}</div>
        <div className="expediente-student-info">
          <h2>{nombreCompleto}</h2>
          <p>CURP {alumno.curp}</p>
          <div className="expediente-student-data">
            <span><b>GRADO</b>{alumno.grado}</span>
            <span><b>GRUPO</b>{alumno.grupo}</span>
            <span><b>CICLO ESCOLAR</b>{alumno.cicloEscolar}</span>
            <span><b>ESTADO</b><em>{alumno.estado}</em></span>
          </div>
        </div>
      </section>

      <section className="expediente-panel">
        <div className="expediente-panel-title">
          <div><h2>Subir documento</h2><p>Selecciona el tipo de documento antes de cargar el archivo.</p></div>
          <span className="expediente-count">Tipos disponibles</span>
        </div>
        <div className="expediente-upload-grid">
          <label><b>Tipo de documento</b><select value={tipo} onChange={(event) => setTipo(event.target.value as TipoDocumento | '')}><option value="">Selecciona un tipo</option>{TIPOS_DOCUMENTO.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
           <div><b>Archivo</b><button className={`expediente-dropzone ${arrastrando ? 'is-dragging' : ''}`} type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setArrastrando(true) }} onDragLeave={() => setArrastrando(false)} onDrop={(event) => { event.preventDefault(); setArrastrando(false); seleccionarArchivo(event.dataTransfer.files[0]) }}><strong>{archivo ? archivo.name : 'Seleccionar archivo'}</strong><small>{archivo ? `${(archivo.size / 1024 / 1024).toFixed(2)} MB · listo para cargar` : 'Arrastra aquí · PDF, JPG o PNG · máximo 5 MB'}</small></button><input ref={inputRef} hidden type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => seleccionarArchivo(event.target.files?.[0])} />{archivo && <button className="expediente-remove-file" type="button" onClick={quitarArchivo}>Quitar archivo seleccionado</button>}</div>
        </div>
        <div className="expediente-upload-actions"><button className="expediente-primary" type="button" onClick={cargarDocumento}>Guardar documento</button><span>El archivo seleccionado se vinculará al expediente del alumno.</span></div>
        <div className="expediente-examples"><b>Ejemplos de tipos de documento</b><div>{ejemplos.map((item) => <span key={item}>{item}</span>)}</div></div>
        {mensaje && <p className="expediente-message" role="status">{mensaje}</p>}
      </section>

      <section className="expediente-panel expediente-documents">
        <div className="expediente-panel-title"><div><h2>Documentos del alumno</h2><p>Consulta, descarga y administra los archivos subidos.</p></div><span className="expediente-count">{documentos.length} documentos</span></div>
        {cargando ? <p className="expediente-empty">Cargando documentos…</p> : documentos.length === 0 ? <p className="expediente-empty">Todavía no hay documentos cargados.</p> : <div className="expediente-table-wrap"><table><thead><tr><th>DOCUMENTO</th><th>TIPO</th><th>FECHA</th><th>ESTADO</th><th>ACCIONES</th></tr></thead><tbody>{documentos.map((documento) => <tr key={documento.id}><td><strong>{documento.nombreArchivo}</strong></td><td>{documento.tipo}</td><td>{fecha(documento.createdAt)}</td><td><em className="expediente-status">Validado</em></td><td><div className="expediente-actions"><a href={urlDocumento(documento.id)} target="_blank" rel="noreferrer">Ver</a><a href={urlDocumento(documento.id)} download={documento.nombreArchivo}>Descargar</a><button type="button" onClick={() => borrarDocumento(documento.id)}>Eliminar</button></div></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  )
}

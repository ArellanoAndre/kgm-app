import { useState, type FormEvent } from 'react'
import '../styles/alumnos.css'

type Props = {
  alVolver: () => void
}

type DatosAlumno = {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  curp: string
  fechaNacimiento: string
  genero: string
  telefono: string
  correo: string
  direccion: string
  grado: string
  grupo: string
  turno: string
  tutorNombre: string
  tutorParentesco: string
  tutorTelefono: string
  documentos: string[]
}

const INICIALES: DatosAlumno = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  curp: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  correo: '',
  direccion: '',
  grado: '',
  grupo: '',
  turno: '',
  tutorNombre: '',
  tutorParentesco: '',
  tutorTelefono: '',
  documentos: [],
}

const PASOS = [
  'Datos personales',
  'Datos escolares',
  'Padres / Tutores',
  'Documentos',
  'Confirmación',
]

export default function RegistrarAlumno({ alVolver }: Props) {
  const [paso, setPaso] = useState(0)
  const [datos, setDatos] = useState<DatosAlumno>(INICIALES)
  const [error, setError] = useState('')
  const [finalizado, setFinalizado] = useState(false)

  function actualizar(campo: keyof DatosAlumno, valor: string) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setError('')
  }

  function siguiente() {
    if (paso === 0) {
      if (!datos.nombre.trim() || !datos.apellidoPaterno.trim() ||
          !datos.curp.trim() || !datos.fechaNacimiento) {
        setError('Completa nombre, apellido paterno, CURP y fecha de nacimiento.')
        return
      }

      if (!/^[A-Z0-9]{18}$/.test(datos.curp.trim().toUpperCase())) {
        setError('La CURP debe tener 18 caracteres alfanuméricos.')
        return
      }
    }

    if (paso === 1 && (!datos.grado || !datos.grupo || !datos.turno)) {
      setError('Selecciona grado, grupo y turno.')
      return
    }

    if (paso === 2 && (!datos.tutorNombre.trim() ||
        !datos.tutorParentesco || !datos.tutorTelefono.trim())) {
      setError('Completa los datos obligatorios del tutor.')
      return
    }

    setError('')
    setPaso((actual) => Math.min(actual + 1, PASOS.length - 1))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (paso !== PASOS.length - 1) {
      siguiente()
      return
    }

    // Solo demostración visual; todavía no se guarda en una base de datos.
    setFinalizado(true)
  }

  const campo = (
    titulo: string,
    clave: keyof DatosAlumno,
    tipo = 'text',
    obligatorio = false,
  ) => (
    <label className="registro-campo" key={clave}>
      <span>{titulo}{obligatorio ? ' *' : ''}</span>
      <input
        type={tipo}
        value={datos[clave] as string}
        onChange={(evento) => actualizar(clave, evento.target.value)}
        required={obligatorio}
      />
    </label>
  )

  if (finalizado) {
    return (
      <section className="pagina-alumnos registro-pagina">
        <div className="registro-exito">
          <h1>Registro de prueba completado</h1>
          <p>
            Se completó el formulario de {datos.nombre} {datos.apellidoPaterno}.
          </p>
          <p>
            Este registro es una demostración del frontend.
            Todavía no se ha guardado ningún alumno.
          </p>
          <button className="boton-primario-alumnos" onClick={alVolver}>
            Volver a alumnos
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="pagina-alumnos registro-pagina">
      <header className="registro-encabezado">
        <div>
          <h1>Registrar nuevo alumno</h1>
          <p>Completa la información para incorporar un alumno al sistema.</p>
        </div>
        <button type="button" className="registro-secundario" onClick={alVolver}>
          Volver a alumnos
        </button>
      </header>

      <nav className="registro-pasos" aria-label="Pasos del registro">
        {PASOS.map((nombre, indice) => (
          <div
            key={nombre}
            className={`registro-paso ${indice === paso ? 'registro-paso--activo' : ''}`}
          >
            <span>{indice + 1}</span>
            <small>{nombre}</small>
          </div>
        ))}
      </nav>

      <form className="registro-panel" onSubmit={enviar} noValidate>
        <h2>{PASOS[paso]}</h2>
        <p className="registro-descripcion">
          Paso {paso + 1} de {PASOS.length}
        </p>

        {paso === 0 && (
          <div className="registro-grid">
            {campo('Nombre(s)', 'nombre', 'text', true)}
            {campo('Apellido paterno', 'apellidoPaterno', 'text', true)}
            {campo('Apellido materno', 'apellidoMaterno')}
            {campo('CURP', 'curp', 'text', true)}
            {campo('Fecha de nacimiento', 'fechaNacimiento', 'date', true)}
            <label className="registro-campo">
              <span>Género</span>
              <select value={datos.genero}
                onChange={(e) => actualizar('genero', e.target.value)}>
                <option value="">Seleccionar</option>
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
                <option>Prefiero no decirlo</option>
              </select>
            </label>
            {campo('Teléfono', 'telefono', 'tel')}
            {campo('Correo electrónico', 'correo', 'email')}
            {campo('Dirección', 'direccion')}
          </div>
        )}

        {paso === 1 && (
          <div className="registro-grid">
            <label className="registro-campo">
              <span>Grado *</span>
              <select value={datos.grado}
                onChange={(e) => actualizar('grado', e.target.value)}>
                <option value="">Seleccionar grado</option>
                {['1°', '2°', '3°', '4°', '5°', '6°'].map((grado) =>
                  <option key={grado}>{grado}</option>)}
              </select>
            </label>
            <label className="registro-campo">
              <span>Grupo *</span>
              <select value={datos.grupo}
                onChange={(e) => actualizar('grupo', e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {['A', 'B', 'C', 'D'].map((grupo) =>
                  <option key={grupo}>{grupo}</option>)}
              </select>
            </label>
            <label className="registro-campo">
              <span>Turno *</span>
              <select value={datos.turno}
                onChange={(e) => actualizar('turno', e.target.value)}>
                <option value="">Seleccionar turno</option>
                <option>Matutino</option>
                <option>Vespertino</option>
              </select>
            </label>
          </div>
        )}

        {paso === 2 && (
          <div className="registro-grid">
            {campo('Nombre completo del tutor', 'tutorNombre', 'text', true)}
            <label className="registro-campo">
              <span>Parentesco *</span>
              <select value={datos.tutorParentesco}
                onChange={(e) => actualizar('tutorParentesco', e.target.value)}>
                <option value="">Seleccionar parentesco</option>
                <option>Madre</option>
                <option>Padre</option>
                <option>Abuelo/a</option>
                <option>Otro</option>
              </select>
            </label>
            {campo('Teléfono del tutor', 'tutorTelefono', 'tel', true)}
          </div>
        )}

        {paso === 3 && (
          <div>
            <p>
              En esta primera versión puedes continuar sin adjuntar documentos.
              La carga de archivos se implementará posteriormente.
            </p>
            <div className="registro-documentos">
              {['Acta de nacimiento', 'CURP', 'Comprobante de domicilio',
                'Certificado de estudios'].map((documento) => (
                <label key={documento}>
                  <input type="checkbox"
                    checked={datos.documentos.includes(documento)}
                    onChange={(e) => setDatos((actuales) => ({
                      ...actuales,
                      documentos: e.target.checked
                        ? [...actuales.documentos, documento]
                        : actuales.documentos.filter((d) => d !== documento),
                    }))}
                  />
                  {documento} (marcar como entregado)
                </label>
              ))}
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="registro-resumen">
            <h3>Revisar información</h3>
            <p><strong>Alumno:</strong> {datos.nombre} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
            <p><strong>CURP:</strong> {datos.curp.toUpperCase()}</p>
            <p><strong>Fecha de nacimiento:</strong> {datos.fechaNacimiento}</p>
            <p><strong>Grado y grupo:</strong> {datos.grado} {datos.grupo}</p>
            <p><strong>Turno:</strong> {datos.turno}</p>
            <p><strong>Tutor:</strong> {datos.tutorNombre} ({datos.tutorParentesco})</p>
            <p><strong>Documentos marcados:</strong> {datos.documentos.length}</p>
            <p className="registro-aviso">
              Al confirmar se mostrará una pantalla de éxito de prueba.
              No se enviarán datos al servidor.
            </p>
          </div>
        )}

        {error && <p className="registro-error" role="alert">{error}</p>}

        <footer className="registro-acciones">
          <button
            type="button"
            className="registro-secundario"
            onClick={() => {
              if (paso === 0) alVolver()
              else {
                setPaso((actual) => actual - 1)
                setError('')
              }
            }}
          >
            {paso === 0 ? 'Cancelar' : 'Anterior'}
          </button>

          <button type="submit" className="boton-primario-alumnos">
            {paso === 4 ? 'Confirmar registro' : 'Siguiente'}
          </button>
        </footer>
      </form>
    </section>
  )
}

import '../styles/registro-alumno.css'

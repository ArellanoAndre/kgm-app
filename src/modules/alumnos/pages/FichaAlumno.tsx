import { useState } from 'react'
import type { AlumnoConsulta } from '../types/AlumnoConsulta'
import '../styles/ficha-alumno.css'

type Props = {
  alumno: AlumnoConsulta
  alVolver: () => void
}

type Pestana = 'general' | 'escolares' | 'tutores' | 'expediente'

export default function FichaAlumno({ alumno, alVolver }: Props) {
  const [pestana, setPestana] = useState<Pestana>('general')

  const nombreCompleto = [
    alumno.nombre,
    alumno.apellidoPaterno,
    alumno.apellidoMaterno,
  ].filter(Boolean).join(' ')

  const tutorPrincipal =
    alumno.tutores.find((tutor) => tutor.esPrincipal) ?? alumno.tutores[0]

  const nombreTutor = tutorPrincipal
    ? [
        tutorPrincipal.nombre,
        tutorPrincipal.apellidoPaterno,
        tutorPrincipal.apellidoMaterno,
      ].filter(Boolean).join(' ')
    : 'No registrado'

  const iniciales = [
    alumno.nombre.charAt(0),
    alumno.apellidoPaterno.charAt(0),
    alumno.apellidoMaterno.charAt(0),
  ].join('').toUpperCase()

  const dato = (etiqueta: string, valor?: string) => (
    <div className="ficha-dato">
      <span>{etiqueta}</span>
      <strong>{valor || 'No registrado'}</strong>
    </div>
  )

  return (
    <section className="pagina-alumnos ficha-pagina">
      <header className="ficha-encabezado">
        <div>
          <button
            type="button"
            className="ficha-volver"
            onClick={alVolver}
          >
            ← Volver al listado
          </button>
          <h1>Ficha del alumno</h1>
          <p>{nombreCompleto} · CURP {alumno.curp}</p>
        </div>
      </header>

      <div className="ficha-perfil">
        <div className="ficha-avatar">{iniciales}</div>
        <div className="ficha-perfil-contenido">
          <h2>{nombreCompleto}</h2>
          <p>CURP {alumno.curp}</p>

          <div className="ficha-indicadores">
            {dato('GRADO', alumno.grado)}
            {dato('GRUPO', alumno.grupo)}
            {dato('CICLO ESCOLAR', alumno.cicloEscolar)}
            <div className="ficha-dato">
              <span>ESTADO</span>
              <strong className="ficha-estado">{alumno.estado}</strong>
            </div>
          </div>
        </div>
      </div>

      <nav className="ficha-pestanas" aria-label="Secciones de la ficha">
        {([
          ['general', 'Información general'],
          ['escolares', 'Datos escolares'],
          ['tutores', 'Padres / Tutores'],
          ['expediente', 'Expediente'],
        ] as const).map(([clave, titulo]) => (
          <button
            key={clave}
            type="button"
            className={pestana === clave ? 'ficha-pestana--activa' : ''}
            onClick={() => setPestana(clave)}
          >
            {titulo}
          </button>
        ))}
      </nav>

      {pestana === 'general' && (
        <>
          <section className="ficha-tarjeta">
            <h3>Datos personales</h3>
            <div className="ficha-grid">
              {dato('NOMBRE COMPLETO', nombreCompleto)}
              {dato('CURP', alumno.curp)}
              {dato('FECHA DE NACIMIENTO', alumno.fechaNacimiento)}
              {dato('SEXO', alumno.genero)}
              {dato('CORREO', alumno.correo)}
              {dato('TELÉFONO', alumno.telefono)}
              {dato('DOMICILIO', alumno.direccion)}
              {dato('NACIONALIDAD', alumno.nacionalidad)}
            </div>
          </section>

          <section className="ficha-tarjeta">
            <h3>Datos escolares</h3>
            <div className="ficha-grid">
              {dato('GRADO', alumno.grado)}
              {dato('GRUPO', alumno.grupo)}
              {dato('CICLO ESCOLAR', alumno.cicloEscolar)}
              {dato('ESTADO', alumno.estado)}
              {dato('TURNO', alumno.turno)}
              {dato('FECHA DE INGRESO', alumno.fechaIngreso)}
              {dato('TUTOR PRINCIPAL', nombreTutor)}
              {dato('OBSERVACIONES', alumno.observaciones)}
            </div>
          </section>

          <section className="ficha-tarjeta">
            <h3>Tutor principal</h3>
            {tutorPrincipal ? (
              <div className="ficha-grid">
                {dato('NOMBRE', nombreTutor)}
                {dato('PARENTESCO', tutorPrincipal.parentesco)}
                {dato('TELÉFONO', tutorPrincipal.telefono)}
                {dato('CORREO', tutorPrincipal.correo)}
                {dato('DOMICILIO', tutorPrincipal.direccion)}
              </div>
            ) : (
              <p>No hay tutores registrados.</p>
            )}
          </section>
        </>
      )}

      {pestana === 'escolares' && (
        <section className="ficha-tarjeta">
          <h3>Datos escolares</h3>
          <div className="ficha-grid">
            {dato('GRADO', alumno.grado)}
            {dato('GRUPO', alumno.grupo)}
            {dato('CICLO ESCOLAR', alumno.cicloEscolar)}
            {dato('ESTADO', alumno.estado)}
            {dato('TURNO', alumno.turno)}
            {dato('FECHA DE INGRESO', alumno.fechaIngreso)}
            {dato('OBSERVACIONES', alumno.observaciones)}
          </div>
        </section>
      )}

      {pestana === 'tutores' && (
        <section className="ficha-tarjeta">
          <h3>Padres / Tutores</h3>
          {alumno.tutores.length === 0 ? (
            <p>No hay tutores registrados.</p>
          ) : (
            alumno.tutores.map((tutor) => (
              <div className="ficha-tutor" key={tutor.id}>
                <h4>
                  {tutor.nombre} {tutor.apellidoPaterno} {tutor.apellidoMaterno}
                  {tutor.esPrincipal && ' · Tutor principal'}
                </h4>
                <div className="ficha-grid">
                  {dato('PARENTESCO', tutor.parentesco)}
                  {dato('TELÉFONO', tutor.telefono)}
                  {dato('CORREO', tutor.correo)}
                  {dato('DOMICILIO', tutor.direccion)}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {pestana === 'expediente' && (
        <section className="ficha-tarjeta">
          <h3>Expediente del alumno</h3>
          <p>
            Los documentos del expediente estarán disponibles
            cuando se conecte el módulo con el backend.
          </p>
        </section>
      )}
    </section>
  )
}

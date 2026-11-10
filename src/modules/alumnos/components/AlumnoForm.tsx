import type { ChangeEvent, FormEvent } from 'react'
import type { Alumno } from '../types/Alumno'
import type { DocumentoAlumno, TipoDocumento } from '../types/documentos'
import { TIPOS_DOCUMENTO } from '../types/documentos'
import { urlDocumento } from '../services/documentoService'

type FormErrors = Partial<Record<string, string>>

interface AlumnoFormProps {
  alumno: Alumno
  errors: FormErrors
  saving: boolean
  onChange: (alumno: Alumno) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  documentos: DocumentoAlumno[]
  tipoDocumento: TipoDocumento
  documentoMessage: string | null
  onTipoDocumentoChange: (tipo: TipoDocumento) => void
  onArchivoChange: (archivo: File | null) => void
  onAgregarDocumento: () => void
}

const inputValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
  event.target.value

export function AlumnoForm({
  alumno,
  errors,
  saving,
  onChange,
  onSubmit,
  onCancel,
  documentos,
  tipoDocumento,
  documentoMessage,
  onTipoDocumentoChange,
  onArchivoChange,
  onAgregarDocumento,
}: AlumnoFormProps) {
  const update = <K extends keyof Alumno>(key: K, value: Alumno[K]) => {
    onChange({ ...alumno, [key]: value })
  }

  return (
    <form id="editar-alumno-form" className="alumno-form" onSubmit={onSubmit} noValidate>
      <div className="alumno-grid alumno-grid--two">
        <section className="alumno-card">
          <h2>Datos personales</h2>
          <div className="form-grid form-grid--three">
            <label>
              <span>Nombre(s)</span>
              <input
                value={alumno.nombres}
                onChange={(e) => update('nombres', inputValue(e))}
                aria-invalid={Boolean(errors.nombres)}
              />
              {errors.nombres && <small className="field-error">{errors.nombres}</small>}
            </label>
            <label>
              <span>Apellido paterno</span>
              <input
                value={alumno.apellidoPaterno}
                onChange={(e) => update('apellidoPaterno', inputValue(e))}
                aria-invalid={Boolean(errors.apellidoPaterno)}
              />
              {errors.apellidoPaterno && <small className="field-error">{errors.apellidoPaterno}</small>}
            </label>
            <label>
              <span>Apellido materno</span>
              <input value={alumno.apellidoMaterno} onChange={(e) => update('apellidoMaterno', inputValue(e))} />
            </label>
            <label>
              <span>CURP</span>
              <input value={alumno.curp} disabled title={`${alumno.curp} · Campo restringido`} />
            </label>
            <label>
              <span>Fecha de nacimiento</span>
              <input type="date" value={alumno.fechaNacimiento} onChange={(e) => update('fechaNacimiento', inputValue(e))} />
            </label>
            <label>
              <span>Género</span>
              <select value={alumno.genero} onChange={(e) => update('genero', inputValue(e))}>
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
                <option>Prefiero no indicar</option>
              </select>
            </label>
            <label>
              <span>Nacionalidad</span>
              <input value={alumno.nacionalidad} onChange={(e) => update('nacionalidad', inputValue(e))} />
            </label>
            <label>
              <span>Teléfono</span>
              <input value={alumno.telefono} onChange={(e) => update('telefono', inputValue(e))} />
            </label>
            <label>
              <span>Correo electrónico</span>
              <input
                type="email"
                value={alumno.correo}
                onChange={(e) => update('correo', inputValue(e))}
                aria-invalid={Boolean(errors.correo)}
              />
              {errors.correo && <small className="field-error">{errors.correo}</small>}
            </label>
            <label className="form-span-3">
              <span>Dirección</span>
              <input value={alumno.direccion} onChange={(e) => update('direccion', inputValue(e))} />
            </label>
          </div>
        </section>

        <section className="alumno-card">
          <h2>Datos escolares</h2>
          <div className="form-grid form-grid--four">
            <label>
              <span>Grado</span>
              <input value={alumno.grado} disabled title="Se gestiona desde Gestión académica" />
            </label>
            <label>
              <span>Grupo</span>
              <input value={alumno.grupo} disabled title="Se gestiona desde Gestión académica" />
            </label>
            <label>
              <span>Ciclo escolar</span>
              <input value={alumno.cicloEscolar} disabled title="Se gestiona desde Gestión académica" />
            </label>
            <label>
              <span>Estado</span>
              <input value={alumno.estado} disabled title="Campo restringido" />
            </label>
            <label>
              <span>Turno</span>
              <select value={alumno.turno} onChange={(e) => update('turno', inputValue(e))}>
                <option value="">Sin definir</option>
                <option>Matutino</option>
                <option>Vespertino</option>
                <option>Nocturno</option>
              </select>
            </label>
            <label>
              <span>Fecha de ingreso</span>
              <input type="date" value={alumno.fechaIngreso} onChange={(e) => update('fechaIngreso', inputValue(e))} />
            </label>
            <label>
              <span>Tutor principal</span>
              <input value={alumno.tutor.nombre} disabled title="Se gestiona desde Padres / Tutores" />
            </label>
            <label>
              <span>Parentesco</span>
              <input value={alumno.tutor.parentesco} disabled title="Se gestiona desde Padres / Tutores" />
            </label>
            <label className="form-span-4">
              <span>Observaciones</span>
              <textarea rows={2} value={alumno.observaciones} onChange={(e) => update('observaciones', inputValue(e))} />
            </label>
          </div>
        </section>

        <section className="alumno-card">
          <h2>Padres / Tutores</h2>
          <div className="form-grid form-grid--four">
            <label>
              <span>Nombre</span>
              <input value={alumno.tutor.nombre} disabled title="La edición de tutores se gestiona por separado" />
            </label>
            <label>
              <span>Parentesco</span>
              <input value={alumno.tutor.parentesco} disabled title="La edición de tutores se gestiona por separado" />
            </label>
            <label>
              <span>Teléfono</span>
              <input value={alumno.tutor.telefono} disabled title="La edición de tutores se gestiona por separado" />
            </label>
            <label>
              <span>Correo electrónico</span>
              <input value={alumno.tutor.correo} disabled title="La edición de tutores se gestiona por separado" />
            </label>
            <label className="form-span-4">
              <span>Domicilio</span>
              <input value={alumno.tutor.domicilio} disabled title="La edición de tutores se gestiona por separado" />
            </label>
          </div>
        </section>

        <section className="alumno-card">
          <div className="documents-panel-heading">
            <h2>Documentos</h2>
            <button type="button" className="button button--secondary button--small" onClick={() => document.getElementById('editar-alumno-documento')?.focus()}>
              + Agregar documento
            </button>
          </div>
          <div className="document-upload document-upload--inline" id="editar-alumno-documento">
            <label><span>Tipo de documento</span><select value={tipoDocumento} onChange={(event) => onTipoDocumentoChange(event.target.value as TipoDocumento)}>{TIPOS_DOCUMENTO.map((tipo) => <option key={tipo}>{tipo}</option>)}</select></label>
            <label><span>Archivo PDF, JPG o PNG (máximo 5 MB)</span><input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => onArchivoChange(event.target.files?.[0] ?? null)} /></label>
            <button className="button button--secondary" type="button" onClick={onAgregarDocumento}>Adjuntar documento</button>
          </div>
          {documentoMessage && <p className="form-caption">{documentoMessage}</p>}
          {documentos.length > 0 ? (
            <div className="document-grid">
              {documentos.map((documento) => (
                <div className="document-item" key={documento.id}>
                  <span>{documento.tipo}</span>
                  <a className="file-pill" href={urlDocumento(documento.id)} target="_blank" rel="noreferrer">{documento.nombreArchivo}</a>
                </div>
              ))}
            </div>
          ) : (
            <p className="form-caption">No hay documentos registrados para este alumno.</p>
          )}
        </section>
      </div>

      <aside className="permission-note" role="note">
        <strong>Permisos de edición</strong>
        <span>Solo puedes modificar los campos habilitados según tus permisos. Los campos restringidos se muestran en gris.</span>
      </aside>

      <div className="form-actions">
        <span className="form-caption">Edición de datos existentes</span>
        <div>
          <button type="button" className="button button--secondary" onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="button button--primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  )
}

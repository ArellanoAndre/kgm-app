import { useState, type FormEvent } from 'react'
import type { DatosMateria, GradoMateria, Materia } from '../types/Materia'

type PropiedadesFormularioMateria = {
  grados: GradoMateria[]
  materia?: Materia | null
  guardando: boolean
  error: string
  alGuardar: (datos: DatosMateria) => void
  alCancelar: () => void
}

export function FormularioMateria({
  grados,
  materia,
  guardando,
  error,
  alGuardar,
  alCancelar,
}: PropiedadesFormularioMateria) {
  const [nombre, setNombre] = useState(materia?.nombre ?? '')
  const [clave, setClave] = useState(materia?.clave ?? '')
  const [gradoId, setGradoId] = useState(
    materia ? String(materia.gradoId) : '',
  )

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!gradoId) return

    alGuardar({
      nombre: nombre.trim(),
      clave: clave.trim(),
      gradoId: Number(gradoId),
    })
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="form-group">
        <label className="form-label" htmlFor="materia-nombre">
          Nombre
        </label>
        <input
          autoFocus
          className="form-input"
          id="materia-nombre"
          maxLength={150}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Ej. Español"
          required
          type="text"
          value={nombre}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="materia-clave">
          Clave única
        </label>
        <input
          className="form-input"
          id="materia-clave"
          maxLength={50}
          onChange={(evento) => setClave(evento.target.value)}
          placeholder="Ej. ESP-001"
          required
          type="text"
          value={clave}
        />
        <p className="materias-formulario__ayuda">
          La clave debe ser única dentro de la escuela.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="materia-grado">
          Grado al que se le impartirá
        </label>
        <select
          className="form-select"
          disabled={grados.length === 0}
          id="materia-grado"
          onChange={(evento) => setGradoId(evento.target.value)}
          required
          value={gradoId}
        >
          <option value="">Seleccionar grado</option>
          {grados.map((grado) => (
            <option key={grado.id} value={grado.id}>
              {grado.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="materias-mensaje materias-mensaje--error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="materias-formulario__acciones">
        <button
          className="btn-primary"
          disabled={guardando || grados.length === 0}
          type="submit"
        >
          {guardando
            ? 'Guardando...'
            : materia
              ? 'Guardar cambios'
              : 'Registrar materia'}
        </button>
        <button
          className="materias-formulario__cancelar"
          disabled={guardando}
          onClick={alCancelar}
          type="button"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

import type { Alumno, AlumnoEditable } from '../types/Alumno'

const MOCK_ALUMNO: Alumno = {
  id: 1,
  nombres: 'Ana',
  apellidoPaterno: 'García',
  apellidoMaterno: 'López',
  curp: 'GALA160101MDFRPN07',
  fechaNacimiento: '2016-01-01',
  genero: 'Femenino',
  nacionalidad: 'Mexicana',
  telefono: '55 1234 5678',
  correo: 'ana.garcia@alumno.escuela.edu.mx',
  direccion: 'Calle de las Flores 18, Col. Centro, C.P. 64000',
  grado: '5° de primaria',
  grupo: 'A',
  cicloEscolar: '2026–2027',
  estado: 'Activo',
  turno: 'Matutino',
  fechaIngreso: '2022-08-08',
  observaciones: 'Alumna regular, participativa y con buen desempeño académico.',
  tutor: {
    nombre: 'Juan García',
    parentesco: 'Padre',
    telefono: '55 9876 5432',
    correo: 'juan.garcia@correo.com',
    domicilio: 'Calle de las Flores 18, Col. Centro, C.P. 64000',
    observaciones: 'Contacto principal para asistencias, reportes y reuniones académicas.',
  },
  documentos: [
    { tipo: 'Acta de nacimiento', nombreArchivo: 'acta_nacimiento.pdf' },
    { tipo: 'Comprobante de domicilio', nombreArchivo: 'comprobante_domicilio.pdf' },
    { tipo: 'Carta compromiso', nombreArchivo: 'carta_compromiso.pdf' },
    { tipo: 'Certificado médico', nombreArchivo: 'certificado_medico.pdf' },
    { tipo: 'Documento de identidad', nombreArchivo: 'ine_tutor.pdf' },
    { tipo: 'Estado de cuenta', nombreArchivo: 'estado_cuenta.pdf' },
  ],
}

let alumnoActual = structuredClone(MOCK_ALUMNO)

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export async function obtenerAlumnoPorId(id: number): Promise<Alumno> {
  await delay()
  if (id !== alumnoActual.id) {
    throw new Error('Alumno no encontrado')
  }
  return structuredClone(alumnoActual)
}

export async function actualizarAlumno(
  id: number,
  cambios: AlumnoEditable,
): Promise<Alumno> {
  await delay(350)
  if (id !== alumnoActual.id) {
    throw new Error('Alumno no encontrado')
  }

  alumnoActual = {
    ...alumnoActual,
    ...structuredClone(cambios),
  }

  return structuredClone(alumnoActual)
}

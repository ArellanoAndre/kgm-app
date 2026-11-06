import type { AlumnoConsulta as Alumno } from '../types/AlumnoConsulta'

export const ALUMNOS_DE_PRUEBA: Alumno[] = [
  {
    id: 1,
    nombre: 'Ana',
    apellidoPaterno: 'GarcÃ­a',
    apellidoMaterno: 'LÃ³pez',
    curp: 'GALA160101MDFRPN07',
    fechaNacimiento: '2016-01-01',
    genero: 'Femenino',
    nacionalidad: 'Mexicana',
    telefono: '5512345678',
    correo: 'ana.garcia@alumno.escuela.edu.mx',
    direccion: 'Calle de las Flores 18, Col. Centro',
    grado: '5Â°',
    grupo: 'A',
    cicloEscolar: '2026-2027',
    estado: 'Activo',
    turno: 'Matutino',
    fechaIngreso: '2022-08-08',
    observaciones: '',
    tutores: [
      {
        id: 1,
        nombre: 'Juan',
        apellidoPaterno: 'GarcÃ­a',
        apellidoMaterno: '',
        parentesco: 'Padre',
        telefono: '5598765432',
        correo: 'juan.garcia@correo.com',
        direccion: 'Calle de las Flores 18, Col. Centro',
        esPrincipal: true
      }
    ]
  },
  {
    id: 2,
    nombre: 'Luis',
    apellidoPaterno: 'PÃ©rez',
    apellidoMaterno: 'RamÃ­rez',
    curp: 'PERL140205HDFRMS03',
    fechaNacimiento: '2014-02-05',
    genero: 'Masculino',
    nacionalidad: 'Mexicana',
    telefono: '5512345679',
    correo: 'luis.perez@alumno.escuela.edu.mx',
    direccion: 'Ciudad de MÃ©xico',
    grado: '6Â°',
    grupo: 'B',
    cicloEscolar: '2026-2027',
    estado: 'Baja',
    turno: 'Matutino',
    fechaIngreso: '2021-08-20',
    observaciones: '',
    tutores: [
      {
        id: 2,
        nombre: 'MarÃ­a',
        apellidoPaterno: 'RamÃ­rez',
        apellidoMaterno: '',
        parentesco: 'Madre',
        telefono: '',
        correo: '',
        direccion: '',
        esPrincipal: true
      }
    ]
  },
  {
    id: 3,
    nombre: 'SofÃ­a',
    apellidoPaterno: 'MartÃ­nez',
    apellidoMaterno: 'Torres',
    curp: 'MATS170310MDFRRF06',
    fechaNacimiento: '2017-03-10',
    genero: 'Femenino',
    nacionalidad: 'Mexicana',
    telefono: '5512345680',
    correo: 'sofia.martinez@alumno.escuela.edu.mx',
    direccion: 'Ciudad de MÃ©xico',
    grado: '4Â°',
    grupo: 'A',
    cicloEscolar: '2026-2027',
    estado: 'Activo',
    turno: 'Vespertino',
    fechaIngreso: '2023-08-20',
    observaciones: '',
    tutores: [
      {
        id: 2,
        nombre: 'MarÃ­a',
        apellidoPaterno: 'RamÃ­rez',
        apellidoMaterno: '',
        parentesco: 'Madre',
        telefono: '',
        correo: '',
        direccion: '',
        esPrincipal: true
      }
    ]
  },
  {
    id: 4,
    nombre: 'Diego',
    apellidoPaterno: 'HernÃ¡ndez',
    apellidoMaterno: 'Cruz',
    curp: 'HECD110415HDFRRG05',
    fechaNacimiento: '2011-04-15',
    genero: 'Masculino',
    nacionalidad: 'Mexicana',
    telefono: '5512345681',
    correo: 'diego.hernandez@alumno.escuela.edu.mx',
    direccion: 'Ciudad de MÃ©xico',
    grado: '3Â° Sec.',
    grupo: 'C',
    cicloEscolar: '2026-2027',
    estado: 'Egresado',
    turno: 'Matutino',
    fechaIngreso: '2023-08-20',
    observaciones: '',
    tutores: [
      {
        id: 2,
        nombre: 'MarÃ­a',
        apellidoPaterno: 'RamÃ­rez',
        apellidoMaterno: '',
        parentesco: 'Madre',
        telefono: '',
        correo: '',
        direccion: '',
        esPrincipal: true
      }
    ]
  },
  {
    id: 5,
    nombre: 'Valentina',
    apellidoPaterno: 'Ruiz',
    apellidoMaterno: 'SÃ¡nchez',
    curp: 'RUSV180522MDFZNL04',
    fechaNacimiento: '2018-05-22',
    genero: 'Femenino',
    nacionalidad: 'Mexicana',
    telefono: '5512345682',
    correo: 'valentina.ruiz@alumno.escuela.edu.mx',
    direccion: 'Ciudad de MÃ©xico',
    grado: '3Â°',
    grupo: 'B',
    cicloEscolar: '2026-2027',
    estado: 'Activo',
    turno: 'Matutino',
    fechaIngreso: '2024-08-20',
    observaciones: '',
    tutores: [
      {
        id: 2,
        nombre: 'MarÃ­a',
        apellidoPaterno: 'RamÃ­rez',
        apellidoMaterno: '',
        parentesco: 'Madre',
        telefono: '',
        correo: '',
        direccion: '',
        esPrincipal: true
      }
    ]
  }
]


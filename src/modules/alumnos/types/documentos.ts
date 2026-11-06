export const TIPOS_DOCUMENTO = [
  'Acta de nacimiento',
  'CURP',
  'Identificación del tutor',
  'Comprobante de domicilio',
  'Cartilla de vacunación',
  'Certificado médico',
  'Fotografía',
  'Otro',
] as const

export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number]

export interface DocumentoAlumno {
  id: number
  alumnoId: number
  escuelaId: number
  tipo: TipoDocumento
  nombreArchivo: string
  mimeType: string
  tamanoBytes: number
  createdAt: string | null
}

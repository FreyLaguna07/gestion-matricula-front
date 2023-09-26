export class SearchUsuarioDto{
  constructor(
    public idApoderado?: number | null,
    public idUsuario?: number | null,
    public codPerfil?: String | null,
    public nroDni?: String | null,
    public nombre?: String | null,
    public apPaterno?: String | null,
    public apMaterno?: String | null,
    public fchInicio?: String | null,
    public fchFin?: String | null,

    public estadoAlumno?: number | null,
    public seccion?: string,
    public codGrado?: string | null,
    public anio?: string | null,
  ){}
}

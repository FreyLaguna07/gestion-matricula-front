export interface TbCursoDto{
  idCurso?: number | null;
  nombre?: string | null;
  codCurso?: string | null;
  descripcion?: string | null;
  horas?: string | null;
  estado?: Boolean | null;
  fchCreacion?: Date | null;
  fchActualizacion?: Date | null;

  //tb_grado
  idGrado?: number | null;
  idNuevoGrado?: number | null;
  codGrado?: string | null;
  nomGrado?: string | null;
  nivel?: string | null;

  //docente
  nomDocente?: string | null;
	apPaternoDocente?: string | null;
	apMaternoDocente?: string | null;
	nroDniDocente?: string | null;
}

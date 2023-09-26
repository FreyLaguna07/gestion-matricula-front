import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { TbMatriculaDto } from 'src/app/shared/classes';
import { SearchCurso } from 'src/app/shared/classes-custom';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TbMatriculaService {
  public readonly _url = `${environment.url}/matricula`;
  constructor(private readonly _http: HttpClient) {}

  countAlumnosMatriculados(search: SearchCurso): Observable<number> {
    return this._http.post<ApiResponse<number>>(`${this._url}/countAlumnoMatriculado`, search).pipe(map((res) => res.data));
  }

  insert(tbMatriculaDto: TbMatriculaDto): Observable<any> {
    return this._http.post<ApiResponse<TbMatriculaDto>>(`${this._url}/insert`, tbMatriculaDto).pipe(map((res)=> res.data))
  }

}

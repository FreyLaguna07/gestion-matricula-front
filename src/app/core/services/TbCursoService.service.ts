import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgSelectOption } from 'src/app/@utils/models/ngselect.interfaces';
import { TbCursoDto } from 'src/app/shared/classes';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { SearchCurso } from 'src/app/shared/classes-custom';

@Injectable({
  providedIn: 'root',
})
export class TbCursoService {
  public readonly _url = `${environment.url}/curso`;
  private _dataSelect$?: Observable<NgSelectOption<TbCursoDto>[]>;
  constructor(private readonly _http: HttpClient) {}

  listCurso(search: SearchCurso): Observable<TbCursoDto[]> {
    return this._http.post<ApiResponse<Required<TbCursoDto>[]>>(`${this._url}/list`, search).pipe(map((res) => res.data));
  }

	insert(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/insert`, entidad).pipe(map((res) => res.data));
	}

  update(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/update`, entidad).pipe(map((res) => res.data));
	}

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgSelectOption } from 'src/app/@utils/models/ngselect.interfaces';
import { TbApoderadoDto } from 'src/app/shared/classes/TbApoderadoDto';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { SearchUsuarioDto } from 'src/app/shared/classes-custom';

@Injectable({
  providedIn: 'root',
})
export class TbApoderadoService {
  public readonly _url = `${environment.url}/apoderado`;
  private _dataSelect$?: Observable<NgSelectOption<TbApoderadoDto>[]>;
  constructor(private readonly _http: HttpClient) {}

  listApoderado(search: SearchUsuarioDto): Observable<TbApoderadoDto[]> {
    return this._http.post<ApiResponse<Required<TbApoderadoDto>[]>>(`${this._url}/list`, search).pipe(map((res) => res.data));
  }

	insert(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/insert`, entidad).pipe(map((res) => res.data));
	}

  update(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/update`, entidad).pipe(map((res) => res.data));
	}
}

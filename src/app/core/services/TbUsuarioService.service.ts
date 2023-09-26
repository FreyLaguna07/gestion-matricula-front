import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { map } from 'rxjs/operators';
import { TbUsuarioDto } from 'src/app/shared/classes';
import { Observable } from 'rxjs';
import { SearchUsuarioDto } from 'src/app/shared/classes-custom';

@Injectable({
  providedIn: 'root'
})
export class TbUsuarioService {
  private readonly _url = `${environment.url}/usuario`;
  constructor(private readonly _http: HttpClient){}

  listUsuario(search: SearchUsuarioDto){
		return this._http.post<ApiResponse<Required<TbUsuarioDto>[]>>(`${this._url}/list`, search).pipe(map((res) => res.data)).toPromise();
	}

  insert(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/insert`, entidad).pipe(map((res) => res.data));
	}

  update(entidad: any): Observable<any> {
		return this._http.post<ApiResponse<any>>(`${this._url}/update`, entidad).pipe(map((res) => res.data));
	}

  listAlumMatriula(search: SearchUsuarioDto) {
    return this._http.post<ApiResponse<Required<TbUsuarioDto>[]>>(`${this._url}/listAlumMatriula`, search).pipe(map((res) => res.data)).toPromise();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { NgSelectOption } from 'src/app/@utils/models/ngselect.interfaces';
import { TbPerfilDto } from 'src/app/shared/classes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TbPerfilService {
  public readonly _url = `${environment.url}/perfil`;
  private _dataSelect$?: Observable<NgSelectOption<TbPerfilDto>[]>;
  constructor(public readonly _http: HttpClient){}

  listPerfil(): Observable<TbPerfilDto[]> {
		return this._http.get<ApiResponse<Required<TbPerfilDto>[]>>(`${this._url}/list`).pipe(map((res) => res.data));
	}

  getSelectList(): Observable<NgSelectOption<TbPerfilDto>[]> {

		if (!this._dataSelect$)
			this._dataSelect$ = this.listPerfil().pipe(
				map((data) =>
					data.map((item) => ({
						...item,
						value: ""+item.cdoPerfil,
						label: `${item.cdoPerfil} - ${item.nombre}`,
					}))
				),
				//shareReplay(1)
			);

		return this._dataSelect$;
	}
}

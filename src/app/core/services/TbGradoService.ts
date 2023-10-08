import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/@utils/models/ApiResponse';
import { NgSelectOption } from 'src/app/@utils/models/ngselect.interfaces';
import { TbGradoDto } from 'src/app/shared/classes';
import { environment } from 'src/environments/environment';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TbGradoService {
  public readonly _url = `${environment.url}/grado`;
  private _dataSelect$?: Observable<NgSelectOption<TbGradoDto>[]>;
  constructor(public readonly _http: HttpClient){}

  listGrado(nivelAcademico: String): Observable<TbGradoDto[]> {
		return this._http.get<ApiResponse<Required<TbGradoDto>[]>>(`${this._url}/list/`+`${nivelAcademico}`).pipe(map((res) => res.data));
	}

  getSelectList(nivelAcademico: String): Observable<NgSelectOption<TbGradoDto>[]> {
		//if (!this._dataSelect$)
			this._dataSelect$ = this.listGrado(nivelAcademico).pipe(
				map((data) =>
					data.map((item) => ({
						...item,
						value: item.idGrado,
						label: `${item.codGrado} - ${item.nombre}`,
					}))
				),
				shareReplay(1)
			);

		return this._dataSelect$;
	}
}

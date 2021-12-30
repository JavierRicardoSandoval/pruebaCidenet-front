import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TypeId } from '../models/type-id.interface';

@Injectable({
  providedIn: 'root'
})
export class TypesIdService {

  API = environment.url+'/typeId';

  constructor(
    private http: HttpClient
  ) { }

  getTypesId(){
    return this.http.get<TypeId[]>(this.API+'/list');
  }
}

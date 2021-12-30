import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.interface';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  API = environment.url+'/employee';

  constructor(
    private http: HttpClient
  ) { }

  getEmployess(){
    return this.http.get<Employee[]>(this.API+'/list');
  }

  findByEmail(email:string){
    return this.http.get<Employee>(this.API+`/findByEmail/${email}`);
  }

  addEmployee(employee: any){
    //let body = JSON.stringify(employee);
    //let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(this.API + '/create',employee);
  }

  removeEmployee(id: string){
    return this.http.delete(this.API+`/delete/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http: HttpClient) { }

  // Subir archivo de registros
  subirArchivo(formData: any): Observable<any> {
    return this.http.post(`${base_url}/busqueda/subir-archivo`, formData, {
      headers: {'Authorization': localStorage.getItem('token') }   
    });
  }

  // Busqueda de registro
  busquedaRegistro(dni: string): Observable<any> {
    return this.http.get(`${base_url}/busqueda`,{
      params: { dni },
      headers: {'Authorization': localStorage.getItem('token')}
    });
  }
  


}

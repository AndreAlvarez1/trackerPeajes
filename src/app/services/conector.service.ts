import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConectorService {

    public url = 'https://node-tracker-dot-nodestats-335315.wn.r.appspot.com/'
    // public url = 'http://localhost:9094';


  constructor(private http: HttpClient,
              private router: Router) { }

   getDatos( ruta:string ) {
      return this.http.get( this.url + ruta );
   }
            
    guardarDato(ruta:string, body:any) {
      return this.http.post( this.url + ruta, body );
    }

}

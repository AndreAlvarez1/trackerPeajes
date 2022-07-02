import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ParamsModel } from '../models/params.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }


  estaAutenticado(): boolean {

    if (!localStorage.getItem('paramsTracker')){
      return false;
    }

    const params = JSON.parse(localStorage.getItem('paramsTracker') || '')
    const user = params.user;

    console.log('user', user);
    if ( user.email.length > 6 && user.id != '') {
      return true;
    } else {
      return false;
    }

  }


  logOut(){
    let newParams = new ParamsModel();
    const params  = JSON.parse(localStorage.getItem('paramsTracker') || '');
    if (params.user.recordar){
      newParams.user.email    = params.user.email;
      newParams.user.recordar = params.user.recordar;
    }
     
    localStorage.setItem('paramsTracker', JSON.stringify(newParams));
    this.router.navigateByUrl('/login');
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ParamsModel } from 'src/app/models/params.model';
import { UserModel } from 'src/app/models/user.model';
import { ConectorService } from 'src/app/services/conector.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading             = false;
  params: ParamsModel = new ParamsModel();
  user: UserModel     = new UserModel();
  recordar            = true;

  constructor(private conex:ConectorService,
              public router: Router) {
    if (localStorage.getItem('paramsTracker')){
      this.params = JSON.parse(localStorage.getItem('paramsTracker') || '') ;
      if (this.params.user.recordar){
        this.user.email    = this.params.user.email;
        this.user.recordar = this.params.user.recordar;
      }
    }
   }



 
  ngOnInit(): void {
  }

 login(f:NgForm){
  console.log('this.recordar', this.recordar);
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    this.loading = true;

    this.conex.getDatos(`/user/${this.user.email}`)
              .subscribe( (resp:any) => { 
                console.log('resp', resp['datos']) 
               
                if (resp['datos'].length > 0){
                  const newUser = resp['datos'][0]

                  if (this.user.password === newUser.password ){

                    console.log('correcto,',newUser)

                    this.params.user = {
                            id: newUser.id,
                            name: newUser.name,
                            lastname: newUser.lastname,
                            type: newUser.type,
                            email: newUser.mail,
                            companyId: newUser.companyId,
                            recordar: this.recordar
                    }

                    localStorage.setItem('paramsTracker', JSON.stringify(this.params));

                    this.exito();
                    this.router.navigateByUrl('/home');
                  } else {
                    this.error('Password incorrecto')
                  }
                } else {
                  this.error('Revisa el correo por favor.')
                }
                this.loading = false;
                console.log('login', this.user);

              });

  }



  exito(){
    Swal.fire(
      'Bienvenido!',
      'Datos correctos',
      'success'
    )
  }

  error(texto:string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: texto,
    })
  }

}

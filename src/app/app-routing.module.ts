import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { AuthGuard } from './guards/auth.guard';
import { rutasTransitos } from './transitos/transitos.routes';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'home', component: HomeComponent,  canActivate: [AuthGuard]},
  {path: 'resumen', component: ResumenComponent, canActivate: [AuthGuard]},
  {path: 'transitos', children: rutasTransitos, canActivate: [AuthGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }

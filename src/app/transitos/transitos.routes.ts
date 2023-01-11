import { Routes } from '@angular/router';
import { CargaDatosComponent } from './carga-datos/carga-datos.component';
import { FacturadosComponent } from './facturados/facturados.component';
import { LimpiarBdComponent } from './limpiar-bd/limpiar-bd.component';
import { NoFacturadosComponent } from './no-facturados/no-facturados.component';
import { TodosComponent } from './todos/todos.component';


export const rutasTransitos: Routes = [
  {path: 'cargaDatos', component: CargaDatosComponent},
  {path: 'facturados', component: FacturadosComponent},
  {path: 'noFacturados', component: NoFacturadosComponent},
  {path: 'limpiarBd', component: LimpiarBdComponent},
  {path: 'todos', component: TodosComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


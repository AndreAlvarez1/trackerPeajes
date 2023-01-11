import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CargaDatosComponent } from './transitos/carga-datos/carga-datos.component';
import { FacturadosComponent } from './transitos/facturados/facturados.component';
import { NoFacturadosComponent } from './transitos/no-facturados/no-facturados.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ResumenComponent } from './components/resumen/resumen.component';
import { LimpiarBdComponent } from './transitos/limpiar-bd/limpiar-bd.component';
import { TodosComponent } from './transitos/todos/todos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    CargaDatosComponent,
    FacturadosComponent,
    NoFacturadosComponent,
    LoadingComponent,
    FilterPipe,
    ResumenComponent,
    LimpiarBdComponent,
    TodosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

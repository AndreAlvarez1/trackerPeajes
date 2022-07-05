import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { ParamsModel } from 'src/app/models/params.model';
import { ConectorService } from 'src/app/services/conector.service';
import { FormatosService } from 'src/app/services/formatos.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.css']
})
export class CargaDatosComponent implements OnInit {

  loading             = false;
  loading2            = false;
  params: ParamsModel = new ParamsModel();
  newTransitos:any    = [];
  autopista           = '';
  tipo                = '';

  facturados:any[]    = [];
  noFacturados:any[]  = [];

  constructor(private papa: Papa,
              private conex: ConectorService,
              private formatos: FormatosService) { 
      this.params = JSON.parse(localStorage.getItem('paramsTracker') || '');
  }

  ngOnInit(): void {
    this.getFacturados();
  }


  info(){
    console.log('facturados', this.facturados);
    console.log('No facturados', this.noFacturados);
  }
  getFacturados(){
    this.loading = true;
    this.conex.getDatos('/generales/transitosF').subscribe( (resp:any) => { this.facturados = resp['datos'];this.getNoFacturados();
  })
  }
 
  getNoFacturados(){
    this.conex.getDatos('/generales/transitosNF').subscribe( (resp:any) => { this.noFacturados = resp['datos']; this.loading = false; this.info()})
  }

 
  convertFile(event: any, autopista:string) {
    this.loading2 = true;

    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      console.log('aca', reader.result);
      this.tojson(reader.result, autopista)
    };
}


tojson(csvData:any, autopista:string){
  console.log('voy co tojson')
  this.papa.parse(csvData,{
    complete: (result) => {
        console.log('Parsed: ', result);
        switch(autopista){
          case 'ACFACTURADO': // Autopista central facturados - Incluye interurbanos
            const transitos1 = this.formatos.ACFACTURADO(result.data, this.params.user.companyId);
            this.tipo         = 'facturados'
            this.autopista    = 'Autopista Central Facturados';
            this.verificarRepetidos(transitos1);
            break;

          case 'ACNOFACTURADO':  // Autopista central No facturados
            const transitos2 = this.formatos.ACNOFACTURADO(result.data, this.params.user.companyId);
            console.log('transitos2', transitos2);
            this.tipo         = 'No facturados'
            this.autopista    = 'Autopista Central No Facturados';
            this.verificarRepetidosNF(transitos2);
            break;
        }
    }
});
}


verificarRepetidos(transitos:any){
  for (let t of transitos){
    const existe = this.facturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);
   if (!existe){
    this.newTransitos.push(t);
   }
  }
  if (this.newTransitos.length == 0){
    Swal.fire({
      icon: 'warning',
      title: 'No hay nuevos transitos',
      text: 'Todos los transitos del excel ya existian en la base de datos',
    })
  }
  this.loading2     = false;
}

verificarRepetidosNF(transitos:any){
  for (let t of transitos){
    const existe = this.noFacturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);
   if (!existe){
    this.newTransitos.push(t);
   }
  }
  if (this.newTransitos.length == 0){
    Swal.fire({
      icon: 'warning',
      title: 'No hay nuevos transitos',
      text: 'Todos los transitos del excel ya existian en la base de datos',
    })
  }
  this.loading2     = false;
}

guardarLote(){
  this.loading = true;
  this.conex.guardarDato(`/post/loteTransitos/${this.tipo}`, this.newTransitos)
            .subscribe( (resp:any) => {
                console.log('guardé transitos', resp);
                this.loading = false;
                this.exito('Transitos guardados con exito')
              })
}



exito(texto:string){
  Swal.fire({
    icon: 'success',
    title: 'Excelente',
    text: texto,
  })
}


}


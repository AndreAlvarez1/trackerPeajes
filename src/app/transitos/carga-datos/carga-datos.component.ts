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

  aplicaTarifa        = {
                            ACFACTURADO: true,
                            ACNOFACTURADO: true,
                            CNORTEF: false,
                            CNORTENF: false
                        }


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
    console.log('news', this.newTransitos);
  }
  getFacturados(){
    this.loading      = true;
    this.newTransitos = [];
    this.conex.getDatos('/generales/transitosF').subscribe( (resp:any) => { this.facturados = resp['datos'];this.getNoFacturados();
  })
  }
 
  getNoFacturados(){
    this.conex.getDatos('/generales/transitosNF').subscribe( (resp:any) => { this.noFacturados = resp['datos']; this.loading = false; this.info()})
  }

 
  convertFile(event: any, autopista:string) {
    console.log('event', event)
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
            this.autopista    = 'Central Facturados';
            if (transitos1 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
            this.verificarRepetidos(transitos1, this.aplicaTarifa.ACFACTURADO);
            }
            break;

          case 'ACNOFACTURADO':  // Autopista central No facturados
            const transitos2 = this.formatos.ACNOFACTURADO(result.data, this.params.user.companyId);
            this.verificarRepetidosNF(transitos2, this.aplicaTarifa.ACNOFACTURADO);
            this.tipo         = 'No facturados'
            if (transitos2 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
            this.autopista    = 'Central No Facturados';
            }
            break;
        
          case 'CNORTEF':  // Costanera norte No facturados
            this.autopista    = 'Costanera Norte Facturados';
            const transitos3:any = this.formatos.CNORTEF(result.data, this.params.user.companyId);
            this.tipo = 'facturados'
            if (transitos3 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
              this.verificarRepetidos(transitos3, this.aplicaTarifa.CNORTEF);
            }
            break;
       
            case 'CNORTENF':  // Costanera norte No facturados
            this.autopista    = 'Costanera Norte No Facturados';
            const transitos4:any = this.formatos.CNORTENF(result.data, this.params.user.companyId);
            this.tipo = 'No facturados'
            if (transitos4 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
              this.verificarRepetidosNF(transitos4, this.aplicaTarifa.CNORTENF);
            }
            break;
        }
    }
});
}


verificarRepetidos(transitos:any, aplicaTarifa:boolean){
  for (let t of transitos){
    
    if (aplicaTarifa){
      t.aplicaTarifa = 1
    } else {
      t.aplicaTarifa = 0
    }

    const existe   = this.facturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);

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
  console.log('newtransitos', this.newTransitos);

}

verificarRepetidosNF(transitos:any, aplicaTarifa:boolean){
  
  for (let t of transitos){
    
    if (aplicaTarifa){
      t.aplicaTarifa = 1
    } else {
      t.aplicaTarifa = 0
    }
    const existe   = this.noFacturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);
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
  console.log('newtransitos', this.newTransitos);
}



aplicarTarifa(tipo:string){

  let aplica = 0;

  switch (tipo) {
    case 'ACFACTURADO':
      this.aplicaTarifa.ACFACTURADO = !this.aplicaTarifa.ACFACTURADO
      
      if (this.aplicaTarifa.ACFACTURADO){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
    case 'ACNOFACTURADO':
      this.aplicaTarifa.ACNOFACTURADO = !this.aplicaTarifa.ACNOFACTURADO
      if (this.aplicaTarifa.ACNOFACTURADO){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
    case 'CNORTEF':
      this.aplicaTarifa.CNORTEF = !this.aplicaTarifa.CNORTEF
      if (this.aplicaTarifa.CNORTEF){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
    case 'CNORTENF':
      this.aplicaTarifa.CNORTENF = !this.aplicaTarifa.CNORTENF
      if (this.aplicaTarifa.CNORTENF){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
  }

  if(tipo){
    console.log(this.aplicaTarifa, 'positivo')
  } else {
    console.log(this.aplicaTarifa, 'negativo')
  }
 
}
guardarLote(){
  this.loading = true;
  this.conex.guardarDato(`/post/loteTransitos/${this.tipo}`, this.newTransitos)
            .subscribe( (resp:any) => {
                console.log('guardé transitos', resp);
                this.loading = false;
                this.exito('Transitos guardados con exito')
                this.getFacturados();
      
              })
}



exito(texto:string){
  Swal.fire({
    icon: 'success',
    title: 'Excelente',
    text: texto,
  })
}


error(texto:string){
  Swal.fire({
    icon: 'warning',
    title: 'Epaa ojo',
    text: texto
  })
  this.newTransitos = [];
  this.loading2     = false;
}

}


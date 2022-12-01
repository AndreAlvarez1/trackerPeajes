import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { ParamsModel } from 'src/app/models/params.model';
import { ConectorService } from 'src/app/services/conector.service';
import { FormatosService } from 'src/app/services/formatos.service';
import * as XLSX from 'xlsx';

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
                            CNORTEF: true,
                            CNORTENF: true,
                            VSUR: true,
                            VSURNF: true,
                            VNORTE: true,
                            VNORTENF: true,
                            RMAIPO: true,
                            STGOLAMPA: true,
                            VORIENTE: true,
                            RPASS: false,
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
    this.conex.getDatos('/generales/transitosF')
              .subscribe( (resp:any) => {
                     this.facturados = resp['datos'];
                     this.getNoFacturados();
                     })
  }
 
  getNoFacturados(){
    this.conex.getDatos('/generales/transitosNF')
              .subscribe( (resp:any) => { 
                  this.noFacturados = resp['datos']; 
                  this.loading = false; 
                  this.info();
                })
  }

  addXlsx(event: any, autopista:string){
    this.newTransitos = [];

    console.log('event xlsx', event)
    const file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(file);     
    fileReader.onload = (e) => {    
        const arrayBuffer:any = fileReader.result;    
        var data = new Uint8Array(arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];    
        console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true})); 
        
        const arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     

        this.tojson2(arraylist, autopista);
      
    }    
  }

 
  convertFile(event: any, autopista:string) {
    this.newTransitos = [];

    console.log('event', event)
    this.loading2 = true;

    let file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      // console.log('aca', reader.result, autopista);
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
            this.verificarRepetidos(transitos1, this.aplicaTarifa.ACFACTURADO, 'ACFACTURADO');
            }
            break;

          case 'ACNOFACTURADO':  // Autopista central No facturados
            const transitos2 = this.formatos.ACNOFACTURADO(result.data, this.params.user.companyId);
            this.verificarRepetidosNF(transitos2, this.aplicaTarifa.ACNOFACTURADO, 'ACNOFACTURADO');
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
              this.verificarRepetidos(transitos3, this.aplicaTarifa.CNORTEF, 'CNORTEF');
            }
            break;
       
            case 'CNORTENF':  // Costanera norte No facturados
            this.autopista    = 'Costanera Norte No Facturados';
            const transitos4:any = this.formatos.CNORTENF(result.data, this.params.user.companyId);
            this.tipo = 'No facturados'
            if (transitos4 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
              this.verificarRepetidosNF(transitos4, this.aplicaTarifa.CNORTENF, 'CNORTENF');
            }
            break;
    
            case 'VSUR':  //Vespucio Sur facturados
            this.autopista    = 'Vespucio Sur Facturados';
            const transitos5:any = this.formatos.VSUR(result.data, this.params.user.companyId);
            this.tipo = 'facturados'
            if (transitos5 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
              this.verificarRepetidos(transitos5, this.aplicaTarifa.VSUR, 'VSUR');
            }
            break;
       
            case 'VSURNF':  // Vespucio Sur No facturados
            this.autopista    = 'Vespucio Sur No Facturados';
            const transitos6:any = this.formatos.VSURNF(result.data, this.params.user.companyId);
            this.tipo = 'No facturados'
            if (transitos6 == 'error'){
              this.error('No es el formato de excel que corresponde');
            } else {
              this.verificarRepetidosNF(transitos6, this.aplicaTarifa.VSURNF, 'VSURNF');
            }
            break;
            
      
            
  
  
        }
    }
});
}

tojson2(datos:any, autopista:string){
  switch(autopista){
    case 'VNORTE':  //Vespucio Norte facturados
      this.autopista    = 'Vespucio Norte Facturados';
      const transitos1:any = this.formatos.VNORTE(datos, this.params.user.companyId);
      this.tipo = 'facturados'
      if (transitos1 == 'error'){
        this.error('No es el formato de excel que corresponde');
      } else {
        this.verificarRepetidos(transitos1, this.aplicaTarifa.VNORTE, 'VNORTE');
      }
      break;
      
      case 'VNORTENF':  // Vespucio Norte No facturados
      this.autopista       = 'Vespucio Norte No Facturados';
      const transitos2:any = this.formatos.VNORTENF(datos, this.params.user.companyId);
      this.tipo = 'No facturados'
      if (transitos2 == 'error'){
        this.error('No es el formato de excel que corresponde');
      } else {
        this.verificarRepetidosNF(transitos2, this.aplicaTarifa.VNORTENF, 'VNORTENF');
      }
      break;
   

   
      case 'RMAIPO': 
        this.autopista       = 'Ruta Maipo';
        const transitos3:any = this.formatos.RMAIPO(datos, this.params.user.companyId);
        this.tipo = 'ambos'
        if (transitos3 == 'error'){
          this.error('No es el formato de excel que corresponde');
        } else {
          this.verificarRepetidosAmbos(transitos3, this.aplicaTarifa.RMAIPO);
        }
        break;

        case 'STGOLAMPA': 
        this.autopista    = 'Santiago Lampa Facturados';
        const transitos4:any = this.formatos.STGOLAMPA(datos, this.params.user.companyId);
        this.tipo = 'facturados'
        if (transitos4 == 'error'){
          this.error('No es el formato de excel que corresponde');
        } else {
          this.verificarRepetidos(transitos4, this.aplicaTarifa.STGOLAMPA, 'STGOLAMPA');
        }
        break;

        case 'VORIENTE':  // Vespucio No
        this.autopista       = 'Vespucio Norte No Facturados';
        const transitos5:any = this.formatos.VORIENTE(datos, this.params.user.companyId);
        this.tipo = 'ambos'
          if (transitos5 == 'error'){
            this.error('No es el formato de excel que corresponde');
          } else {
            this.verificarRepetidosAmbos(transitos5, this.aplicaTarifa.VORIENTE);
          }
        break;

        case 'RPASS':  // Ruta PAss
        this.autopista    = 'Ruta pass';
        const transitos6:any = this.formatos.RPASS(datos, this.params.user.companyId);
        this.tipo = 'ambos'
        if (transitos6 == 'error'){
          this.error('No es el formato de excel que corresponde');
        } else {
          this.verificarRepetidosAmbos(transitos6, this.aplicaTarifa.RPASS);
        }
        break;

 
    }
}


verificarRepetidos(transitos:any, aplicaTarifa:boolean, autopista:string){
  
  console.log('AUTOPISTA', autopista, transitos);

  for (let t of transitos){
    
    if (aplicaTarifa){
      t.aplicaTarifa = 1
    } else {
      t.aplicaTarifa = 0
    }

    if (autopista == 'CNORTEF' ){
      if (t.eje == 'NOR'){
        t.aplicaTarifa = 0;
      }
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

verificarRepetidosNF(transitos:any, aplicaTarifa:boolean, autopista:string){
  
  for (let t of transitos){
    
    if (aplicaTarifa){
      t.aplicaTarifa = 1
    } else {
      t.aplicaTarifa = 0
    }

    if (autopista == 'CNORTENF' ){
      if (t.eje == 'NOR'){
        t.aplicaTarifa = 0;
      }
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

verificarRepetidosAmbos(transitos:any, aplicaTarifa:boolean){
  for (let t of transitos){
    
    if (aplicaTarifa){
      t.aplicaTarifa = 1
    } else {
      t.aplicaTarifa = 0
    }

    if (t.estado == 'facturado'){
      const existe   = this.facturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);
      if (!existe){
       this.newTransitos.push(t);
      }
    }
   
    if (t.estado != 'facturado'){
      const existe   = this.noFacturados.find( tra => tra.patente == t.patente && tra.fecha == t.fecha && tra.hora == t.hora);
      if (!existe){
       this.newTransitos.push(t);
      }
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
      // this.aplicaTarifa.CNORTEF = !this.aplicaTarifa.CNORTEF
      // if (this.aplicaTarifa.CNORTEF){
      //   aplica = 1;
      // }

      // for (let t of this.newTransitos){
      //   t.aplicaTarifa = aplica;
      // }
      this.aplicaFijo('Costanera norte siempre aplica, excepto eje nor oriente');

      break;
    case 'CNORTENF':
      // this.aplicaTarifa.CNORTENF = !this.aplicaTarifa.CNORTENF
      // if (this.aplicaTarifa.CNORTENF){
      //   aplica = 1;
      // }

      // for (let t of this.newTransitos){
      //   t.aplicaTarifa = aplica;
      // }
      this.aplicaFijo('Costanera norte siempre aplica, excepto eje nor oriente');


      break;
    case 'VSUR':
      this.aplicaTarifa.VSUR = !this.aplicaTarifa.VSUR
      if (this.aplicaTarifa.VSUR){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
    case 'VSURNF':
      this.aplicaTarifa.VSURNF = !this.aplicaTarifa.VSURNF
      if (this.aplicaTarifa.VSURNF){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }
      break;
  
    case 'VNORTE':
      this.aplicaTarifa.VNORTE = !this.aplicaTarifa.VNORTE
      if (this.aplicaTarifa.VNORTE){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }

      break;
    case 'VNORTENF':
      this.aplicaTarifa.VNORTENF = !this.aplicaTarifa.VNORTENF
      if (this.aplicaTarifa.VNORTENF){
        aplica = 1;
      }

      for (let t of this.newTransitos){
        t.aplicaTarifa = aplica;
      }
      break;

    case 'RMAIPO':
      this.aplicaTarifa.RMAIPO = !this.aplicaTarifa.RMAIPO
      if (this.aplicaTarifa.RMAIPO){
        aplica = 1;
      }
    break
    case 'VORIENTE':
      this.aplicaTarifa.VORIENTE = !this.aplicaTarifa.VORIENTE
      if (this.aplicaTarifa.VORIENTE){
        aplica = 1;
      }
      break;

    case 'STGOLAMPA':
      this.aplicaTarifa.STGOLAMPA = !this.aplicaTarifa.STGOLAMPA
      if (this.aplicaTarifa.STGOLAMPA){
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

guardar(){
  if (this.tipo == 'ambos'){
    this.guadarDiferidos();
  } else {
    this.guardarLote();
  }
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

guadarDiferidos(){
 const newFacturados:any[]   = [];
 const newNoFacturados:any[] = [];
 
 for (let t of this.newTransitos){
  if (t.estado == 'facturado'){
    newFacturados.push(t);
  } else{
    newNoFacturados.push(t);
  }
 }

 if (newFacturados.length > 0){
  this.conex.guardarDato(`/post/loteTransitos/facturados`, newFacturados)
      .subscribe( (resp:any) => {
          console.log('guardé transitos', resp);
          if (newNoFacturados.length > 0){
            this.guadarLote2(newNoFacturados);
          } else {
            this.loading = false;
            this.exito('Transitos guardados con exito')
          }
        })
 } else {
   if (newNoFacturados.length > 0){
    this.guadarLote2(newNoFacturados);
   }
 }



 console.log('Facturados', newFacturados)
 console.log('No Facturados', newNoFacturados)
}

guadarLote2(transitos:any){
  this.conex.guardarDato(`/post/loteTransitos/noFacturados`, transitos)
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


error(texto:string){
  Swal.fire({
    icon: 'warning',
    title: 'Epaa ojo',
    text: texto
  })
  this.newTransitos = [];
  this.loading2     = false;
}

aplicaFijo(texto:string){
  Swal.fire({
    icon: 'warning',
    title: 'No se puede cambiar',
    text: texto
  })
  this.newTransitos = [];
  this.loading2     = false;
}

}


import { Injectable } from '@angular/core';
import { TransitoModel } from '../models/transito.model';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  constructor() { }

  ACFACTURADO(resultados:any, companyId:any){
    const transitos = [];
    let alertaInterurbano = false;;
    let i = 0;
  
    for (let dato of resultados){

      // Valido Formato
      if (i < 1) {
        // console.log('este', dato[3])
        if(dato[3]!='Patente'){
          return 'error';
        }

      }

      if (i > 0 && i < resultados.length - 1){
          let transito = new TransitoModel();
          transito.autopistaId   = 1
          transito.companyId     = companyId;
          transito.patente       = dato[3];
          transito.portico       = dato[4];
          transito.eje           = dato[5];
          transito.fecha         = dato[7];
          transito.hora          = dato[8];
          // transito.monto         = Number(dato[10].replace(/,/g, '.'));
          transito.monto         = Number(dato[10].replace('.', '').replace(/,/g, '.'));
          if (dato[9]== 'Tarifa Interurbana'){
            // console.log('ojo interurbana')
            alertaInterurbano = true;
          }
          transitos.push(transito);
        }
  
      i++;
    }
    if (alertaInterurbano){
      Swal.fire({
        icon: 'warning',
        title: 'Hay tarifa interurbanas',
        text: 'Fijate si marcaste la opción aplica tarifa',
      })
    }

    return transitos;
  }

  ACNOFACTURADO(resultados:any, companyId:any){
    console.log('ACA', resultados);
    const transitos       = [];
    let alertaInterurbano = false;;
    let i = 0;
  
    for (let dato of resultados){

      //Valido formato
      if (i < 1) {
        // console.log('este', dato[2])
        if(dato[2]!='PATENTE'){
          return 'error';
        }
      }

      if (i > 0 && i < resultados.length - 1){
          let transito = new TransitoModel();
          transito.autopistaId   = 1
          transito.companyId     = companyId;
          transito.patente       = dato[2];
          transito.portico       = dato[3];
          transito.eje           = dato[4];
          transito.fecha         = this.modificarFecha(dato[6]);
          transito.hora          = dato[7];
          // transito.monto         = Number(dato[10].replace(/,/g, '.'));
          transito.monto         = Number(dato[8].replace('.', '').replace(/,/g, '.'));
          if (dato[9]== 'Tarifa Interurbana'){
            // console.log('ojo interurbana')
            alertaInterurbano = true;
          }
          transitos.push(transito);
        }
  
      i++;
    }
    if (alertaInterurbano){
      Swal.fire({
        icon: 'warning',
        title: 'Hay tarifa interurbanas',
        text: 'Fijate si marcaste la opción aplica tarifa',
      })
    }
    return transitos;
  }

  CNORTEF(resultados:any, companyId:any){
    const transitos:any[] = [];

    let i = 0;
  
    for (let dato of resultados){

       //Valido formato
      if (i < 1) {
        if(dato[0]!='FechaHora'){
          return 'error';
        }
      }

      if (i > 0 && i < resultados.length - 1){
          let transito = new TransitoModel();
          transito.autopistaId   = 2
          transito.companyId     = companyId;
          transito.patente       = dato[2];
          transito.portico       = dato[1];
          transito.eje           = dato[8];
          transito.fecha         = this.modificarFecha3(dato[0]);
          transito.hora          = dato[0].slice(11,16);
          transito.monto         = Number(dato[6].replace(/,/g, '.'));
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }

  CNORTENF(resultados:any, companyId:any){
    const transitos:any[] = [];

    let i = 0;
  
    for (let dato of resultados){
       //Valido formato
      if (i < 1) {
        if(dato[0]!='NumeroRegistro'){
          return 'error';
        }
      }

      if (i > 0 && i < resultados.length - 1 && dato != ''){
          let transito = new TransitoModel();
          transito.autopistaId   = 2
          transito.companyId     = companyId;
          transito.patente       = dato[5];
          transito.portico       = dato[6];
          transito.eje           = dato[11];
          transito.fecha         = this.modificarFecha3(dato[3]);
          transito.hora          = dato[4];
          transito.monto         = Number(dato[10])
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }
  VSUR(resultados:any, companyId:any){

    console.log('resultados', resultados);

    const transitos:any[] = [];

    let i = 0;
  
    for (let dato of resultados){

       //Valido formato
      if (i < 1) {
        if(dato[0]!='FechaHora'){
          return 'error';
        }
      }

      if (i > 0 && i < resultados.length - 1){
          let transito = new TransitoModel();
          transito.autopistaId   = 2
          transito.companyId     = companyId;
          transito.patente       = dato[2];
          transito.portico       = dato[1];
          transito.eje           = dato[8];
          transito.fecha         = this.modificarFecha3(dato[0]);
          transito.hora          = dato[0].slice(11,16);
          transito.monto         = Number(dato[6].replace(/,/g, '.'));
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }

  VSURNF(resultados:any, companyId:any){
    const transitos:any[] = [];

    let i = 0;
  
    for (let dato of resultados){
       //Valido formato
      if (i < 1) {
        if(dato[0]!='NumeroRegistro'){
          return 'error';
        }
      }

      if (i > 0 && i < resultados.length - 1 && dato != ''){
          let transito = new TransitoModel();
          transito.autopistaId   = 2
          transito.companyId     = companyId;
          transito.patente       = dato[5];
          transito.portico       = dato[6];
          transito.eje           = dato[11];
          transito.fecha         = this.modificarFecha3(dato[3]);
          transito.hora          = dato[4];
          transito.monto         = Number(dato[10])
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }

  // PENDIENTE UN EXCEL FACTURADOS
  VNORTE(resultados:any, companyId:any){

    console.log('resultados', resultados);

    const transitos:any[] = [];
  
    for (let dato of resultados){
       //Valido formato
          let transito = new TransitoModel();
          transito.autopistaId   = 5
          transito.companyId     = companyId;
          transito.patente       = dato[2];
          transito.portico       = dato[1];
          transito.eje           = dato[8];
          transito.fecha         = this.modificarFecha3(dato[0]);
          transito.hora          = dato[0].slice(11,16);
          transito.monto         = Number(dato[6].replace(/,/g, '.'));
          transitos.push(transito);
        }
    return transitos;
  }


  VNORTENF(resultados:any, companyId:any){
    const transitos:any[] = [];

    console.log('recibo', resultados);
    let i = 0;
  

      for (let dato of resultados){
          let transito = new TransitoModel();
          transito.autopistaId   = 5
          transito.companyId     = companyId;
          transito.patente       = dato.Patente;
          transito.portico       = dato.Portico;
          transito.eje           = dato.Sentido;
          transito.fecha         = this.modificarFecha3(dato.Fecha);
          transito.hora          = dato.Hora;
          transito.monto         = Number(dato.Valor)
          transitos.push(transito);
        }

  
    return transitos;


  }


  RMAIPO(resultados:any, companyId:any){
    console.log('RMAIPO', resultados);
    const transitos:any[] = [];

    let i = 0;
  
    for (let dato of resultados){
       //Valido formato
      if (i < 1) {
        if(dato.CategoriaDescripcion == undefined){
          return 'error';
        }
      }

          let transito = new TransitoModel();
          transito.autopistaId   = 4
          transito.companyId     = companyId;
          transito.patente       = dato.Patente;
          transito.portico       = dato.Plaza;
          transito.eje           = dato.PuntoCobro;
          transito.fecha         = this.modificarFecha3(dato.FechaHora);
          transito.hora          = this.modificarHora(dato.FechaHora);
          transito.monto         = Number(dato.Monto)
          transito.estado        = 'facturado';
          if (dato.Facturado == 'False'){
              transito.estado     = 'noFacturado';
            }
          transitos.push(transito);
        
      i++;
    }
    return transitos;
  }

//   CategoriaDescripcion: "2"
// ContractSerialNumber: "1749565542"
// Facturado: "False"
// FechaHora: "18-07-2022 19:36:43"
// Monto: "2900"
// NumeroComprobanteFiscal: ""
// Observacion: "Transito Facturable"
// Patente: "KXSZ11"
// PatenteCategoria: "2"
// Plaza: "Nva. Angostura Free Flow"
// PuntoCobro: "RDM-ANG PP1SN"
// Sentido: "Sur - Norte"
// TipoComprobanteFiscal: ""
// TipoHorario: "Normal"
// TipoTarifa: ""
// TipoVehiculo: "AUTOS Y CAMIONETAS"
// Via: "0"


  STGOLAMPA(resultados:any, companyId:any){

    console.log('resultados', resultados);

    const transitos:any[] = [];
    
    let encabezado = true;
    let i = 0;
  
    
    for (let dato of resultados){

      // VALIDAR FORMATO
        if (i < 1){
          if (dato.__EMPTY_3 != 'Nombre/Razón Social'){
            return 'error';
          }
        }

        if (dato.__EMPTY_2 == undefined || dato.__EMPTY_2 == 'Patente'  ){
          // console.log('No se usa');
        } else {
          if (dato.__EMPTY_4 == undefined){
            // console.log('ES RESUMEN DE PAGO!', dato);
          } else {
            let transito = new TransitoModel();
            transito.autopistaId   = 6
            transito.companyId     = companyId;
            transito.patente       = dato.__EMPTY_2;
            transito.portico       = dato.__EMPTY_7;
            transito.eje           = '';
            transito.fecha         = this.modificarFecha3(dato.__EMPTY_4);
            transito.hora          = dato.__EMPTY_6;
            transito.monto         = Number(dato.__EMPTY_18);
            transitos.push(transito);          
        }

        }   
        i++;
    }
    return transitos;
  }



getFirstDayOfMonth(year:any, month:any) {
  return new Date(year, month, 1);
}

firstDayMonth(){
  const date = new Date();
  const firstDayCurrentMonth = this.getFirstDayOfMonth(
    date.getFullYear(),
    date.getMonth(),
  );

  console.log(firstDayCurrentMonth); // 👉️ Sat Oct 01 2022

}



  modificarFecha(fecha:any) { 
    const dia = fecha.slice(0,2);
    const mes = fecha.slice(3,5);
    const ano = fecha.slice(6,10);
    let fechaModif = '';
    fechaModif = ano + '-' + mes + '-' + dia;
    return fechaModif;
  }
  
  modificarFecha2(fecha:any) { 
    // console.log('fecha', fecha);
    const ano = fecha.slice(0,4);
    const mes = fecha.slice(5,7);
    const dia = fecha.slice(8,10);

    let fechaModif = '';
    fechaModif = ano + '-' + mes + '-' + dia;
    return fechaModif;
  }

  modificarFecha3(fecha:any) { 
    const dia = fecha.slice(0,2);
    const mes = fecha.slice(3,5);
    const ano = fecha.slice(6,10);

    // console.log('fecha', fecha);
    // console.log('dia', dia);
    // console.log('mes', mes);
    // console.log('ano', ano);

    const fechaModif = ano + '-' + mes + '-' + dia;
    return fechaModif;
  }

  modificarHora(fecha:string){
    let hora = fecha.slice(11,20);
    if(hora[1] == ':'){
      console.log('esteeeeeee', hora);
      hora = '0' + hora;
      console.log('ahoraaaa', hora);
    }
    return hora;
  }





}

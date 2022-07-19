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
        console.log('este', dato[3])
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
            console.log('ojo interurbana')
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
        console.log('este', dato[2])
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
            console.log('ojo interurbana')
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
    console.log('fecha', fecha);
    const dia = fecha.slice(0,2);
    const mes = fecha.slice(3,5);
    const ano = fecha.slice(6,10);

    console.log('dia', dia);
    console.log('mes', mes);
    console.log('ano', ano);
   let fechaModif = '';

      fechaModif = ano + '-' + mes + '-' + dia;

    console.log('fecha Modif', fechaModif);
    return fechaModif;
  }
  
  modificarFecha2(fecha:any) { 
    console.log('fecha', fecha);
    const ano = fecha.slice(0,4);
    const mes = fecha.slice(5,7);
    const dia = fecha.slice(8,10);

   let fechaModif = '';

      fechaModif = ano + '-' + mes + '-' + dia;

    console.log('fecha Modif', fechaModif);
    return fechaModif;
  }

  modificarFecha3(fecha:any) { 
    const dia = fecha.slice(0,2);
    const mes = fecha.slice(3,5);
    const ano = fecha.slice(6,10);

    console.log('fecha', fecha);
    console.log('dia', dia);
    console.log('mes', mes);
    console.log('ano', ano);

    const fechaModif = ano + '-' + mes + '-' + dia;
    return fechaModif;
  }





}

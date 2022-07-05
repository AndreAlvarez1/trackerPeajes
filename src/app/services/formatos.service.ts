import { Injectable } from '@angular/core';
import { TransitoModel } from '../models/transito.model';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  constructor() { }

  ACFACTURADO(resultados:any, companyId:any){
    const transitos = [];

    let i = 0;
  
    for (let dato of resultados){
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
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }

  ACNOFACTURADO(resultados:any, companyId:any){
    console.log('ACA', resultados);
    const transitos = [];

    let i = 0;
  
    for (let dato of resultados){
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

}

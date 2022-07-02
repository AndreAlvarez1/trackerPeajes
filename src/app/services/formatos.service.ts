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
          transito.monto         = Number(dato[10].replace(/,/g, '.'));
          transitos.push(transito);
        }
  
      i++;
    }
    return transitos;
  }

}

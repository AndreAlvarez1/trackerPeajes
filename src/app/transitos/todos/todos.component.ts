import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  loading               = false;
  loading2              = false;
  searchString          = '';

  autopista: any;
  autopistas: any[]     = [{id:0,nombre:'Todas', selected:true}];
  transitosAll: any[]   = [];
  transitos: any[]      = [];
  date = new Date();
  firstDay            = new Date(this.date.getFullYear(), this.date.getMonth(), 1).toISOString();
  lastDay             = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).toISOString();

// ========================================== //
// ========================================== //
// ========================================== //
// Como solo era para la autopista de Lampa   //
// no estoy revisando si hay duplicados entre //
// facturados y no facturados                 //
// ========================================== //
// ========================================== //
// ========================================== //

  constructor(private conex: ConectorService,
              private formato: FormatosService,
              public excelService: ExcelService) { }

  ngOnInit(): void {
    this.firstDay = this.formato.modificarFecha2(this.firstDay);
    this.lastDay  = this.formato.modificarFecha2(this.lastDay);
    console.log('first', this.firstDay)
    console.log('last', this.lastDay);
    this.getAutopistas();
  }

  getAutopistas(){
    this.loading  = true;
    this.conex.getDatos('/generales/autopista')
          .subscribe( (resp:any)=> {
            console.log('autopistas', resp)
            for (let a of resp['datos']){
              a.selected = false;
              if (a.id == 6){
                a.selected = true;
              }
              this.autopistas.push(a);
            }
            console.log('autopista', this.autopistas, '0', this.autopistas[0]);
            this.autopistas[0].selected = false;

            this.loading = false;
            this.getFacturados();
          })
  }



  filtrarFecha(f:NgForm) {
    this.loading2 = true;
    // Defino los locales que queremos para desplegar los informes
    this.transitosAll = [];

    console.log("filtrar", f.value);

    const fechaIni = f.value["fechaIni"]
    const fechaFin = f.value["fechaFin"]
    this.getFacturados();


    }

    getFacturados(){
      this.transitosAll = [];
      this.transitos    = [];
      this.conex.getDatos(`/transitos/transitosF/${this.firstDay}/${this.lastDay}`)
          .subscribe( (resp:any) => { 
            for (let t of resp['datos']){
              const existe = this.autopistas.find( aut => aut.id == t.autopistaId);
              t.autopista = existe.nombre;
              t.facturado = true;
              this.transitosAll.push(t);
            }

            this.getNoFacturados();
      
            console.log('transitos All', this.transitosAll);
          })
    }

    getNoFacturados(){
      this.conex.getDatos(`/transitos/transitosNF/${this.firstDay}/${this.lastDay}`)
          .subscribe( (resp:any) => { 
            for (let t of resp['datos']){
              const existe = this.autopistas.find( aut => aut.id == t.autopistaId);
              t.autopista = existe.nombre;
              t.facturado = false;
              this.transitosAll.push(t);
            }

            console.log('transitos All', this.transitosAll);

            this.filtrarLampa();
          })
    }







  selectAutopista(a:any){
    this.loading2 = true;

    console.log('a',a)

    if (a.id == 0){
      let seleccion = true;
      if (a.selected){
          seleccion = false;
      }
      for ( let auto of this.autopistas){
          auto.selected = seleccion;
      }
    } else{
      a.selected = !a.selected;
      this.autopistas[0].selected = false;
    }

    //para que se marque o desmarque solo el "todas"
    this.autopistas[0].selected = true;
    for (let a of this.autopistas){
      if (a.selected == false){
        this.autopistas[0].selected = false;
      }
    }

    if (this.autopistas[0].selected){
      this.transitos = this.transitosAll;
    } else {
      this.transitos = [];
      for (let t of this.transitosAll){
        for (let a of this.autopistas){
          if (t.autopistaId === a.id && a.selected){
            this.transitos.push(t);
          }
        }
      }
    }

    this.loading2 = false;
  }


filtrarLampa(){
  this.transitos = this.transitosAll.filter( tra => tra.autopistaId == 6);
  this.loading2 = false;
}

  selectTransito(c:any){
    console.log('transito', c)
  }

  exportAsXLSX(datos:any, titulo:string): void {    
    const exportar = [];

    for (let d of datos){
        let isFacturado = 'Facturado';
        if (!d.facturado){
          isFacturado = 'No facturado';
        }
        const newRegistro = {
                                patente: d.patente,
                                portico: d.portico,
                                eje: d.eje,
                                fecha: d.fecha,
                                hora: d.hora,
                                autopista: d.autopista,
                                monto: d.monto,
                                facturado: isFacturado
                            }
        exportar.push(newRegistro);
    }
    const nombreArchivo = titulo;
    this.excelService.exportAsExcelFile(exportar, nombreArchivo);
}



}

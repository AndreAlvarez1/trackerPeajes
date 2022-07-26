import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormatosService } from 'src/app/services/formatos.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  loading               = false;
  loading2              = false;
  searchString          = '';
  patente               = '';

  autopistas: any[]     = [];
  transitosAll: any[]   = [];
  transitos: any[]      = [];

  date = new Date();
  firstDay            = new Date(this.date.getFullYear(), this.date.getMonth(), 1).toISOString();
  lastDay             = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).toISOString();

  total               = 0;

  constructor(private conex:ConectorService,
              private formato: FormatosService,
              private excelService: ExcelService) { }

  ngOnInit(): void {
    this.firstDay = this.formato.modificarFecha2(this.firstDay);
    this.lastDay  = this.formato.modificarFecha2(this.lastDay);
    this.getAutopistas();
  }


  getAutopistas(){
    this.loading  = true;
    this.conex.getDatos('/generales/autopista')
          .subscribe( (resp:any)=> {
            this.autopistas = resp['datos'];
            console.log('autopista', this.autopistas);
            this.loading = false;
          })
  }

  filtrarFecha(f:NgForm) {
    if(this.patente.length < 6){
      this.error('Agrega una patente válida por favor');
      return;
    }

    this.loading2 = true;
    console.log("filtrar", f.value);
    this.getTransitosFacturados();
  }


  getTransitosFacturados(){
    this.transitosAll = [];
    this.transitos    = [];

    this.conex.getDatos(`/transitosXpatente/transitosF/${this.firstDay}/${this.lastDay}/${this.patente}`)
        .subscribe( (resp:any) => { 
          console.log('facturas', resp['datos'])

          for (let f of resp['datos']){
            f.facturado = true;
            this.transitosAll.push(f) 
          }
          this.getTransitosNoFacturados();
        })
  }

  getTransitosNoFacturados(){

    this.conex.getDatos(`/transitosXpatente/transitosNF/${this.firstDay}/${this.lastDay}/${this.patente}`)
        .subscribe( (resp:any) => { 
        
          console.log('no facturas', resp['datos'])
          for (let nf of resp['datos']){
            const existe = this.transitosAll.find( tra => tra.fecha == nf.fecha && tra.hora == nf.hora);
            if (!existe){
              console.log('no está repetido', nf);
              nf.facturado = false;
              this.transitosAll.push(nf) 
            } else {
              console.log('repetido', existe);
            }

          }

          this.calcularTarifas();
        })
  }


  calcularTarifas(){
    console.log('transitos All', this.transitosAll);

    this.transitos    = [];
    this.total        = 0;
    
    console.log('autopistas', this.autopistas);

    for (let t of this.transitosAll){
      const existe = this.autopistas.find( aut => aut.id == t.autopistaId);
      t.autopista = existe.nombre;
      if (t.aplicaTarifa > 0){
        t.tarifaAplicada = t.monto * existe.tarifa;
      } else {
        t.tarifaAplicada = t.monto;
      }

      this.total += t.tarifaAplicada;
      this.transitos.push(t);
    }

    console.log('transitos', this.transitos);
    this.loading2 = false;

  }


  exportAsXLSX(dato:any, titulo:string): void {
    const nombreArchivo = titulo + this.patente;
    this.excelService.exportAsExcelFile(dato, nombreArchivo);
}


verTransito(t:any){
  console.log('transito', t);
}

error(texto:string){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: texto,
  })
}

}

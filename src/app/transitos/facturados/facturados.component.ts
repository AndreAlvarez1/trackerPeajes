import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-facturados',
  templateUrl: './facturados.component.html',
  styleUrls: ['./facturados.component.css']
})
export class FacturadosComponent implements OnInit {

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

  constructor(private conex: ConectorService,
              private formato: FormatosService) { }

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
            for (let a of resp['datos']){
              a.selected = true;
              this.autopistas.push(a);
            }
            console.log('autopista', this.autopistas);
            this.loading = false;
            this.getTransitos();
          })
  }



  filtrarFecha(f:NgForm) {
    this.loading2 = true;
    // Defino los locales que queremos para desplegar los informes
    this.transitosAll = [];

    console.log("filtrar", f.value);

    const fechaIni = f.value["fechaIni"]
    const fechaFin = f.value["fechaFin"]
    this.getTransitos();


    }


  getTransitos(){
    this.transitosAll = [];
    this.transitos    = [];
    this.conex.getDatos(`/transitos/transitosF/${this.firstDay}/${this.lastDay}`)
        .subscribe( (resp:any) => { 
          for (let t of resp['datos']){
            const existe = this.autopistas.find( aut => aut.id == t.autopistaId);
            t.autopista = existe.nombre;
            this.transitosAll.push(t);
          }
          this.transitos    = this.transitosAll;
          this.loading2     = false;
          console.log('transitos All', this.transitosAll);
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
    for (let a of this.autopistas){
      this.autopistas[0].selected = true;
      if (a.selected == false){
        this.autopistas[0].selected = false;
      }
    }

    if (this.autopistas[0].selected){
      this.transitos = this.transitosAll;
    } else {
      this.transitos = [];
      for (let t of this.transitosAll){
        const existe = this.autopistas.find( a => a.id == t.autopistaId);
        if (existe.selected){
          this.transitos.push(t);
        }
      }
    }

    this.loading2 = false;
  }

  selectTransito(c:any){
    console.log('transito', c)
  }



}

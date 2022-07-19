import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';

@Component({
  selector: 'app-limpiar-bd',
  templateUrl: './limpiar-bd.component.html',
  styleUrls: ['./limpiar-bd.component.css']
})
export class LimpiarBdComponent implements OnInit {

  loading   = false;
  repetidos  = [];
  noFacturas = [];
  constructor(private conex: ConectorService) { }

  ngOnInit(): void {
    this.getCoincidencias();
  }

  getCoincidencias(){
    this.loading = true;
    this.conex.getDatos('/coincidencias')
              .subscribe( (resp:any) => { 
                console.log('resp coincidencias', resp['datos']);
                this.loading = false;
              })
  }

}

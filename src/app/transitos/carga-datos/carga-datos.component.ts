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

  constructor(private papa: Papa,
              private conex: ConectorService,
              private formatos: FormatosService) { 
      this.params = JSON.parse(localStorage.getItem('paramsTracker') || '');
  }

  ngOnInit(): void {
  }


  onFileChange(event:any){
    this.loading2        = true;
    this.newTransitos    = [];

    console.log('evento', event)
    console.log('files', event.target.files[0])
    const fileToLoad = event.target.files[0];
    const fileReader = new FileReader();
      
     fileReader.onload = fileLoadedEvent => {
        if (fileLoadedEvent.target){
          const textFromFileLoaded:any = fileLoadedEvent.target.result;
          let datos = JSON.parse(textFromFileLoaded);
          console.log('dentro', datos);
        } else {
          console.log('vacio');
        }

        // this.reemplazarData(datos);
      };
      
      fileReader.readAsText(fileToLoad, "UTF-8");
  
  }
  

  convertFile(event: any, autopista:string) {
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
          case 'ACFACTURADO':
            this.newTransitos = this.formatos.ACFACTURADO(result.data, this.params.user.companyId);
            this.tipo         = 'facturados'
            this.autopista    = 'Autopista Central Facturados';
            this.loading2     = false;
            break;
        }
    }
});
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



exito(texto:string){
  Swal.fire({
    icon: 'success',
    title: 'Excelente',
    text: texto,
  })
}


}


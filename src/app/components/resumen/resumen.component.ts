import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormatosService } from 'src/app/services/formatos.service';
import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
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
  resumen: any[]      = [];

  date = new Date();
  firstDay            = new Date(this.date.getFullYear(), this.date.getMonth(), 1).toISOString();
  lastDay             = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).toISOString();

  total               = 0;

  clientName: string = '';
  contract: string   = '';
  horaInicio: string = '';
  horaFin: string = "";





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

    console.log('horainicio', this.horaInicio);
    console.log('horaFin', this.horaFin);


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
              // console.log('no está repetido', nf);
              nf.facturado = false;
              this.transitosAll.push(nf) 
            } else {
              // console.log('repetido', existe);
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

      const dentroDeRango = this.validarRangoHora(t);
      if ( !dentroDeRango){
        console.log('me salto este');
        continue;
      }


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



     this.resumen = this.calcResumen(this.transitos);
    console.log('resumen', this.resumen);


    this.loading2 = false;

  }



  validarRangoHora(t:any){

    if (t.fecha == this.firstDay){
      console.log('fecha inicial', t);
      if (t.hora < this.horaInicio){
        console.log('es previo a la hora')
        return false
      }
    }
   
    if (t.fecha == this.lastDay){
      console.log('fecha final', t);
      if (t.hora > this.horaFin){
        console.log('es posterior a la hora de entrega')
        return false
      }
    }

    return true;
  }


  exportAsXLSX(datos:any, titulo:string): void {    
    const exportar = [];

    for (let d of datos){
        const newRegistro = {
                                patente: d.patente,
                                portico: d.portico,
                                eje: d.eje,
                                fecha: d.fecha,
                                hora: d.hora,
                                autopista: d.autopista,
                                tarifa: d.tarifaAplicada
                            }
        exportar.push(newRegistro);
    }
    const nombreArchivo = titulo + this.patente;
    this.excelService.exportAsExcelFile(exportar, nombreArchivo);
}


verTransito(t:any){
  console.log('transito', t);
}


// PSYT19


async preguntarDatosCliente() {
  const { value } = await Swal.fire({
    title: 'Datos del Cliente',
    html: `
      <div style="text-align:left;">
        <label for="nombreCliente"><strong>Nombre Cliente</strong></label>
        <input id="nombreCliente" class="swal2-input" placeholder="Ingrese el nombre">

        <label for="numeroContrato"><strong>Contrato</strong></label>
        <input id="numeroContrato" class="swal2-input" placeholder="Ingrese el número de contrato">
      </div>
    `,
    focusConfirm: false,
    confirmButtonText: 'Guardar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = (document.getElementById('nombreCliente') as HTMLInputElement).value.trim();
      const contrato = (document.getElementById('numeroContrato') as HTMLInputElement).value.trim();

      if (!nombre ) {
        Swal.showValidationMessage('Debe ingresar por lo menos el nombre');
        return;
      }

      return { nombre, contrato };
    }
  });

  if (value) {
    this.clientName = value.nombre;
    this.contract = value.contrato;
    console.log('Cliente:', this.clientName, 'Contrato:', this.contract);
    this.exportPdf();
  }
}



exportPdfBorrar(){
  console.log('odf')

   const detalle:any[] = [];
   const resumen = this.calcResumen(this.transitos);

    for (let d of this.transitos){
        const newRegistro = {
                                patente: d.patente,
                                portico: d.portico,
                                eje: d.eje,
                                fecha: d.fecha,
                                hora: d.hora,
                                autopista: d.autopista,
                                tarifa: d.tarifaAplicada,
                                autopistaId: d.autopistaId
                            }

        detalle.push(newRegistro);

        


    }


    



    console.log('first', this.firstDay);
    console.log('last', this.lastDay);
    console.log('client', this.clientName);
    console.log('contract', this.contract);
    console.log('patente', this.patente);
    console.log('resumen', resumen)
    console.log('detalle', detalle);


}

error(texto:string){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: texto,
  })
}



calcResumen(data:any){

   const resumen:any[] = [];

        for (let d of data){
            const newRegistro = {
                                    patente: d.patente,
                                    portico: d.portico,
                                    eje: d.eje,
                                    fecha: d.fecha,
                                    hora: d.hora,
                                    autopista: d.autopista,
                                    tarifa: d.tarifaAplicada,
                                    autopistaId: d.autopistaId
                                }

            const existe = resumen.find( r => r.autopistaId == newRegistro.autopistaId);
            if (existe){
              existe.total += newRegistro.tarifa;
            } else {
              const newObj = {
                autopista: newRegistro.autopista,
                total: newRegistro.tarifa,
                autopistaId: newRegistro.autopistaId
              }
              resumen.push(newObj);
            }

            
          }
      return resumen
    }


    // EXPORTAR PDF


      // ===== Helper: cargar logo (assets/images/logo.png) como base64 =====
  private async loadImageAsBase64(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

 // ===== Helper: formato moneda CLP =====
  private fmtCLP(n: number) {
    // Redondeado a entero, sin decimales
    const red = Math.round(n);
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(red);
  }


  private fmtDMY(iso: string, withYear = true) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return withYear ? `${d}-${m}-${y}` : `${d}-${m}`;
}





  // ===== Exportar PDF =====
  async exportPdf() {

   const detalle:any[] = [];
   const resumen       = this.calcResumen(this.transitos);

    for (let d of this.transitos){
        const newRegistro = {
                                patente: d.patente,
                                portico: d.portico,
                                eje: d.eje,
                                fecha: d.fecha,
                                hora: d.hora,
                                autopista: d.autopista,
                                tarifa: d.tarifaAplicada,
                                autopistaId: d.autopistaId
                            }

      detalle.push(newRegistro);

      }                       

      console.log('detalle', detalle);

   // ==== helpers locales (auto-contenidos) ====
  const loadImageAsBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fmtCLP = (n: number) => {
    const red = Math.round(n ?? 0);
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(red);
  };

  const fmtDMY = (iso: string, withYear = true) => {
    if (!iso) return '-';
    const [y, m, d] = iso.split('-');
    return withYear ? `${d}-${m}-${y}` : `${d}-${m}`;
  };

  // ==== carga logo (ajusta ruta/extension si cambia) ====
  let logoBase64 = '';
  try {
    logoBase64 = await loadImageAsBase64('assets/images/logoBoet.png');
  } catch { /* si falla, continuamos sin logo */ }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let cursorY = margin;

  // ---------- ENCABEZADO ----------
  // Logo arriba izquierda
  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', margin, cursorY, 120, 40); } catch {}
  }

  // Título y contrato arriba derecha
  const rightX = pageW - margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const title = 'Detalle consumo TAG y peajes';
  doc.text(title, rightX, cursorY + 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  const contractLine = `Contrato Nº ${this.contract || '-'}`;
  doc.text(contractLine, rightX, cursorY + 32, { align: 'right' });

  cursorY += 60;

  // Línea divisoria
  doc.setDrawColor(200);
  doc.line(margin, cursorY, pageW - margin, cursorY);
  cursorY += 20;

  // ---------- TABLA INFO CLIENTE (ancho 100%) ----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Detalle cliente', margin, cursorY);
  cursorY += 10;

  autoTable(doc, {
    startY: cursorY + 5,
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,
    body: [
      ['Nombre Arrendatario', this.clientName || '-'],
      ['Patente', this.patente || '-'],
      ['Período', `${fmtDMY(this.firstDay)} | ${this.horaInicio} al ${fmtDMY(this.lastDay)} | ${this.horaFin}`],
      ['Total',  `${    fmtCLP(this.total)}` ]

    ],
    styles: { fontSize: 10, overflow: 'linebreak' },
    headStyles: { fillColor: [240, 240, 240], textColor: 20 },
    columnStyles: {
      0: { cellWidth: 180, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 20;

  // ---------- TOTALES POR VÍA (ancho 100%) ----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Totales por vía', margin, cursorY);
  cursorY += 10;

  const cuerpoResumen: RowInput[] = (resumen || []).map((r: any) => ([
    r.autopista,
    fmtCLP(r.total)
  ]));

  autoTable(doc, {
    startY: cursorY + 5,
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,
    head: [['Autopista', 'Total']],
    body: cuerpoResumen,
    styles: { fontSize: 10, overflow: 'linebreak' },
    headStyles: { fillColor: [240, 240, 240], textColor: 20 },
    columnStyles: {
      0: { cellWidth: 260 },
      1: { cellWidth: 120, halign: 'right' }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 20;

  // ---------- DETALLE PASES (letra más chica, ancho 100%) ----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Detalle pases', margin, cursorY);
  cursorY += 10;

  const cuerpoDetalle: RowInput[] = (detalle || []).map((d: any) => ([
    fmtDMY(d.fecha),                  // Fecha DD-MM-YYYY
    d.hora || '',
    d.patente || '',
    d.autopista || '',
    d.portico || '',
    d.eje || '',
    fmtCLP(d.tarifa)                  // Tarifa visible y formateada
  ]));

  autoTable(doc, {
    startY: cursorY + 5,
    margin: { left: margin, right: margin },                // respeta margen derecho
    tableWidth: pageW - margin * 2,
    head: [['Fecha', 'Hora', 'Patente', 'Autopista', 'Pórtico', 'Eje', 'Tarifa']],
    body: cuerpoDetalle,
    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' }, // más chico
    headStyles: { fillColor: [240, 240, 240], textColor: 20 },
    columnStyles: {
      0: { cellWidth: 60 },               // Fecha
      1: { cellWidth: 40 },               // Hora
      2: { cellWidth: 60 },               // Patente
      3: { cellWidth: 80 },               // Autopista
      4: { cellWidth: 130 },              // Pórtico
      5: { cellWidth: 100 },              // Eje
      6: { cellWidth: 45, halign: 'right' } // Tarifa
    },
    didDrawPage: () => {
      // Footer con número de página
      const str = `Página ${doc.getNumberOfPages()}`;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(str, pageW - margin, pageH - 10, { align: 'right' });
    }
  });

  // ---------- Guardar ----------
  const nombreArchivo = `Detalle_TAG_${this.patente || 'sin_patente'}_${this.firstDay || ''}_${this.lastDay || ''}.pdf`;
  doc.save(nombreArchivo);
  }


}//FINAL
// PSYT19

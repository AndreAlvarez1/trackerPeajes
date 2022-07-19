export class TransitoModel {
    id: number;
    companyId: number;
    patente: string;
    autopistaId:number;
    portico:string;
    eje:string;	
    fecha:string;
    hora: string;
    monto: number;	
    created_at: string;
    updated_at: string;	
    status: number;
    estado: string;
    aplicaTarifa: number;


constructor() {
    this.id           = 0;
    this.companyId    = 0;
    this.patente      = '';
    this.autopistaId  = 0;
    this.portico      = '';
    this.eje          = '';	
    this.fecha        = '';
    this.hora         = '';
    this.monto        = 0;
    this.created_at   = '';
    this.updated_at   = '';	
    this.status       = 1;
    this.estado       = '';
    this.aplicaTarifa = 1;
}

}



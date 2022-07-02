export class UserModel {
    id: number;
    companyId: number;
    name: string;
    lastname: string;
    email: string;
    cel: string;
    password: string;
    type: number;
    empresa_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    recordar: boolean;


constructor() {
    this.id          = 0;
    this.companyId   = 0;
    this.name        = '';
    this.lastname    = '';
    this.email       = '';
    this.cel         = '';
    this.password    = '';
    this.type        = 0;
    this.empresa_id  = 0;;
    this.status      = 0;
    this.created_at  = '';
    this.updated_at  = '';
    this.recordar    = true;
}

}


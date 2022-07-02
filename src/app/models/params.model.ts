export class ParamsModel {
    user : {
            id:number;
            name: string;
            lastname: string;
            type: number;
            email: string;
            companyId: number;
            recordar: boolean
        }
    
constructor() {
    this.user = {
                id:0,
                name: '',
                lastname: '',
                type: 0,
                email: '',
                companyId: 0,
                recordar: true
            }
}

}
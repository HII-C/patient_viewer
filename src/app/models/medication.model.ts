export class Medication {
    name: string;
    startDate: Date;
    endDate: Date;
    dosageAmt: number;
    constructor(name: string, startDate: Date, endDate: Date, dosageAmt: number) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dosageAmt = dosageAmt;
    }
    
}

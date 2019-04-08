// Not a model from the FHIR standard
export class Medication {
    name: string;
    dosageUnits: string;

    periods: {
        start: Date;
        end: Date;
        dosage: number;
    }[];
    
    constructor(name: string, dosageUnits: string) {
        this.periods = [];
        this.name = name;
        this.dosageUnits = dosageUnits;
    }
}
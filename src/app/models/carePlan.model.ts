import { Associable } from './associable.model';

export class CarePlan implements Associable {
    id: string;
    title: string;
    status: string;
    description: string;


    period: {
        start: Date;
        end: Date;
    }

    activity: {
        detail: {
            status: string;
            dailyAmount: {
                value: number;
                system: string;
                code: string;
            }
            product: {
                productCodableConcept: {
                    coding: {
                        // URI
                        system: string;
                        version: string;
                        code: string;
                        display: string;
                        userSelected: boolean;
                    }[],
                    text: string;
                }
                productReference: {
                    reference: string;
                    type: string;
                    display: string;
                }
            }
        }
    }[];
}
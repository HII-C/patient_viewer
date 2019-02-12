import { Injectable } from '@angular/core';
import { Condition } from '../models/condition.model';
import { Observation } from '../models/observation.model';
import { CarePlan } from '../models/carePlan.model';

@Injectable()
export class AssociationsService {
    constructor() {}

    getAssociations(condition: Condition);
    getAssociations(observation: Observation);
    getAssociations(carePlan: CarePlan);
    getAssociations(dataPoint: any) {}
}
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { ConditionService } from './condition.service';
import { ObservationService } from './observation.service';
import { Condition } from '../models/condition.model';
import { Observation } from '../models/observation.model';

@Injectable()
export class AssociationService {
    private path = 'http://ec2-52-10-29-181.us-west-2.compute.amazonaws.com/get_items';

    associatedConditions: Map<Condition, boolean> = new Map();
    associatedObservations: Map<Observation, boolean> = new Map();

    constructor(
        private http: Http,
        private conditionService: ConditionService,
        private observationService: ObservationService
    ) {}

    runAssociationsTool(checkedConditions: Array<Condition>, checkedObservations: Array<Observation>) {
        //Clear prior associations
        this.associatedConditions.clear();
        this.associatedObservations.clear();

        this.getAssociations(checkedConditions, checkedObservations).subscribe(associations => {
            // TODO: Actually use the API response for associations
            for (let c of checkedConditions) {
                // Highlight associated conditions
                this.associatedConditions.set(c, true);
            }
        });
    }

    private getAssociations(
        checkedConditions: Array<Condition>, 
        checkedObservations: Array<Observation>,
        ) {
        // Extract relevant fields from checked conditions and observations
        let checkedConditionsInfo = checkedConditions.map(this.extractConditionInfo);
        let checkedObservationsInfo = checkedObservations.map(this.extractObservationInfo);

        // Extract relevant fields from all conditions and observations
        let conditionsInfo = this.conditionService.conditions.map(this.extractConditionInfo);
        let observationsInfo = this.observationService.observations.map(this.extractObservationInfo);

        // Call associations API endpoint
        return this.http.post(this.path, {
            selectedConditions: checkedConditionsInfo,
            selectedObservations: checkedObservationsInfo,
            conditions: conditionsInfo,
            observations: observationsInfo,
        }).map(res => res.json());
    }

    // Extract the code, coding system, and onset datetime from a condition
    private extractConditionInfo(condition: Condition) {
        return {
            code: condition['code']['coding'][0]['code'],
            system: condition['code']['coding'][0]['system'],
            onsetDateTime: condition['onsetDateTime'],
        }
    }

    // Extract the code, coding system, and effective datetime from an observation
    private extractObservationInfo(observation: Observation) {
        return {
            code: observation['code']['coding'][0]['code'],
            system: observation['code']['coding'][0]['system'],
            effectiveDateTime: observation['effectiveDateTime'],
        };
    }
}
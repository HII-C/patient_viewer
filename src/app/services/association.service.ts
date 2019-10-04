import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { ConditionService } from './condition.service';
import { ObservationService } from './observation.service';
import { Condition } from '../models/condition.model';
import { Observation } from '../models/observation.model';

@Injectable()
export class AssociationService {
    // TODO: Replace with actual endpoint
    private path = '/Associations';

    constructor(
        private http: Http,
        private conditionService: ConditionService,
        private observationService: ObservationService
    ) {}

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

    getAssociations(
        selectedConditions: Array<Condition>, 
        selectedObservations: Array<Observation>,
        ) {
        // Extract relevant fields from selected conditions and observations
        let selectedConditionsInfo = selectedConditions.map(this.extractConditionInfo);
        let selectedObservationsInfo = selectedObservations.map(this.extractObservationInfo);

        // Extract relevant fields from all conditions and observations
        let conditionsInfo = this.conditionService.conditions.map(this.extractConditionInfo);
        let observationsInfo = this.observationService.observations.map(this.extractObservationInfo);

        // Call associations API endpoint
        return this.http.get(this.path, {
            params: {
                selectedConditions: selectedConditionsInfo,
                selectedObservations: selectedObservationsInfo,
                conditions: conditionsInfo,
                observations: observationsInfo,
            }
        }).map(res => res.json());
    }
}
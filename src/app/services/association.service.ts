import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConditionService } from './condition.service';
import { ObservationService } from './observation.service';

import { Condition } from '../models/condition.model';
import { Observation } from '../models/observation.model';

@Injectable()
export class AssociationService {
    // TODO: This endpoint is currently unavailable
    private path = 'http://ec2-52-10-29-181.us-west-2.compute.amazonaws.com/get_items';

    // Maps for tracking which conditions and observations
    // are currently associated (according to the associations tool)
    associatedMapConditions: Map<Condition, boolean> = new Map();
    associatedMapObservations: Map<Observation, boolean> = new Map();

    constructor(
        private http: HttpClient,
        private conditionService: ConditionService,
        private observationService: ObservationService
    ) { }

    runAssociationsTool(checkedConditions: Array<Condition>, checkedObservations: Array<Observation>) {
        let conditions = this.conditionService.conditions;
        let observations = this.observationService.observations;

        this.getAssociations(
            checkedConditions,
            checkedObservations,
            conditions,
            observations
        ).subscribe(res => {
            // Clear prior associations
            this.associatedMapConditions.clear();
            this.associatedMapObservations.clear();

            // Extract associations API response
            let associatedConditions = res['selectedConditions'];
            let associatedObservations = res['selectedObservations'];

            // Mark associated conditions as such
            for (let a of associatedConditions) {
                for (let c of conditions) {
                    if (this.extractConditionInfo(c)['code'] == a['code']) {
                        this.associatedMapConditions.set(c, true);
                    }
                }
            }

            // Mark associated observations as such
            for (let a of associatedObservations) {
                for (let o of observations) {
                    if (this.extractObservationInfo(o)['code'] == a['code']) {
                        this.associatedMapObservations.set(o, true);
                    }
                }
            }
        });
    }

    private getAssociations(
        checkedConditions: Array<Condition>,
        checkedObservations: Array<Observation>,
        conditions: Array<Condition>,
        observations: Array<Observation>,
    ) {
        // Extract relevant fields from checked conditions and observations
        let checkedConditionsInfo = checkedConditions.map(this.extractConditionInfo);
        let checkedObservationsInfo = checkedObservations.map(this.extractObservationInfo);

        // Extract relevant fields from all conditions and observations
        let conditionsInfo = conditions.map(this.extractConditionInfo);
        let observationsInfo = observations.map(this.extractObservationInfo);

        // Call associations API endpoint
        return this.http.post(this.path, {
            selectedConditions: checkedConditionsInfo,
            selectedObservations: checkedObservationsInfo,
            conditions: conditionsInfo,
            observations: observationsInfo,
        });
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
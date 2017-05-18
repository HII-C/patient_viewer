import {Component, Input} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {FhirService} from '../services/fhir.service';
// import {PatientService} from '../services/patient.service';
import {Activity} from '../models/activity.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'activities',
    templateUrl: '/activities.html'
})
export class ActivitiesComponent implements DraggableWidget {

    selected: Activity;
    activities: Array<Activity>;
    @Input() patient: Patient;

	gridItemConfiguration: NgGridItemConfig = {};

    constructor(private fhirService: FhirService) {
        console.log("ActivityService created...");
    }

}

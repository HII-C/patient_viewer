import {Component, Input} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {TimelineService} from '../services/timeline.service';
import {Timeline} from '../models/timeline.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'timeline-popup',
    templateUrl: 'app/components/timeline_popup.html'
})
export class TimelinePopupComponent{
    constructor(private fhirService: FhirService, private timelineService: TimelineService) {
        console.log("TimelineService created...");
    }

    ngOnChanges() {
    }
}

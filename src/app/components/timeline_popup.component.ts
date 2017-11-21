import {Component, Input} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {TimelineService} from '../services/timeline.service';
import {Timeline} from '../models/timeline.model';
import {Patient} from '../models/patient.model';

declare var $:any; //Necessary in order to use jQuery to open popup.

@Component({
    selector: 'timeline-popup',
    templateUrl: '/timeline_popup.html'
})
export class TimelinePopupComponent{

    condition = null;

    constructor(private fhirService: FhirService, private timelineService: TimelineService) {
        console.log("TimelinePopupComponent created...");
    }

    show(timelineItem) {
      this.condition = timelineItem;
      $('#timeline_popup').modal({});
    }

    open(timeLineItem) {
        document.getElementById('content').innerHTML = '<h2>' + timeLineItem.code['text'] + '</h2>\n<p>' + timeLineItem.clinicalStatus + '</p>\n<p>' + new Date(timeLineItem.onsetDateTime).toDateString() + '</p>';
        document.getElementById('content').hidden = false;
    }

    close() {
        document.getElementById('content').innerHTML = '';
        document.getElementById('content').hidden = true;
    }
}

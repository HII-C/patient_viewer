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

    open(t1, t2, t3) {
        if(t1 != null) {
            document.getElementById('c1').innerHTML = '<h2>' + t1.code['text'] + '</h2>\n<p>' + t1.clinicalStatus + '</p>\n<p>' + new Date(t1.onsetDateTime).toDateString() + '</p>';
            document.getElementById('c1').style.display = 'inline-block';
            document.getElementById('c1').hidden = false;
        }
        if(t2 != null) {
            document.getElementById('c2').innerHTML = '<h2>' + t2.code['text'] + '</h2>\n<p>' + t2.clinicalStatus + '</p>\n<p>' + new Date(t2.onsetDateTime).toDateString() + '</p>';
            document.getElementById('c2').style.display = 'inline-block';
            document.getElementById('c2').hidden = false;           
        }
        if(t3 != null) {
            document.getElementById('c3').innerHTML = '<h2>' + t3.code['text'] + '</h2>\n<p>' + t3.clinicalStatus + '</p>\n<p>' + new Date(t3.onsetDateTime).toDateString() + '</p>';
            document.getElementById('c3').style.display = 'inline-block';
            document.getElementById('c3').hidden = false;           
        }
    }

    close() {
        document.getElementById('c1').innerHTML = '';
        document.getElementById('c2').innerHTML = '';
        document.getElementById('c3').innerHTML = '';
        document.getElementById('c1').style.display = 'none';
        document.getElementById('c2').style.display = 'none';
        document.getElementById('c3').style.display = 'none';
        document.getElementById('c1').hidden = true;
        document.getElementById('c2').hidden = true;
        document.getElementById('c3').hidden = true;
    }
}

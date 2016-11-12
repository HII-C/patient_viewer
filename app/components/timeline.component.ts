import {Component, Input} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {TimelineService} from '../services/timeline.service';
import {Timeline} from '../models/timeline.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'timelines',
    templateUrl: 'app/components/timeline.html'
})
export class TimelineComponent{

    selected: Timeline;
    timeline: Array<Timeline> = [];
    @Input() patient: Patient;

    constructor(private fhirService: FhirService, private timelineService: TimelineService) {
        console.log("TimelineService created...");
    }

    ngOnChanges() {
        if (this.patient) {
            this.timelineService.index(this.patient).subscribe(data => {
				if(data.entry) {
                	this.timeline = <Array<Timeline>>data.entry.map(r => r['resource']);
                	console.log("Loaded " + this.timeline.length + " timelines.");
				} else {
					this.timeline = new Array<Timeline>();
					console.log("No timelines for patient.");
				}
            });
        }
    }

}

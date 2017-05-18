import {Component, Input} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {FhirService} from '../services/fhir.service';
import {TimelineService} from '../services/timeline.service';
import {Timeline} from '../models/timeline.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'timelines',
    templateUrl: '/timeline.html'
})
export class TimelineComponent implements DraggableWidget {

    selected: Timeline;
    timeline: Array<Timeline> = [];
    @Input() patient: Patient;

	gridItemConfiguration: NgGridItemConfig = {
		// 'dragHandle': '.header',
		'col': 1,
		'row': 1,
		'sizex': 50
		// 'sizey': 1
	}
    constructor(private fhirService: FhirService, private timelineService: TimelineService) {
        console.log("TimelineService created...");
    }

    ngOnChanges() {
        if (this.patient) {
            this.timelineService.index(this.patient).subscribe(data => {
				if (data.entry) {
                    this.timeline = <Array<Timeline>>data.entry.map(r => r['resource']);
                    this.timeline = this.timeline.reverse();
					console.log("Loaded " + this.timeline.length + " timelines.");
				} else {
					this.timeline = new Array<Timeline>();
					console.log("No timelines for patient.");
				}
            });
        }
    }
}

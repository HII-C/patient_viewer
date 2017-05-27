import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {FhirService} from '../services/fhir.service';
import {ObservationService} from '../services/observation.service';
import {LoupeService} from '../services/loupe.service';
import {MapService} from '../services/map.service';
import {Observation} from '../models/observation.model';
import {Patient} from '../models/patient.model';
import {Condition} from '../models/condition.model';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'observations',
	templateUrl: '/observations.html'
})
export class ObservationsComponent implements DraggableWidget {

	selected: Observation;
	test: Observation;
	observations: Array<Observation> = [];
	@Input() patient: Patient;
	@Output() observationReturned: EventEmitter<Array<any>> = new EventEmitter();
	mappings: { [key: string]: Array<string> } = {};

	// For options: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = {
		'col': 35,               //  The start column for the item
		'row': 4,               //  The start row for the item
		'sizex': 40,             //  The start width in terms of columns for the item
		'sizey': 50,             //  The start height in terms of rows for the item
		'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		'borderSize': 15,
		'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		'maxCols': 50,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	}

	constructor(private fhirService: FhirService, private observationService: ObservationService,
		private mapService: MapService, private loupeService: LoupeService) {
		console.log("ObservationsComponent created...");

		this.mappings = MapService.STATIC_MAPPINGS;

	}

	ngOnChanges() {
		console.log("Observations ngOnChanges");

		if (this.patient) {
			this.observationService.index(this.patient).subscribe(data => {
				if(data.entry) {

					this.observations = <Array<Observation>>data.entry.map(r => r['resource']);
					this.observations = this.observations.reverse();
					console.log("Loaded " + this.observations.length + " observations.");
					//append broken data here
					this.loupeService.observationsArray = this.observations;
					this.observationReturned.emit(this.observations);
				} else {
					this.observations = new Array<Observation>();
					console.log("No observations for patient.");
				}
			});
		}
	}

	csiroLookup(code: Observation) {
		setTimeout(()=>{console.log(code)}, 5000);
		this.observations[(this.observations.indexOf(code))].code['text'] = "working?";

	}

	updateHighlighted(condition: Condition) {

		let response = this.mapService.load("XYZ");
		for(let obs of this.observations) {
			obs['highlighted'] = false;
		}
		let key = condition.code.coding[0].code;
		if(this.mappings[key] != null) {
			for(let obs of this.observations) {
				if(this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
					obs['highlighted'] = true;
				}
			}
		}
	}
}

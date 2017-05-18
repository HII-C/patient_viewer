import {Component, Input} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {FhirService} from '../services/fhir.service';
import {ObservationService} from '../services/observation.service';
import {OpenMRSService} from '../services/openmrs.service';
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
	mappings: { [key: string]: Array<string> } = {};
	
	gridItemConfiguration: NgGridItemConfig = {};

	constructor(private fhirService: FhirService, private observationService: ObservationService,
		private mapService: MapService, private loupeService: LoupeService, private openMRSService: OpenMRSService) {
		console.log("ObservationsComponent created...");

		this.mappings = MapService.STATIC_MAPPINGS;
		console.log("OPENMRS: ");
		//openMRSService.createPatient('Major', 'Brown', 'M');
		/*openMRSService.getPatient('abaaef89-f304-46e3-97a2-a235a0fc57b9').subscribe(res => {
			console.log(res);
		});*/
		console.log("OPENMRS DONE");

		// this.mapService.load().subscribe(res => {
		// 	console.log("Loaded mappings...");
		// 	this.mappings = res;
		// });
	}

	ngOnChanges() {
		console.log("Observations ngOnChanges");

		if (this.patient) {
			this.observationService.index(this.patient).subscribe(data => {
				if(data.entry) {
					this.observations = <Array<Observation>>data.entry.map(r => r['resource']);
					this.observations = this.observations.reverse();
					this.test = new Observation();
					this.test = JSON.parse('{"resourceType":"Observation","id":"argonaut-lab-24","meta":{"versionId":"206106","lastUpdated":"2016-03-09T15:35:58.410+00:00"},"text":{"status":"generated","div":"<div>See structured data</div>"},"status":"final","category":{"coding":[{"system":"http://hl7.org/fhir/observation-category","code":"laboratory","display":"Laboratory"}],"text":"Laboratory"},"code":{"coding":[{"system":"http://loinc.org","code":"32623-1","display":"Platelet mean volume"}],"text":"Platelet mean volume"},"subject":{"reference":"Patient/1032702"},"effectiveDateTime":"2005-07-04","valueQuantity":{"value":9.1,"unit":"fL","system":"http://unitsofmeasure.org"}}');
					this.test.code['text'] = "";
					//console.log(JSON.stringify(this.observations[0]));
					this.observations.push(this.test);
					console.log("Loaded " + this.observations.length + " observations.");
					//append broken data here
					this.loupeService.observationsArray = this.observations;
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

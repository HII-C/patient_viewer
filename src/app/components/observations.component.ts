import {Component, Input} from '@angular/core';
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
export class ObservationsComponent {

	selected: Observation;
	test: Observation;
	observations: Array<Observation> = [];
	@Input() patient: Patient;
	mappings: { [key: string]: Array<string> } = {};

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

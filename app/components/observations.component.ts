import {Component, Input} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ObservationService} from '../services/observation.service';
import {MapService} from '../services/map.service';
import {Observation} from '../models/observation.model';
import {Patient} from '../models/patient.model';
import {Condition} from '../models/condition.model';

@Component({
	selector: 'observations',
	templateUrl: 'app/components/observations.html'
})
export class ObservationsComponent {

	selected: Observation;
	observations: Array<Observation> = [];
	@Input() patient: Patient;

	mappings: { [key: string]: Array<string> } = {};

	constructor(private fhirService: FhirService,
							private observationService: ObservationService,
							private mapService: MapService) {
		console.log("ObservationsComponent created...");

		this.mapService.load().subscribe(res => {
			console.log("Loaded mappings...");
			this.mappings = res;
		});
	}

	ngOnChanges() {
		console.log("Observations ngOnChanges");

		if (this.patient) {
			this.observationService.index(this.patient).subscribe(data => {
				if(data.entry) {
					this.observations = <Array<Observation>>data.entry.map(r => r['resource']);
					console.log("Loaded " + this.observations.length + " observations.");
				} else {
					this.observations = new Array<Observation>();
					console.log("No observations for patient.");
				}
			});
		}
	}

	updateHighlighted(condition: Condition) {
		for(let obs of this.observations) {
			obs['highlighted'] = false;
		}

		let key = condition.code['coding'][0]['code'];
		if(this.mappings[key] != null) {
			for(let obs of this.observations) {
				if(this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
					obs['highlighted'] = true;
				}
			}
		}
	}
}

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ObservationService} from '../services/observation.service';
import {LoupeService} from '../services/loupe.service';
import {MapService} from '../services/map.service';
import {DoctorService} from '../services/doctor.service';
import {ChartTimelineService} from '../services/chartTimeline.service';

import {Observation} from '../models/observation.model';
import {Patient} from '../models/patient.model';
import {Condition} from '../models/condition.model';
import {Observable} from 'rxjs/Observable';
import {ObservationRecursive} from './observationRecursion.component';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import * as moment from 'moment';

@Component({
	selector: 'observations',
	templateUrl: '/observationmain.html'
})
export class ObservationsComponent {

	selected: Observation;
	test: Observation;
	observations: Array<Observation> = [];
	@Input() patient: Patient;
	@Output() observationReturned: EventEmitter<Array<any>> = new EventEmitter();
	mappings: { [key: string]: Array<string> } = {};
	
	constructor(private fhirService: FhirService, private observationService: ObservationService,
		private mapService: MapService, private loupeService: LoupeService, private doctorService: DoctorService,
		private chartService: ChartTimelineService, private http:Http) {
		console.log("ObservationsComponent created...");

		this.mappings = MapService.STATIC_MAPPINGS;
		// this.gridItemConfiguration.draggable = this.doctorService.configMode;

	}
	loadFinished() {
		this.observationService.observations = this.observationService.observations.reverse();
		console.log("Loaded " + this.observationService.observations.length + " observations.");
		this.observationService.observations.sort((n1, n2) => {
			if (n1['code']['coding'][0]['code'] < n2['code']['coding'][0]['code']) {
				return 1;
			}
			if (n1['code']['coding'][0]['code'] > n2['code']['coding'][0]['code']) {
				return -1;
			}
		})
		//this.chartService.setData(this.observationService.observations);
		//append broken data here
		this.observationService.observations.sort((n1, n2) => {
			if (n1.effectiveDateTime < n2.effectiveDateTime) {
				return 1;
			}
			if (n1.effectiveDateTime > n2.effectiveDateTime) {
				return -1;
			}
		})

		var diff = new Date().getTime() - new Date(this.observationService.observations[0].effectiveDateTime).getTime();
		for(let ob of this.observationService.observations) {
			var newDate = new Date(ob.effectiveDateTime).getTime() + diff;
			ob.relativeDateTime = new Date(newDate).toDateString();
			ob.relativeDateTime = moment(newDate).toISOString();
			console.log(ob.relativeDateTime,ob.effectiveDateTime);
		}

		console.log("running service");

		//this.observationService.observations = this.observationService.observations;
		this.observationService.populate(this.observationService.temp.categories);
		this.observationService.categorizedObservations = this.observationService.temp;

		this.loupeService.observationsArray = this.observationService.observations;
		this.observationReturned.emit(this.observationService.observations);

		console.log("done!");


	}
	loadData(url) {
		let isLast = false;
		this.observationService.indexNext(url).subscribe(data => {
			if(data.entry) {
			 	let nextObs= <Array<Observation>>data.entry.map(r => r['resource']);

				this.observationService.observations = this.observationService.observations.concat(nextObs);
				this.observationService.filterCategory(nextObs);
				isLast = true;
				for(let i of data.link) {
					if(i.relation=="next") {
						isLast = false;
						this.loadData(i.url);
					}
				}
				if(isLast) {
					this.loadFinished();
				}
			}
		});

	}

	ngOnChanges() {
		console.log("Observations ngOnChanges");

		if (this.patient) {

			this.observationService.index(this.patient).subscribe(data => {
				if(data.entry) {
					let nextLink = null;
					this.observationService.observations = <Array<Observation>>data.entry.map(r => r['resource']);
					this.observationService.filterCategory(this.observationService.observations);

					for(let i of data.link) {
						if(i.relation=="next") {
							nextLink = i.url;
						}
					}
					if(nextLink) {this.loadData(nextLink);}
					else {this.loadFinished();}

				} else {
					this.observationService.observations = new Array<Observation>();
					console.log("No observations for patient.");
				}
			});

			// if (this.selected)
		}
	}

	csiroLookup(code: Observation) {
		setTimeout(()=>{console.log(code)}, 5000);
		this.observationService.observations[(this.observationService.observations.indexOf(code))].code['text'] = "working?";

	}

	updateHighlighted(condition: Condition) {

		let response = this.mapService.load("XYZ");
		for(let obs of this.observationService.observations) {
			obs['highlighted'] = false;
		}
		let key = condition.code.coding[0].code;
		if(this.mappings[key] != null) {
			for(let obs of this.observationService.observations) {
				if(this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
					obs['highlighted'] = true;
				}
			}
		}
	}


}

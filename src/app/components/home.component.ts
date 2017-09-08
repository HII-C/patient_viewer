import {Component} from '@angular/core';

import {PatientComponent} from './patient.component';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'home',
    templateUrl: '/home.html'
})
export class HomeComponent {

	selected: Patient = null;

	constructor() {
		console.log("HomeComponent has been initialized.");
	}

	selectPatient(patient: Patient) {
		this.selected = patient;
		console.log("HomeComponent setting selection to patient: " + this.selected);
	}

}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DoctorService} from '../services/doctor.service';
import {Patient} from '../models/patient.model';
import {ObservationService} from '../services/observation.service';


@Component({
    selector: 'triplelist',
    templateUrl: '/tripleList.html'
})

export class TripleListComponent {
	@Input() patient: Patient;
	@Output() passThrough: EventEmitter<Patient> = new EventEmitter();
    obsCount: number = 0;

    constructor(private doctorService: DoctorService, private observationService: ObservationService) {
        console.log("TripleList Component created");

		this.passThrough.emit(this.patient);
     }
     updateTotal(event) {
       console.log("total:"+event);
       this.obsCount = event;
     }

}

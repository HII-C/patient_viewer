import {Component, Compiler} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {PatientService} from '../services/patient.service';
import {SmartService} from '../services/smart.service';
import {FhirService} from '../services/fhir.service';
import {Patient} from '../models/patient.model';
import {ConditionService} from '../services/condition.service';

@Component({
    selector: 'home',
    templateUrl: './home.html'
})
export class HomeComponent {
    selected: Patient = null;

    constructor(private fhirService: FhirService,
                private patientService: PatientService,
                private cookieService: CookieService,
                private smartService: SmartService,
                private conditionService: ConditionService,
                private compiler: Compiler) {

        this.compiler.clearCache();
        this.fhirService.setUrl(this.cookieService.get('fhirBaseUrl'));

        if (this.fhirService.token) {
            // Access token is already available.
            this.selectPatientById(this.patientService.patientId);
        } else {
            // Retrieve the access token and patient.
            this.smartService.authenticate().subscribe(data => {
                this.fhirService.setToken(data.access_token);
                this.selectPatientById(data.patient);
            });
        }
    }

    // Select a patient with the given ID
    selectPatientById(id) {
        this.patientService.setPatientId(id);
        this.patientService.loadPatient().subscribe(patient => {
            this.selected = patient;
        });
    }
}

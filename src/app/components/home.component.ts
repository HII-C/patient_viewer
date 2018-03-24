import {Component, Compiler} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {PatientService} from '../services/patient.service';
import {SmartService} from '../services/smart.service';
import {FhirService} from '../services/fhir.service';
import {Patient} from '../models/patient.model';
import {ConditionService} from '../services/condition.service';

@Component({
    selector: 'home',
    templateUrl: '/home.html'
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
            this.selectPatientById(this.patientService.patient);
        } else {
            // Retrieve the access token and patient.
            this.smartService.authenticate().subscribe(data => {
                this.fhirService.setToken(data.access_token);
                this.selectPatientById(data.patient);
            });
        }
    }

    selectPatientById(id) {
        // Select a patient with the given ID.
        this.patientService.get(id).subscribe(d => {
            this.selected = <Patient>d; //.entry['resource'];

            for (let id of d.identifier) {
                if (id.type && id.type.coding[0].code == "MR") {
                    this.selected.mrn = id.value;
                }
            }
        });
    }
}

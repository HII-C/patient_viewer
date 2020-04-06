import { Component, Compiler } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { PatientService } from '../../services/patient.service';
import { SmartService } from '../../services/smart.service';
import { FhirService } from '../../services/fhir.service';

import { Patient } from '../../models/patient.model';

/**
 * High-level component that wraps the components showing 
 * patient information, the toolbar, the timeline, and the 
 * triple list (conditions, observations, and care plans).
 */
@Component({
    selector: 'home',
    templateUrl: './home.html'
})
export class HomeComponent {
    /** The patient that is being displayed. */
    selected: Patient = null;

    constructor(
        private fhirService: FhirService,
        private patientService: PatientService,
        private cookieService: CookieService,
        private smartService: SmartService,
        private compiler: Compiler
    ) {
        this.compiler.clearCache();
        this.fhirService.setUrl(this.cookieService.get('fhirBaseUrl'));

        // Retrieve patient data from sandbox.
        if (this.fhirService.token) {
            // Access token is already available.
            this.selectPatientById(this.patientService.patientId);
        } else {
            // Retrieve the access token and patient.
            this.smartService.authenticate().subscribe(data => {
                this.fhirService.setToken(data['access_token']);
                this.selectPatientById(data['patient']);
            });
        }
    }

    /**
     * Select a patient to display.
     * @param id The id of the selected patient.
     */
    public selectPatientById(id: string) {
        this.patientService.setPatientId(id);
        this.patientService.loadPatient().subscribe(patient => {
            this.selected = patient;
        });
    }
}
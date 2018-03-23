import { Component, Compiler } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { PatientService } from '../services/patient.service';
import { SmartService } from '../services/smart.service';
import { FhirService } from '../services/fhir.service';
import { PatientComponent } from './patient.component';
import { Patient } from '../models/patient.model';
import { ConditionService } from '../services/condition.service';

@Component({
  selector: 'home',
  templateUrl: '/home.html'
})
export class HomeComponent {
  selected: Patient = null;
  allergyArray: Array<String> = [];
  allergyString: String = "";

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

      if (this.selected) {
        this.conditionService.loadAllergies(this.selected, true).subscribe(allergies => {
          if (allergies.entry) {
            //add allergy strings to allergyArray
            let entries = allergies.entry;
            for (let e of entries) {
              this.allergyArray.push(e.resource.code.text);
            }
            
            //construct displayed allergyString
            if (this.allergyArray.length == 1) { //singular allergy
              this.allergyString = entries[0].resource.code.text;
            }
            else { //mulitple allergies
              this.allergyString = entries[0].resource.code.text + ", ...";
            }
          }
          else { //no allergies
            this.allergyString = "N/A";
          }
        });
      }
    });
  }
}

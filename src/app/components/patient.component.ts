import {Component, Compiler} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {SmartService} from '../services/smart.service';
import {PatientService} from '../services/patient.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {Http, Headers} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'patients',
    templateUrl: '/patient.html',

    animations: [
      trigger('fadeIn', [
        state('in', style({opacity: '1'})),
        transition('void => *', [
          style({opacity: '0'}),
          animate('800ms ease-in')
        ])
      ])
    ]
})
export class PatientComponent {
    selected: Patient;
    server: Server;
    selectedCondition: Condition;
    nav2: boolean = false;

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler, private http: Http, private smartService: SmartService, private cookieService: CookieService) {
		this.compiler.clearCache();
    this.fhirService.setUrl(this.cookieService.get('fhirBaseUrl'));

        this.smartService.authenticate().subscribe(data => {
            this.fhirService.setToken(data.access_token);
            this.select(data.patient);
          });;

    }


    select(id) {
        console.log("Selected patient: " + id);
        this.patientService.get(id).subscribe(d => {
            console.log("Fetching: " + d);
            this.selected = <Patient>d; //.entry['resource'];
        });
    }


    genderString(patient: Patient) {
        var s = 'Unknown';
        switch (patient.gender) {
            case 'female':
                s = 'Female';
                break;
            case 'male':
                s = 'Male';
                break;
        }
        return s;
    }

    selectCondition(condition) {
      this.selectedCondition = condition;
      console.log(this.selectedCondition);
    }

    switchNav() {
      this.nav2 = !this.nav2;
    }
}

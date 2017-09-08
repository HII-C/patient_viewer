import {Component, Compiler, EventEmitter, Output} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {SmartService} from '../services/smart.service';
import {PatientService} from '../services/patient.service';
import {DoctorService} from '../services/doctor.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';
import {Http, Headers} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';

@Component({
    selector: 'patient',
    templateUrl: '/patient.html'
})
export class PatientComponent {

    selected: Patient;
    server: Server;
    selectedCondition: Condition;
    advancedSearch = false;
    graphConfig: any;
	@Output() patientSelected: EventEmitter<Patient> = new EventEmitter();

	// For options: https://github.com/BTMorton/angular2-grid

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler, private http: Http, private smartService: SmartService, private cookieService: CookieService, private doctorService: DoctorService) {

		this.compiler.clearCache();
        this.fhirService.setUrl(this.cookieService.get('fhirBaseUrl'));
        if(this.fhirService.token) {
            this.select(this.patientService.patient);
        }
        else {
            this.smartService.authenticate().subscribe(data => {
                this.fhirService.setToken(data.access_token);
                this.select(data.patient);
            });;
        }
        this.graphConfig = this.cookieService.getObject("graphConfig");
        // this.cookieService.remove("graphConfig");
    }


    select(id) {
        console.log("Selected patient: " + id);
        this.patientService.get(id).subscribe(d => {
            console.log("Fetching: " + d);
            this.selected = <Patient>d; //.entry['resource'];
            for(let id of d.identifier) {
              if(id.type && id.type.coding[0].code=="MR"){
                this.selected.mrn = id.value;
              }
            }
			this.patientSelected.emit(this.selected);
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

}

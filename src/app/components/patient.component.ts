import {Component, Compiler} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {SmartService} from '../services/smart.service';
import {PatientService} from '../services/patient.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';

import {Http, Headers} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
// import {DraggableWidget} from './draggable_widget.component';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';


@Component({
    selector: 'patients',
    templateUrl: '/patient.html'
})
export class PatientComponent {

    selected: Patient;
    server: Server;
    selectedCondition: Condition;
    advancedSearch = false;

	// For options: https://github.com/BTMorton/angular2-grid

	gridConfiguration: NgGridConfig = <NgGridConfig>{
		'margins': [5],
		'draggable': true,
		'resizable': true,
		'max_cols': 0,
		'max_rows': 0,
		'visible_cols': 0,
		'visible_rows': 0,
		'min_cols': 1,
		'min_rows': 1,
		'col_width': 2,
		'row_height': 2,
		'cascade': 'up',
		'min_width': 50,
		'min_height': 50,
		'fix_to_grid': false,
		'auto_style': true,
		'auto_resize': false,
		'maintain_ratio': false,
		'prefer_new': false,
		'zoom_on_drag': false,
		'limit_to_screen': true
	};
	gridItemConfiguration = { 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 1, 'sizey': 1 }; // For options: https://github.com/BTMorton/angular2-grid

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler, private http: Http, private smartService: SmartService, private cookieService: CookieService) {
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

}

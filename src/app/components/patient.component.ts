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
// import {DraggableWidget} from './draggable_widget.component';
import {DraggableWidget} from './draggable_widget.component';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';


@Component({
    selector: 'patient',
    templateUrl: '/patient.html'
})
export class PatientComponent {

    selected: Patient;
    server: Server;
    selectedCondition: Condition;
    advancedSearch = false;
	@Output() patientSelected: EventEmitter<Patient> = new EventEmitter();

	// For options: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = {
		'col': 1,               //  The start column for the item
		'row': 1,               //  The start row for the item
		'sizex': 30,             //  The start width in terms of columns for the item
		'sizey': 30,             //  The start height in terms of rows for the item
		'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		'borderSize': 15,
		'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		'draggable': false,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	}

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler, private http: Http, private smartService: SmartService, private cookieService: CookieService, private doctorService: DoctorService) {
    this.gridItemConfiguration.draggable = this.doctorService.configMode;
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

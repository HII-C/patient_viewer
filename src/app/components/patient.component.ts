import {Component, Compiler} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ServerService} from '../services/server.service';
import {PatientService} from '../services/patient.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';
// import {DraggableWidget} from './draggable_widget.component';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';


@Component({
    selector: 'patient',
    templateUrl: '/patient.html'
})
export class PatientComponent {

    selected: Patient;
    patients: Array<Patient>;
    server: Server;
    servers: Server[] = ServerService.servers;
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

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler) {
		this.compiler.clearCache();
        this.selectServer(this.servers[0]);
        this.loadPatients();
    }

    loadPatients() {
        this.patientService.index().subscribe(data => {
            this.patients = <Array<Patient>>data.entry.map(r => r['resource']);
            console.log("Loaded " + this.total() + " patients.");
            if (this.patients.length > 0) {
                this.select(this.patients[0].id);
            }
        });
    }

    total(): number {
        var t = 0;
        if (this.patients) {
            t = this.patients.length;
        }
        return t;
    }

    select(id) {
        console.log("Selected patient: " + id);
        this.patientService.get(id).subscribe(d => {
            console.log("Fetching: " + d);
            this.selected = <Patient>d; //.entry['resource'];
        });
    }

	selectServer(server: Server) {
		console.log("Setting server to: " + server.url);
		this.server = server;
		this.fhirService.setUrl(server.url);
		this.loadPatients();
	}


    selectServerForUrl(url: string) {
		this.selectServer(this.serverFor(url));
    }

    serverFor(url: string) {
        var obj: Server = null;
        for (var server of this.servers) {
            if (server.url == url) {
                obj = server;
                break;
            }
        }
        return obj;
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

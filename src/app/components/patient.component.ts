import {Component, Compiler} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ServerService} from '../services/server.service';
import {PatientService} from '../services/patient.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';
import {DraggableWidget} from './draggable_widget.component';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';


@Component({
    selector: 'patient',
    templateUrl: '/patient.html'
})
export class PatientComponent implements DraggableWidget{

    selected: Patient;
    patients: Array<Patient>;
    server: Server;
    servers: Server[] = ServerService.servers;
    selectedCondition: Condition;
    advancedSearch = false;

	// For options: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = <NgGridConfig>{
			// 'dragHandle': '.header',
			// 'col': 1,
			// 'row': 1,
			// 'sizex': 150
			// 'sizey': 1
		};

	// {
		// 'col': 1,               //  The start column for the item
		// 'row': 1,               //  The start row for the item
		// 'sizex': 2,             //  The start width in terms of columns for the item
		// 'sizey': 1,             //  The start height in terms of rows for the item
		// 'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		// 'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		// 'borderSize': 15,
		// 'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		// 'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		// 'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		// 'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		// 'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		// 'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		// 'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		// 'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		// 'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		// 'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	// }
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

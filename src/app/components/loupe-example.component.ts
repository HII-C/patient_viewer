import {Component, OnChanges, Input} from '@angular/core';
import {PatientComponent} from './patient.component';
import {ObservationsComponent} from './observations.component';
import {Condition} from '../models/condition.model';
import {LoupeService} from '../services/loupe.service';

@Component({
    selector: 'loupe-example',
    templateUrl: '/loupe-example.html'
})
export class LoupeExampleComponent {
    query = {
        filterByCategory: {},
        filterByCode: {
            code: {},
            codeSystem: {}
        },
        codesToFilterCategory: {},
        codesToFilter: []
    };
    result: {};
    condition: Condition;
    observations: Array<any>;
    constructor(private loupeService: LoupeService) {
    }

    test() {
        console.log("LoupeExampleComponent has been initialized. This is only an example!");
        var condition = this.loupeService.activeCondition;
        var observations = this.loupeService.observationsArray;
        console.log(condition);
        console.log(observations);
        this.update();
        this.search();
        console.log(this.result);
    }

    search() {
        this.loupeService.query(this.query).subscribe(data => {
            console.log("Loupe returned a result. Yay.");
            this.result = data;
        }, error => {
            console.log("Something weird happened. Bug?");
        });
    }

    update(){
        // TODO There is some hardcoding right now due to the way systems are coded in the data, need to fix before actual use
        var condition = this.loupeService.activeCondition;
        var observations = this.loupeService.observationsArray;
        this.query.filterByCategory = "Diagnosis";
        this.query.filterByCode.code = condition.code.coding[0];
		this.query.filterByCode.codeSystem = "SNOMEDCT_US"
        this.query.codesToFilterCategory = "Observation";
        for (let o of observations){
			this.query.codesToFilter.push({
				codeSystem: "LOINC",
				code: String(o.code['coding'][0]['code'])
			});
        };
    }

    asString(o: Object): string {
        return JSON.stringify(o, null, "\t");
    }

}

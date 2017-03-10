import {Component, OnChanges, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PatientComponent} from './patient.component';
import {ObservationsComponent} from './observations.component';
import {Condition} from '../models/condition.model';
import {LoupeService} from '../services/loupe.service';

@Component({
    selector: 'loupe-example',
    templateUrl: '/loupe-example.html'
})

export class LoupeExampleComponent {
    result: {};
    query: {
        "filterByCategory": string,
        "filterByCode": {
            "code": string,
            "codeSystem": string
        },
        "codesToFilterCategory": string,
        "codesToFilter": Array<any>
    } = {
        "filterByCategory": "",
        "filterByCode": {
            "code": "",
            "codeSystem": ""
        },
        "codesToFilterCategory": "",
        "codesToFilter": []
    };
    condition: Condition;
    observations: Array<any>;
    constructor(private loupeService: LoupeService) {
    }

    test() {
        console.log("LoupeExampleComponent has been initialized. This is only an example!");
        this.search();
        console.log(this.result);
    }

    search() {
        let newQuery = this.update();
        this.loupeService.query(newQuery).subscribe(data => {
            console.log("Loupe returned a result. Yay.");
            this.result = data;
            console.log(this.result);
        }, error => {
            console.log("Something weird happened. Bug?");
        });
    }

    update(){
        // TODO There is some hardcoding right now due to the way systems are coded in the data, need to fix before actual use
        let condition = this.loupeService.activeCondition;
        let conditions = this.loupeService.conditionArray;
        console.log(condition);
        this.query.filterByCategory = 'Diagnosis';
        this.query.filterByCode.code = condition.code.coding[0].code;
		this.query.filterByCode.codeSystem = condition.code.coding[0].system;
        this.query.codesToFilterCategory = "Diagnosis";
        for (let c of conditions){
			this.query.codesToFilter.push({
				codeSystem: String(c.code.coding[0].system),
				code: String(c.code.coding[0].code)
			});
        };
        let response = this.query;
        console.log(response);
        return this.asString(response);
    }

    asString(o: Object): string {
        return JSON.stringify(o, null, "\t");
    }

}

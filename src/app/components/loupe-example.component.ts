import {Component, OnChanges, Input} from '@angular/core';
import {PatientComponent} from './patient.component';
import {ObservationsComponent} from './observations.component';
import {Condition} from '../models/condition.model';
import {LoupeService} from '../services/loupe.service';

@Component({
    selector: 'loupe-example',
    templateUrl: '/loupe-example.html'
})
export class LoupeExampleComponent implements OnChanges{
    query = {
        "filterByCategory": {},
        "filterByCode": {
            "code": {},
            "codeSystem": {}
        },
        "codesToFilterCategory": {},
        "codesToFilter": []
    };
    result: {};
    condition: Condition;
    observations: Array<any>;
    constructor(private loupeService: LoupeService) {
        this.condition = this.loupeService.activeCondition;
        this.observations = this.loupeService.observationsArray;
    }

    ngOnChanges() {
        console.log("LoupeExampleComponent has been initialized. This is only an example!");
        console.log(this.condition);
        console.log(this.observations);
        console.log(this.query);
        console.log(this.result);
    }

    search() {
        this.loupeService.query(this.query).subscribe(data => {
            console.log("Loupe returned a result. Yay.");
            console.log(data);
            this.result = data;
        }, error => {
            console.log("Something weird happened. Bug?");
        });
    }

    update(){
        this.query.filterByCategory = "Diagnosis";
        this.query.filterByCode.code = String(this.condition.code['coding'][0]['code']);
		this.query.filterByCode.codeSystem = String(this.condition.code['coding'][0]['system']);
        this.query.codesToFilterCategory = ("Observation");
        for (let o of this.observations){
			this.query.codesToFilter.push({
				"codeSystem": String(o.code['coding'][0]['system']),
				"code": String(o.code['coding'][0]['code'])
			});
        };
        console.log(this.query);
    }

    asString(o: Object): string {
        return JSON.stringify(o, null, "\t");
    }

}

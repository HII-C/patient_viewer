import {Component, OnInit} from '@angular/core';
import {PatientComponent} from './patient.component';

import {LoupeService} from '../services/loupe.service';

@Component({
    selector: 'loupe-example',
    templateUrl: '/loupe-example.html'
})
export class LoupeExampleComponent implements OnInit {

    query = {
        "filterByCategory": "Diagnosis",
        "filterByCode": {
            "code": "250.6",
            "codeSystem": "ICD9CM"
        },
        "codesToFilterCategory": "Diagnosis",
        "codesToFilter": [
            {
                "codeSystem": "ICD9CM",
                "code": "401.9"
            },
            {
                "codeSystem": "ICD9CM",
                "code": "724.03"
            },
            {
                "codeSystem": "ICD9CM",
                "code": "305.1"
            }
        ]
    };
    result: {};

    constructor(private loupeService: LoupeService) {
    }

    ngOnInit() {
        console.log("LoupeExampleComponent has been initialized. This is only an example!");
        this.search();
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

    asString(o: Object): string {
        return JSON.stringify(o, null, "\t");
    }

}

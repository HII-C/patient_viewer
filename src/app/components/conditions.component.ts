import {Component, Input, Output, EventEmitter, Pipe} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ConditionService} from '../services/condition.service';
import {LoupeService} from '../services/loupe.service';
import {CsiroService} from '../services/csiro.service';
import {Condition} from '../models/condition.model';
import {Patient} from '../models/patient.model';

@Component({
    selector: 'conditions',
    templateUrl: '/conditions.html'
})
export class ConditionsComponent{

    selected: Condition;
    conditions: Array<Condition> = [];
    @Input() patient: Patient;

    @Output() conditionSelected:EventEmitter<Condition> = new EventEmitter();

    constructor(private fhirService: FhirService, private conditionService: ConditionService, private loupeService: LoupeService, private csiroService: CsiroService) {
        console.log("ConditionsComponent created...");
        this.loupeService.activeCondition = this.selected;
    }

    selectCondition(condition: Condition) {
      this.selected = condition;
      this.loupeService.activeCondition = this.selected;
      this.conditionSelected.emit(this.selected);
      for(let c of this.conditions) {
        c['selected'] = (c.id == this.selected.id);
      }
    }

    sortCondition(x: string) {
      if(x=="date-asc" || x=="date-desc") {
        var a = 1;
        if(x=="date-asc") {
          a=-a;
        }
        this.conditions.sort((n1,n2)=> {
            if(n1.code['coding'][0]['code']>n2.code['coding'][0]['code']) {
              return a;
            }
            if(n1.code['coding'][0]['code']<n2.code['coding'][0]['code']) {
              return -a;
            }
        })
      }

      console.log("sort");
    }

    ngOnChanges() {
        this.selected = null;
        if (this.patient) {
            this.conditionService.index(this.patient).subscribe(data => {
				if(data.entry) {
                    this.conditions = <Array<Condition>>data.entry.map(r => r['resource']);
                    this.conditions = this.conditions.reverse();
                	console.log("Loaded " + this.conditions.length + " conditions.");
				} else {
					this.conditions = new Array<Condition>();
					console.log("No conditions for patient.");
				}
            });
        }
    }
    testingCsiro(){
        console.log(this.csiroService.MapQuery);
    }
}

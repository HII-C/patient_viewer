import {Component, Input, Output, EventEmitter, Pipe} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ConditionService} from '../services/condition.service';
import {LoupeService} from '../services/loupe.service';
import {CsiroService} from '../services/csiro.service';
import {DoctorService} from '../services/doctor.service';
import {Condition} from '../models/condition.model';
import {Patient} from '../models/patient.model';
import {Csiro} from '../models/csiro.model';

@Component({
    selector: 'conditions',
    templateUrl: '/conditions.html'
})
export class ConditionsComponent{

    selected: Condition;
    conditions: Array<Condition> = [];
    viewConditionList: Array<any> = [];
    viewToggle: boolean = true;
    @Input() patient: Patient;

    @Output() conditionSelected:EventEmitter<Condition> = new EventEmitter();

    constructor(private fhirService: FhirService, private conditionService: ConditionService, private loupeService: LoupeService, private csiroService: CsiroService, private doctorService: DoctorService) {
        console.log("ConditionsComponent created...");
        this.loupeService.activeCondition = this.selected;
    }

    selectCondition(condition: Condition) {
      this.selected = condition;
      this.loupeService.activeCondition = this.selected;
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
                    this.loupeService.conditionArray = this.conditions;
                    if (this.viewToggle == true){
                        this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
                    }
				} else {
					this.conditions = new Array<Condition>();
					console.log("No conditions for patient.");
				}
            });
        }
    }
    testingCsiro(){
        this.csiroService.MapQuery().subscribe(data =>{
            console.log("Hey CSIRO works");
            console.log(data);
        }, error => {
            console.log("oops");
        });
    }

    // Method for basic toggling, using JSON functions to toggle internal Angular2 module OnChanges for UI reactivity
    toggleExpansion(){
        // Basic logic for toggle, assuming this.conditions contains all info, and this.viewConditionList is the modified list being used to display data
        if (this.viewToggle == true){
            this.viewConditionList = this.doctorService.assignVisible(this.conditions);
            this.viewToggle = false;
        }
    }
    ellipsesToggle(){
        if (this.viewToggle == false){
            this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
            this.viewToggle = true;
        }
    }
}

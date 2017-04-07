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
    viewToggle: boolean = false;
    collapseQueue: Array<any> = [];
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
      if (this.viewToggle == false){
          this.viewConditionList = this.doctorService.assignVisible(this.conditions);
      }
      else {
          this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
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
                    if (this.viewToggle == false){
                        //this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
                        this.viewConditionList = this.doctorService.assignVisible(this.conditions);

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
    ellipsesToggle(){
        // Basic logic for toggle, assuming this.conditions contains all info, and this.viewConditionList is the modified list being used to display data
        if (this.viewToggle == false){
            this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
            this.viewToggle = true;
        }
    }
    toggleExpansion(){

        if (this.viewToggle == true){
            this.viewConditionList = this.doctorService.assignVisible(this.conditions);
            this.viewToggle = false;
        }
    }
    addCollapse(checked: boolean, value) {
      if(checked) {
        this.collapseQueue.push(value);
      }
      else {
        var index = this.collapseQueue.indexOf(value);
        if (index > -1) {
           this.collapseQueue.splice(index, 1);
        }
      }

    }
    collapse() {
      for(let c of this.collapseQueue) {
        let index = 0;
        for(let i of this.viewConditionList) {
          if(i.code["coding"][0]["code"]==(<HTMLInputElement>document.getElementById(c)).value) {
            this.viewConditionList.splice(index,1);
            console.log("found:"+index);
          }
          index++;
          console.log("code:"+i.code["coding"][0]["code"]+"vs:"+(<HTMLInputElement>document.getElementById(c)).value);
        }
        /*
        if (c.visibleStatus == true){
          this.exportList.push(v.condition);
        }
*/
        console.log(document.getElementById(c));
      }
      //this.viewConditionList = this.doctorService.assignVisible(this.conditions);

      var data = document.createElement('tr');
      var button = document.createElement('button');
      var tdata = document.createElement('td');
      var empty = document.createElement('td');
      button.setAttribute('class','btn btn-default');
      button.setAttribute('style','width:100%');
      button.innerHTML = '...';
      data.setAttribute('id', 'newtr'+this.collapseQueue[0]);
      tdata.setAttribute('id','newtd'+this.collapseQueue[0]);

      var parent = document.getElementById('test');

      parent.insertBefore(data, document.getElementById('t'+this.collapseQueue[0]));
      var parent2 = document.getElementById('newtr'+this.collapseQueue[0]);
      parent2.insertBefore(empty,parent2.firstChild);
      parent2.insertBefore(tdata,parent2.firstChild);
      parent2.insertBefore(empty,parent2.firstChild);
      parent2.insertBefore(empty,parent2.firstChild);

      var parent3 = document.getElementById('newtd'+this.collapseQueue[0]);
      parent3.insertBefore(button,parent3.firstChild);
      //this.viewConditionList.push("test");
      this.collapseQueue = [];
    }
}

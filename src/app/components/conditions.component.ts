import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { ConditionService } from '../services/condition.service';
import { LoupeService } from '../services/loupe.service';
import { CsiroService } from '../services/csiro.service';
import { DoctorService } from '../services/doctor.service';
import { ScratchPadService } from '../services/scratchPad.service';
import { UpdatingService } from '../services/updating.service';
import { Condition } from '../models/condition.model';
import { Patient } from '../models/patient.model';
import { Csiro } from '../models/csiro.model';
import * as moment from 'moment';


@Component({
  selector: 'conditions',
  templateUrl: '/conditions.html'
})
export class ConditionsComponent {

  selected: Condition;
  conditions: Array<Condition> = [];
  viewToggle: boolean = false;
  collapseQueue: Array<any> = [];
  conditionGrouping: Array<any> = [];
  conditionGroupingName: Array<any> = ["Active", "Inactive"];
  textInputForEdit: String;
  justCreated: boolean;
  @Input() patient: Patient;

  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  constructor(private fhirService: FhirService, private conditionService: ConditionService, private loupeService: LoupeService, private csiroService: CsiroService, private doctorService: DoctorService, private scratchPadService: ScratchPadService, private updatingService: UpdatingService) {
    console.log("ConditionsComponent created...");
    // this.gridItemConfiguration.draggable = this.doctorService.configMode;
    this.loupeService.activeCondition = this.selected;
    this.justCreated = true;
  }

  selectCondition(condition: Condition) {
    this.selected = condition;
    this.loupeService.activeCondition = this.selected;
    this.conditionSelected.emit(this.selected);
    for (let c of this.conditions) {
      c['selected'] = (c.id == this.selected.id);
    }
  }

  sortCondition(x: string) {
    if (x == "date-asc" || x == "date-desc") {
      var a = 1;
      if (x == "date-asc") {
        a = -a;
      }

      for (let c of this.conditionGrouping){
      c.sort((n1, n2) => {
        if (n1.code['coding'][0]['code'] > n2.code['coding'][0]['code']) {
          return a;
        }
        if (n1.code['coding'][0]['code'] < n2.code['coding'][0]['code']) {
          return -a;
        }
      })
    }
    }
    if (this.viewToggle == false) {
      this.conditions = this.doctorService.assignVisible(this.conditions);
    }
    else {
      for (let c of this.conditions) {
        c.isVisible = true;
      }
    }
    console.log("sort");
  }

  loadFinished() {
    this.conditions = this.conditions.reverse();
    console.log("Loaded " + this.conditions.length + " conditions.");
    this.loupeService.conditionArray = this.conditions;


    this.conditions.sort((n1, n2) => {
      if (n1.onsetDateTime < n2.onsetDateTime) {
        return 1;
      }
      if (n1.onsetDateTime > n2.onsetDateTime) {
        return -1;
      }
    })
    var diff = new Date().getTime() - new Date(this.conditions[0].onsetDateTime).getTime();

    for (let c of this.conditions) {
      c.isVisible = true;
      var newDate = new Date(c.onsetDateTime).getTime() + diff;
      c.relativeDateTime = new Date(newDate).toDateString();
      c.relativeDateTime = moment(newDate).toISOString();
    }
    if (this.viewToggle == false) {
      //this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
      this.conditions = this.doctorService.assignVisible(this.conditions);
    }
    this.conditionService.conditions = this.conditions;
    this.groupConditions();
  }

  loadData(url) {
    let isLast = false;
    this.conditionService.indexNext(url).subscribe(data => {
      if(data.entry) {
        let nextCon= <Array<Condition>>data.entry.map(r => r['resource']);

        this.conditions = this.conditions.concat(nextCon);
        isLast = true;
        for(let i of data.link) {
          if(i.relation=="next") {
            isLast = false;
            this.loadData(i.url);
          }
        }
        if(isLast) {
          this.loadFinished();
        }
      }
    });
  }

  ngOnChanges() {
    this.selected = null;
    if (this.patient) {
      this.conditionService.index(this.patient, true).subscribe(data => {
        if (data.entry) {


          let nextLink = null;
          this.conditions = <Array<Condition>>data.entry.map(r => r['resource']);
					for(let i of data.link) {
						if(i.relation=="next") {
							nextLink = i.url;
						}
					}
					if(nextLink) {this.loadData(nextLink);}
					else {this.loadFinished();}

        } else {
          this.conditions = new Array<Condition>();
          console.log("No conditions for patient.");
        }
      });
    }
  }

  testingCsiro() {
    this.csiroService.MapQuery().subscribe(data => {
      console.log("Hey CSIRO works");
      console.log(data);
    }, error => {
      console.log("oops");
    });
  }

  // Method for basic toggling, using JSON functions to toggle internal Angular2 module OnChanges for UI reactivity
  ellipsesToggle() {
    // Basic logic for toggle, assuming this.conditions contains all info, and this.viewConditionList is the modified list being used to display data
    if (this.viewToggle == false) {
      for (let c of this.conditions) {
        c.isVisible = true;
      }
      this.viewToggle = true;
    }
  }
  toggleExpansion() {

    if (this.viewToggle == true) {
      this.conditions = this.doctorService.assignVisible(this.conditions);
      this.viewToggle = false;
    }
  }

  scratchPadCheckBoxes(checked: boolean, value) {

    if (checked) {
      // this.conditions[value].isSelected = true;
      this.scratchPadService.toAddToCondSpArray.push(this.conditions[value]);
    }
    else {
      // this.conditions[value].isSelected = false;
      let temp = this.scratchPadService.toAddToCondSpArray.indexOf(this.conditions[value]);
      if (temp > -1){
        // This will actually delete instead of simply setting to null, which will throw errors in the long run
        this.scratchPadService.toAddToCondSpArray.splice(temp, 1);
      }
    }
  }

  autoCheck(rangeLow: number, rangeHigh: number) {
    for(var i = rangeLow; i < rangeHigh; i++){
      (<HTMLInputElement>document.getElementById('c' + i)).checked = true;
    }
    console.log('autochecked');
  }

  updateScratchPad(){
    //this.scratchPadService.buttonClicked(true);
  }

  expand(parent: string) {
    for (let c of this.conditions) {
      if (c.parent == parent) {
        c.isVisible = true;
        c.parent = "";
        c.isParent = false;
      }
    }
  }
  collapse() {
    let index = 0;
    let parent = "";
    for (let c of this.conditions) {
      if (c.isSelected == true) {
        if (index == 0) {
          c.isParent = true;
          parent = c.id;
        }
        else {
          c.isVisible = false;

        }
        c.parent = parent;
        index++;
      }
      c.isSelected = false;
    }

  }

  // Active v. Inactive
  groupConditions(){
    for (let c of this.conditions){
      if (c.clinicalStatus == "active"){
        if (!this.conditionGrouping[0]){
          this.conditionGrouping[0] = [c];
        }
        else{
          this.conditionGrouping[0].push(c);
        }
      }
      else{
        if (!this.conditionGrouping[1]){
          this.conditionGrouping[1] = [c];
        }
        else{
          this.conditionGrouping[1].push(c);
        }
      }
    }
    // this.conditionGrouping[1] = this.conditionGrouping[0];
  }

  tableNavigation(clickedSet: number){
    for (let c of this.conditionGrouping){
      let cNum = this.conditionGrouping.indexOf(c);
      if (cNum != clickedSet){
        let tempTableVar = document.getElementById("cG" + cNum.toString());
        tempTableVar.hidden = true;
      }
      else{
        let tempTableVar = document.getElementById("cG" + cNum.toString());
        tempTableVar.hidden = false;
      }
    }
  }

  //Hides inactive conditions on construction
  hideInactive(){
    if (this.justCreated) {
       document.getElementById("cG1").hidden = true;
       console.log("inactive conditions hidden")
     }
    this.justCreated = false;
  }

  newTable(tableName: string, dataLocation: Array<any>, quality: string, groupingCount: number){
    if(this.conditionGroupingName.indexOf(tableName) == -1){
      this.conditionGroupingName.push(tableName);
      for (let c of this.conditions){
        // Right now this will only allow for a table with one quality!
        var fullPath = c;
        dataLocation.forEach(element => {
          try{
            fullPath = c[element];
          }
          catch(error){
            console.log('That field does not exist on this Condition' + c);
          }
        });
        // Testing condition and adding if it's true
        if (quality){
          console.log(fullPath);
          if (!this.conditionGrouping[groupingCount]){
            this.conditionGrouping[groupingCount] = [c];
          }
          else{
            this.conditionGrouping[groupingCount].push(c);

          }
        }
      }
    }
    else{
      console.log("This table already exists");
    }
  }

  updateEntry(index: number, dataLocation: string){
    let conditionToUpdate = this.conditionService.conditions[index];
    console.log(this.textInputForEdit);
    this.updatingService.updateEntry(conditionToUpdate, this.textInputForEdit, dataLocation, index);
    this.conditions[index] = this.conditionService.conditions[index];
    console.log(this.conditions[index]);
  }

}

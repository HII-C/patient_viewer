import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';

// import { NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent } from 'angular2-grid';

// import { DraggableWidget } from './draggable_widget.component';

import { FhirService } from '../services/fhir.service';
import { ConditionService } from '../services/condition.service';
import { LoupeService } from '../services/loupe.service';
import { CsiroService } from '../services/csiro.service';
import { DoctorService } from '../services/doctor.service';
import { Condition } from '../models/condition.model';
import { Patient } from '../models/patient.model';
import { Csiro } from '../models/csiro.model';

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
  @Input() patient: Patient;

  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  // For options: https://github.com/BTMorton/angular2-grid
  // gridItemConfiguration: NgGridItemConfig = {
  //   'col': 1,               //  The start column for the item
  //   'row': 1,               //  The start row for the item
  //   'sizex': 30,             //  The start width in terms of columns for the item
  //   'sizey': 50,             //  The start height in terms of rows for the item
  //   'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
  //   'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
  //   //    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
  //   'borderSize': 15,
  //   'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
  //   'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
  //   'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
  //   'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
  //   'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
  //   'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
  //   'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
  //   'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
  //   'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
  //   'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
  // }
  constructor(private fhirService: FhirService, private conditionService: ConditionService, private loupeService: LoupeService, private csiroService: CsiroService, private doctorService: DoctorService) {
    console.log("ConditionsComponent created...");
    // this.gridItemConfiguration.draggable = this.doctorService.configMode;
    this.loupeService.activeCondition = this.selected;
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
      this.conditions.sort((n1, n2) => {
        if (n1.code['coding'][0]['code'] > n2.code['coding'][0]['code']) {
          return a;
        }
        if (n1.code['coding'][0]['code'] < n2.code['coding'][0]['code']) {
          return -a;
        }
      })
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

  ngOnChanges() {
    this.selected = null;
    if (this.patient) {
      this.conditionService.index(this.patient, true).subscribe(data => {
        if (data.entry) {

          this.conditions = <Array<Condition>>data.entry.map(r => r['resource']);
          console.log(this.conditions[0]);
          this.conditions = this.conditions.reverse();
          console.log("Loaded " + this.conditions.length + " conditions.");
          this.loupeService.conditionArray = this.conditions;
          for (let c of this.conditions) {
            c.isVisible = true;
          }
          if (this.viewToggle == false) {
            //this.viewConditionList = JSON.parse(JSON.stringify(this.conditions));
            this.conditions = this.doctorService.assignVisible(this.conditions);
          }
          this.groupConditions();

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

  addCollapse(checked: boolean, value) {
    if (checked) {
      this.conditions[value].isSelected = true;
    }
    else {
      this.conditions[value].isSelected = false;

    }

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
  groupConditions(){
    for (let c of this.conditions){
      if (c.clinicalStatus == "active"){
        if (!this.conditionGrouping[0]){
          this.conditionGrouping[0] = [c];
        }
        else{
          console.log("question???");
          this.conditionGrouping[0].push(c);
          console.log('This condition is active');
        }
      }
      else{
        if (!this.conditionGrouping[1]){
          this.conditionGrouping[1] = [c];
          console.log(this.conditionGrouping);
          console.log("there");
        }
        else{
          console.log("here");
          console.log(c);
          this.conditionGrouping[1].push(c);
        }
      }
    }
    // this.conditionGrouping[1] = this.conditionGrouping[0];
    console.log(this.conditionGrouping);
  }

}

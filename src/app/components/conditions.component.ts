import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { ConditionService } from '../services/condition.service';
import { DoctorService } from '../services/doctor.service';
import { ScratchPadService } from '../services/scratchPad.service';
import { UpdatingService } from '../services/updating.service';
import { Condition } from '../models/condition.model';
import { Patient } from '../models/patient.model';
import { Column } from '../interfaces/column.interface';
import * as moment from 'moment';

declare var $: any; //Necessary in order to use jQuery to open popup.

@Component({
  selector: 'conditions',
  templateUrl: '/conditions.html'
})
export class ConditionsComponent implements Column {
  // The state of the conditions list (ie, default or scratch pad)
  columnState: string = "default";

  // The currently selected condition in the list.
  selected: Condition;

  // The list of conditions being displayed.
  conditions: Array<Condition> = [];

  // Keep track of conditions that are currently checked in the list.
  checkedMap: Map<Condition, boolean> = new Map();

  // for the dynamic form
  formData: Array<any> = [];
  modalToggle: boolean = false;
  patientId: string = "";

  viewToggle: boolean = false;
  collapseQueue: Array<any> = [];
  conditionGrouping: Array<any> = [];
  conditionGroupingName: Array<any> = ["Active", "Inactive"];
  textInputForEdit: String;
  justCreated: boolean;
  @Input() patient: Patient;

  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  constructor(private fhirService: FhirService, private conditionService: ConditionService, private doctorService: DoctorService, private scratchPadService: ScratchPadService, private updatingService: UpdatingService) {
    // this.gridItemConfiguration.draggable = this.doctorService.configMode;
    this.justCreated = true;
  }

  // Default implementations of Column interface methods.
  showDefault() { }
  showScratchPad() { }
  showNotePad() { }

  getScratchPadConditions() {
    return this.scratchPadService.getConditions();
  }

  selectCondition(condition: Condition) {
    this.selected = condition;
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

      for (let c of this.conditionGrouping) {
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
  }

  loadFinished() {
    this.conditions = this.conditions.reverse();

    console.log("Loaded " + this.conditions.length + " conditions.");

    this.conditions.sort((n1, n2) => {
      if (n1.onsetDateTime < n2.onsetDateTime) {
        return 1;
      }
      if (n1.onsetDateTime > n2.onsetDateTime) {
        return -1;
      }
    });

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
  }

  ngOnChanges() {
    this.selected = null;

    if (this.patient) {
      this.conditionService.loadConditions(this.patient, true).subscribe(conditions => {
        this.conditions = conditions;
        this.loadFinished();
      });
    }
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

  checkCondition(checked: boolean, checkedCondition: Condition) {
    this.checkedMap.set(checkedCondition, checked);
  }

  addConditionsToScratchPad() {
    for (let c of this.conditions) {
      if (this.checkedMap.get(c)) {
        this.scratchPadService.addCondition(c);
      }
    }
  }

  removeConditionsFromScratchPad() {
    for (let c of this.conditions) {
      if (this.checkedMap.get(c)) {
        this.scratchPadService.removeCondition(c);
        this.checkedMap.set(c, false);
      }
    }
  }

  showPopover(condition: Condition) {
    var popover = document.getElementById("condition-popover");
    popover.style.display = "block";
    popover.innerHTML = condition['code']['text'];
  }

  movePopover(event: MouseEvent) {
    var columnOffset = document.getElementById("conditions").getBoundingClientRect();
    var popover = document.getElementById("condition-popover");

    popover.style.left = (event.x - columnOffset.left + 5) + "px";
    popover.style.top = (event.y - columnOffset.top + 5) + "px";
  }

  hidePopover() {
    document.getElementById("condition-popover").style.display = "none";
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

  getActiveConditions() {
    return this.conditions.filter(
      c => c.clinicalStatus == "active"
    );
  }

  getInactiveConditions() {
    return this.conditions.filter(
      c => c.clinicalStatus != "active"
    );
  }

  newTable(tableName: string, dataLocation: Array<any>, quality: string, groupingCount: number) {
    if (this.conditionGroupingName.indexOf(tableName) == -1) {
      this.conditionGroupingName.push(tableName);
      for (let c of this.conditions) {
        // Right now this will only allow for a table with one quality!
        var fullPath = c;
        dataLocation.forEach(element => {
          try {
            fullPath = c[element];
          }
          catch (error) {
            console.log('That field does not exist on this Condition' + c);
          }
        });
        // Testing condition and adding if it's true
        if (quality) {
          console.log(fullPath);
          if (!this.conditionGrouping[groupingCount]) {
            this.conditionGrouping[groupingCount] = [c];
          }
          else {
            this.conditionGrouping[groupingCount].push(c);

          }
        }
      }
    }
    else {
      console.log("This table already exists");
    }
  }


  // event handler for update button (pops up with update module)
  updateSelectedConditions() {

    this.patientId = this.conditions[0].subject.reference;


    // parse the selected conditions into the correct format for form
    var formObj = [];

    for (var i = 0; i < this.scratchPadConditions.length; i++) {
      var newObj = { type: 's-update', id: this.scratchPadConditions[i].id, data: { name: this.scratchPadConditions[i].code.text, status: this.scratchPadConditions[i].clinicalStatus } };
      formObj.push(newObj);
    }

    this.formData = formObj;

    // then set the form on page visible
    this.modalToggle = !this.modalToggle;
  }

  closeModal(): void {
    this.modalToggle = false;
  }

  // callback for when the submit button in the form is clicked
  formSubmit(inData: any) {
    this.modalToggle = !this.modalToggle;

    // update the conditions with the new updated data (naive bad implementation)
    for (var i = 0; i < this.conditions.length; i++) {
      for (var j = 0; j < inData.data.length; j++) {
        if (this.conditions[i].id == inData.data[j].id) {
          var updDescription = inData.data[j].data.description;
          var updStatus = inData.data[j].data.status

          if (updDescription != null)
            this.conditions[i].code.text = updDescription;

          if (updStatus != null)
            this.conditions[i].clinicalStatus = updStatus;

          break;
        }
      }
    }

    for (var i = 0; i < this.scratchPadConditions.length; i++) {
      for (var j = 0; j < inData.data.length; j++) {
        if (this.scratchPadConditions[i].id == inData.data[j].id) {
          var updDescription = inData.data[j].data.description;
          var updStatus = inData.data[j].data.status

          if (updDescription != null)
            this.scratchPadConditions[i].code.text = updDescription;

          if (updStatus != null)
            this.scratchPadConditions[i].clinicalStatus = updStatus;

          break;
        }
      }
    }
  }

  updateEntry(index: number, dataLocation: string) {
    let conditionToUpdate = this.conditionService.conditions[index];
    console.log(this.textInputForEdit);
    this.updatingService.updateEntry(conditionToUpdate, this.textInputForEdit, dataLocation, index);
    this.conditions[index] = this.conditionService.conditions[index];
    console.log(this.conditions[index]);
  }
}

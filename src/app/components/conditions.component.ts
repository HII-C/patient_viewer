/*
  DESCRIPTION: TOP LEVEL OF THE CONDITIONS COLUMN: DOES NOT HANDLE (ANY) RENDERING; SIMPLY FOR RETRIEVING 
  DATA FROM THE SERVER, WHICH IS PASSED DOWN

  Author: Steven Tran and Kaan Aksoy
  Version: 1.2 (3/19/18)
*/

import { Component, Input, Output, EventEmitter, Pipe, ViewChild } from '@angular/core';

import { FhirService } from '../services/fhir.service';
import { ConditionService } from '../services/condition.service';
import { DoctorService } from '../services/doctor.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Condition } from '../models/condition.model';
import { Patient } from '../models/patient.model';
import { BaseColumn } from './baseColumn';

import { ContextMenuComponent } from './contextMenu.component';

import * as moment from 'moment';
declare var $: any; //Necessary in order to use jQuery to open popup.

@Component({
  selector: 'conditions',
  templateUrl: '/conditions.html'
})
export class ConditionsComponent extends BaseColumn {
  // The currently selected condition in the list.
  selected: Condition;

  // The list of conditions being displayed.
  conditions: Array<Condition> = [];
  scratchPadConditions: any = [];

  // for checking whenever the page is loaded
  loaded: boolean = false;

  viewToggle: boolean = false;
  conditionGrouping: Array<any> = [];
  justCreated: boolean;

  @Input() patient: Patient;
  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  // ===============================================================================================================================================
  // ================================================================== EVENT METHODS ==============================================================
  // ==================================================================---------------==============================================================

  constructor(private fhirService: FhirService, private conditionService: ConditionService, private doctorService: DoctorService, private scratchPadService: ScratchPadService) {
    super();
    this.justCreated = true;
    this.scratchPadConditions = this.getScratchPadConditions();

    //testing allergies
  }

  ngOnChanges() {
    // Triggered if a new patient is selected (not even implemented yet).
    this.selected = null;
    // Clear the old conditions.
    this.conditions = [];

    if (this.patient) {
      this.conditionService.loadConditions(this.patient).subscribe(conditions => {
        this.conditions = this.conditions.concat(conditions);
        this.loadFinished();
      });
    }

    //Task: Display text in header
    if (this.patient) {
      this.conditionService.loadAllergies(this.patient, true).subscribe(allergies => {
        for (let e of allergies.entry) {
          console.log(e.resource.code.text);
        }
      });
    }

  }

  // Called when all conditions have been loaded.
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
      this.conditions = this.doctorService.assignVisible(this.conditions);
    }

    this.conditionService.conditions = this.conditions;

    // for rendering elements only after page is loaded (there probably is a better way)
    this.loaded = true;

    // initialize the scratchPadService totalConditions with all the shit
    this.scratchPadService.initConditions(this.conditions);

  }

  // ===============================================================================================================================================
  // ======================================================== GETTERS AND SETTERS===================================================================
  // ===============================================================================================================================================

  // retrieves the selected conditions from the scratch pad
  getScratchPadConditions() {
    return this.scratchPadService.getConditions();
  }
}
/*
  DESCRIPTION: TOP LEVEL OF THE CONDITIONS COLUMN: DOES NOT HANDLE (ANY) RENDERING; SIMPLY FOR RETRIEVING
  DATA FROM THE SERVER, WHICH IS PASSED DOWN

  Author: Steven Tran and Kaan Aksoy
  Version: 1.2 (3/19/18)
*/

import { Component, Input, Output, EventEmitter, Pipe, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FhirService } from 'app/services/fhir.service';
import { ConditionService } from 'app/services/condition.service';
import { DoctorService } from 'app/services/doctor.service';
import { ScratchPadService } from 'app/services/scratchPad.service';

import { Condition } from 'app/models/condition.model';
import { Patient } from 'app/models/patient.model';
import { BaseColumn } from 'app/components/baseColumn';

import * as moment from 'moment';
declare var $: any; //Necessary in order to use jQuery to open popup.

@Component({
  selector: 'conditions',
  templateUrl: './conditions.html'
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

  // for column switching
  subscription: Subscription;

  @Input() patient: Patient;
  @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

  // ===============================================================================================================================================
  // ================================================================== EVENT METHODS ==============================================================
  // ==================================================================---------------==============================================================

  constructor(
    private fhirService: FhirService,
    private conditionService: ConditionService,
    private doctorService: DoctorService,
    private scratchPadService: ScratchPadService
  ) {
    super();
    this.justCreated = true;
    this.scratchPadConditions = this.getScratchPadConditions();

    this.subscription = scratchPadService.stateChange$.subscribe(
      sPad => {
        if (sPad)
          this.columnState = "scratchpad";
        else
          this.columnState = "default";
      }
    );
  }

  ngOnChanges() {
    // Triggered if a new patient is selected (not even implemented yet).
    this.selected = null;
    this.conditions = [];

    if (this.patient) {
      this.conditionService.loadConditions(this.patient).subscribe(conditions => {
        this.conditions = this.conditions.concat(conditions);
        this.onLoadComplete();
      });
    }
  }

  // Called when all conditions have been loaded.
  onLoadComplete() {
    console.log("Loaded " + this.conditions.length + " conditions.");

    this.conditions.sort((c1, c2) => {
      return c2.onsetDateTime.localeCompare(c1.onsetDateTime);
    });

    // Scale dates to make them appear more recent for demos.
    // 0.8 is an arbitrary value that produces realistic dates.
    if (this.conditions.length > 0) {
      let RECENCY_MULTIPLIER = 0.8;
      let timeSinceConditionOnset = new Date().getTime() - new Date(this.conditions[0].onsetDateTime).getTime();
      let scaledTimeSinceConditionOnset = Math.floor(RECENCY_MULTIPLIER * timeSinceConditionOnset);

      for (let condition of this.conditions) {
        condition.isVisible = true;
        let relativeDateTime = new Date(condition.onsetDateTime).getTime() + scaledTimeSinceConditionOnset;
        condition.relativeDateTime = moment(relativeDateTime).toISOString();
      }
    }

    if (!this.viewToggle) {
      this.conditions = this.doctorService.assignVisible(this.conditions);
    }

    this.conditionService.conditions = this.conditions;

    // for rendering elements only after page is loaded (there probably is a better way)
    this.loaded = true;

    // initialize the scratchPadService totalConditions with all the stuff
    this.scratchPadService.initConditions(this.conditions);
  }

  // Update the service to store correct column state
  updateService(): void {
    this.conditionService.setColumnState(this.columnState);
  }

  // ===============================================================================================================================================
  // ======================================================== GETTERS AND SETTERS===================================================================
  // ===============================================================================================================================================

  // retrieves the selected conditions from the scratch pad
  getScratchPadConditions() {
    return this.scratchPadService.getConditions();
  }
}

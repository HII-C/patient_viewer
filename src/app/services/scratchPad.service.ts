import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
 
// MODELS
import { Condition } from '../models/condition.model';
import { CarePlan } from '../models/carePlan.model';
import { Observation } from '../models/observation.model';

// SERVICES

@Injectable()
@Component({})
export class ScratchPadService {
  // Old fields that will likely be removed:
  toAddToCondSpArray: Array<Condition> = [];
  dataToAdd: Array<any> = [];
  private addNewDataSource = new Subject<string>();
  addNewData$ = this.addNewDataSource.asObservable();

  // Data fields for the three columns:
  // total* is the entire list of data loaded from the server
  // the conditions/observations/findings are the data that is selected
  totalConditions: Array<Condition>;
  totalObservations: Array<Observation>;
  totalCareplans: Array<CarePlan>;

  conditions: Array<Condition> = [];
  observations: Array<Observation> = [];
  careplans: Array<CarePlan> = [];

   // cond/obs/find that are checked (but not yet added potentially) - need it to save state
  checkedMapObservations: Map<Observation, boolean> = new Map();
  checkedMapConditions: Map<Condition, boolean> = new Map();
  checkedMapCareplans: Map<CarePlan, boolean> = new Map();

  // SCRATCH PAD STATE (COLUMN)
  stateSource = new Subject<boolean>();
  stateChange$ = this.stateSource.asObservable();

  constructor() { 

  }
  
  // =====================================================================
  // --------------- FOR CHANGING TO SCRATCH PAD STATE -------------------
  // =====================================================================

  // switch to scratch pad
  switchToScratchPad(switchState: boolean){
    this.stateSource.next(switchState);
  }

  // ======================================================================
  // ========================== METHODS FOR CONDITIONS ====================
  // ======================================================================

  // initialize the totalConditions
  initConditions(inConditions: Array<Condition>){
    this.totalConditions = inConditions;
  }

  // Keep track of conditions that are currently checked in the list (conditions)

  checkCondition(checked: boolean, checkedCondition: Condition) {
    this.checkedMapConditions.set(checkedCondition, checked);
  }

  // removes the marked scratch pad elements to the actual scratch pad
  removeConditionsFromScratchPad() {
    for (let c of this.totalConditions) {
      if (this.checkedMapConditions.get(c)) {
        this.removeCondition(c);
        this.checkedMapConditions.set(c, false);
      }
    }
  }

  // adds the marked scratch pad elements to the actual scratch pad
  addConditionsToScratchPad() {
    for (let c of this.totalConditions) {
      if (this.checkedMapConditions.get(c)) {
        this.addCondition(c);
      }
    }
  }

  // =================== FOR ADDING SELECTED DATA TO SCRATCH PAD ========

  // Add a condition to the scratch pad, and disallow duplicates.
  addCondition(condition: Condition) {
    
    if (this.conditions.indexOf(condition) == -1) {
      this.conditions.push(condition);
    }
  }

  // Remove a given condition from the scratch pad.
  removeCondition(condition: Condition) {
    var index = this.conditions.indexOf(condition);

    if (index != -1) {
      this.conditions.splice(index, 1);
    }
  }

  // Return the conditions currently in the scratch pad.
  getConditions() {
    return this.conditions;
  }

  // ================================================================================  
  // ======================== METHODS FOR STORING CARE PLANS ========================
  // ================================================================================

  // initialize total list of care plans
  initCarePlans(inCarePlans: Array<CarePlan>){
    this.totalCareplans = inCarePlans;
  }

  // whenever a list item is checked (or unchecked), then mark it on the map
  checkCarePlan(checked: boolean, checkedCarePlan: CarePlan) {
    this.checkedMapCareplans.set(checkedCarePlan, checked);
  }

  // removes all checked items from the scratch pad
  removeCarePlanFromScratchPad() {
    for (let o of this.totalCareplans) {
      if (this.checkedMapCareplans.get(o)){
        this.removeCarePlan(o);
        this.checkedMapCareplans.set(o, false);
      }
    }
  }

  // add all checekd items to the scratch pad
  addCareplanToScratchPad() {
    for (let o of this.totalCareplans){
      if (this.checkedMapCareplans.get(o)){
        this.addCarePlan(o);
      }
    }
  }

  // Add a (single) care plan to the scratch pad, and disallow duplicates.
  addCarePlan(carePlan: CarePlan) {
    if (this.careplans.indexOf(carePlan) == -1) {
      this.careplans.push(carePlan);
    }
  }

  // Remove a (single) given care plan from the scratch pad.
  removeCarePlan(carePlan: CarePlan) {
    var index = this.careplans.indexOf(carePlan);

    if (index != -1) {
      this.careplans.splice(index, 1);
    }
  }

  // Return the care plan currently in the scratch pad.
  getCarePlans() {
    return this.careplans;
  }

  // ================================================================================
  // ======================== METHODS FOR STORING OBSERVATIONS ======================
  // ================================================================================
 
  // initialize total list of observations
  initObservations(inObservations: Array<Observation>){
    this.totalObservations = inObservations;
  }

  // whenever a list item is checked (or unchecked), then mark it on the map
  checkObservation(checked: boolean, checkedObservation: Observation) {
    this.checkedMapObservations.set(checkedObservation, checked);
  }

  // removes all checked items from the scratch pad
  removeObservationsFromScratchPad() {
    for (let o of this.totalObservations) {
      if (this.checkedMapObservations.get(o)){
        this.removeObservation(o);
        this.checkedMapObservations.set(o, false);
      }
    }
  }

  // add all checekd items to the scratch pad
  addObservationToScratchPad() {
    for (let o of this.totalObservations){
      if (this.checkedMapObservations.get(o)){
        this.addObservation(o);
      }
    }
  }

  // Add a (single) observation to the scratch pad, and disallow duplicates.
  addObservation(observation: Observation) {
    if (this.observations.indexOf(observation) == -1) {
      this.observations.push(observation);
    }
  }

  // Remove a (single) given obseration from the scratch pad.
  removeObservation(observation: Observation) {
    var index = this.observations.indexOf(observation);

    if (index != -1) {
      this.observations.splice(index, 1);
    }
  }

  // Return the observations currently in the scratch pad.
  getObservations() {
    return this.observations;
  }

  // ============================== OTHER METHODS ===============================

  // Old method likely to be removed.
  /*
  addData(location: string) {
    switch (location) {
      case "observation":
        console.log("observation");
        this.dataToAdd = this.observationService.selected;
        this.addNewDataSource.next(location);
        break;
      default:
        console.log("error");
    }
    //this.updatedCondSP.next(clicked);
  }
  */
}

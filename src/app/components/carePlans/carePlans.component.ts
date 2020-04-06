import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { FhirService } from '../../services/fhir.service';
import { CarePlanService } from '../../services/carePlan.service';
import { ScratchPadService } from '../../services/scratchPad.service';

import { CarePlan } from '../../models/carePlan.model';
import { Patient } from '../../models/patient.model';
import { BaseColumn } from '../baseColumn';

/**
 * Component representing the list of a patient's 
 * care plans. It is a part of the triple list 
 * view.
 */
@Component({
  selector: 'carePlans',
  templateUrl: './carePlans.html'
})
export class CarePlansComponent extends BaseColumn {
  /** The care plan currently selected by the user. */
  selected: CarePlan;
  
  /** The care plans being displayed in the list. */
  carePlans: Array<CarePlan>;
  
  /** Whether or not care plans have loaded yet. */
  carePlanLoadFinished: boolean = false;

  /** 
   * Subscription that detects when the user opens 
   * the scratch pad (eg, from the toolbar).
  */
  columnStateSubscription: Subscription;

  /** The patient whose care plans are displayed. */
  @Input() patient: Patient;

  constructor(
    private fhirService: FhirService, 
    private carePlanService: CarePlanService, 
    private scratchPadService: ScratchPadService
  ) {
    super();

    // Switch between scratch pad and default based on user's
    // selection in the toolbar.
    this.columnStateSubscription = scratchPadService.stateChange$.subscribe(
      sPad => {
        this.columnState = sPad ? 'scratchpad' : 'default';
      }
    );
  }

  /** Reload care plans when the patient is changed. */
  ngOnChanges() {
    this.selected = null;
    if (this.patient) {
      this.carePlanService.loadCarePlans(this.patient).subscribe(carePlans => {
        this.carePlans = carePlans;
        this.carePlanLoadFinished = true;
        console.log("Loaded " + carePlans.length + " care plans.");
      });
    }
  }

  /**
   * Get care plans currently in the scratch pad for display 
   * in the list.
   */
  getScratchPadCarePlans() {
    return this.scratchPadService.getCarePlans();
  }
}

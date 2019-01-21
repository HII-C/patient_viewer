import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FhirService } from '../services/fhir.service';
import { CarePlanService } from '../services/carePlan.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { CarePlan } from '../models/carePlan.model';
import { Patient } from '../models/patient.model';
import { BaseColumn } from './baseColumn';

@Component({
  selector: 'carePlan',
  templateUrl: '/carePlan.html'
})
export class CarePlanComponent extends BaseColumn {

  selected: CarePlan;
  carePlans: Array<CarePlan>;
  
  // check for load finished
  carePlanLoadFinished: boolean = false;

  // for column switching
  subscription: Subscription;

  @Input() patient: Patient;

  constructor(private fhirService: FhirService, private carePlanService: CarePlanService, private scratchPadService: ScratchPadService) {
    super();

    // subscribe to scratch pad service for column switching
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
    this.selected = null;

    if (this.patient) {
      this.carePlanService.getCarePlans(this.patient).subscribe(carePlans => {
        this.carePlans = carePlans;
        this.carePlanLoadFinished = true;
        console.log("Loaded " + carePlans.length + " care plans.");
      });
    }
  }

  // get the scratch pad stuff for care plans
  getScratchPadCarePlans() {
    return this.scratchPadService.getCarePlans();
  }
}

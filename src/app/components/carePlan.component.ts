import { Component, Input } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { CarePlanService } from '../services/carePlan.service';
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
  @Input() patient: Patient;

  constructor(private fhirService: FhirService, private carePlanService: CarePlanService) {
    super();
  }

  getScratchPadCount() {
    return 0;
  }

  onClick(event) {
    event.preventDefault();
    console.log("Clicked!");
  }

  ngOnChanges() {
    this.selected = null;
    if (this.patient) {
      this.carePlanService.index(this.patient, true).subscribe(data => {
        if (data.entry) {
          this.carePlans = <Array<CarePlan>>data.entry.map(r => r['resource']);
          console.log(this.carePlans[0]);
          this.carePlans = this.carePlans.reverse();
          console.log("Loaded " + this.carePlans.length + " carePlans.");
        }
        else {
          this.carePlans = new Array<CarePlan>();
          console.log("No carePlans for patient.");
        }
      });
    }
  }
}

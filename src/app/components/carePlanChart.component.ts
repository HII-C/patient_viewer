import { Component, Input } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { CarePlanService } from '../services/carePlan.service';
import { CarePlan } from '../models/carePlan.model';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'carePlanChart',
  templateUrl: '/carePlanChart.html'
})
export class CarePlanChartComponent {
  selected: CarePlan;
  carePlans: Array<CarePlan>;
  @Input() patient: Patient;

  constructor(private fhirService: FhirService, private carePlanService: CarePlanService) { }

  ngOnChanges() {
    this.selected = null;

    if (this.patient) {
      this.carePlanService.getCarePlans(this.patient).subscribe(carePlans => {
        this.carePlans = carePlans;
        console.log("Loaded " + carePlans.length + " care plans.");
      });
    }
  }
}
import { Component, Input } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { CarePlanService } from '../services/carePlan.service';
import { CarePlan } from '../models/carePlan.model';
import { Patient } from '../models/patient.model';
import { HistoricalTrendsService } from '../services/historicalTrends.service';

@Component({
  selector: 'carePlanChart',
  templateUrl: '/carePlanChart.html'
})
export class CarePlanChartComponent {
  carePlans: Array<CarePlan>;
  @Input() patient: Patient;

  constructor(
    private fhirService: FhirService,
    private carePlanService: CarePlanService,
    private historicalTrendsService: HistoricalTrendsService
  ) { }

  ngOnChanges() {
    if (this.patient) {
      this.carePlanService.loadCarePlans(this.patient).subscribe(carePlans => {
        this.carePlans = carePlans;
        console.log("Loaded " + carePlans.length + " care plans.");
      });
    }
  }

  check(carePlan: CarePlan, event: any) {
    // Check whether care plan was checked or unchecked.
    if (event.target.checked) {
      this.historicalTrendsService.addMedicationChart(carePlan.title, carePlan);
    } else {
      this.historicalTrendsService.removeChart(carePlan.title);
    }
  }
}
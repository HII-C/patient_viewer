import { Component, ViewChild, Input} from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';
import { ContextMenuComponent } from './contextMenu.component';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { pairs } from 'rxjs/observable/pairs';
import { CarePlanService } from '../services/carePlan.service';
import { CarePlan } from '../models/carePlan.model';
import { Medication } from '../models/medication.model';

@Component({
  selector: 'historicalTrends',
  templateUrl: '/historicalTrends.html'
})
export class HistoricalTrendsComponent {
  // Width and height of displayed charts.
  private chartSize: number[] = [800, 200];

  // The minimum and maximum dates for the x-axis of the displayed charts.
  private minDate: Date = null;
  private maxDate: Date = null;

  // Reference to the current patient.
  private patient: Patient;
  private carePlans: Array<CarePlan>;
  private medications: Array<Medication>;

  @ViewChild('menu') menu: ContextMenuComponent;

  // Observable subscription to mouse movements.
  mouseSubscription: any = null;

  // Store the most recent mouse event to keep track of the mouse location.
  mouseEvent: any = null;

  constructor(
    private trendsService: HistoricalTrendsService,
    private observationService: ObservationService,
    private patientService: PatientService,
    private carePlanService: CarePlanService
  ) {
      // Track the location of the mouse (needed for context menu).
      this.mouseSubscription = Observable.fromEvent(document, 'mousemove')
        .subscribe((event) => {
          this.mouseEvent = event;
      });

      this.patientService.loadPatient().subscribe(patient => {
        this.patient = patient;
      })

      // get all careplans for patient
      this.carePlanService.loadCarePlans(this.patient).subscribe(carePlans => {
        this.carePlans = this.carePlans.concat(carePlans);
        this.carePlans.forEach((carePlan) => {

        })

      });


      // for each careplan
        // get medications from patient
    }

  // Can only access view child after the view has been initialized.
  ngAfterViewInit() {
    // NOTE: 'exec' functions must be bound to 'this' to access scratchPadService.
    // This is a strange behavior with scoping in Typescript/Javascript.

    // Add option to the context menu shown when clicking data points.
    this.menu.addOption({
      'icon': 'glyphicon-list-alt',
      'text': 'Add to Side Bar',
      'exec': function(condition) {
        console.log("Add to Side Bar");
        // TODO: Implement Add to Side Bar functionality.
      }.bind(this)
    });
  }

  // Set specific (user selected) min and max dates for the x-axis of displayed charts.
  setDateRange(form) {
    // Do nothing if one of the dates is invalid.
    if (!moment(form.minDate).isValid() || !moment(form.maxDate).isValid()) {
      return;
    }

    this.minDate = new Date(form.minDate);
    this.maxDate = new Date(form.maxDate);
  }

  // Reset the min and max dates for the x-axis of displayed charts (so all data is shown).
  resetMinDate() {
    this.minDate = null;
    this.maxDate = null;
  }
  // Subtracts the given number of years from today's date, and sets the result
  // as the minimum date on the x-axis of displayed charts.
  setMinYearsAgo(years) {
    this.minDate = moment().subtract(years, 'years').toDate();
  }

  // Subtracts the given number of months from today's date, and sets the result
  // as the minimum date on the x-axis of displayed charts.
  setMinMonthsAgo(months) {
    this.minDate = moment().subtract(months, 'months').toDate();
  }

  // Called when a data point is clicked on a chart.
  onDataPointSelect(chartEvent) {
    this.menu.show(null, this.mouseEvent);
  }
}

import { Component, Input, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Patient } from '../models/patient.model';

import { DoctorService } from '../services/doctor.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';
import { ToolBarService } from '../services/toolbar.service';
import { ScratchPadService } from '../services/scratchPad.service';
import { ConditionService } from '../services/condition.service';
import { ObservationService} from '../services/observation.service';
import { AssociationService } from '../services/association.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.html'
  // animations: [
  // 	trigger('fadeIn', [
  // 		state('in', style({ opacity: '1' })),
  // 		transition('void => *', [
  // 			style({ opacity: '0' }),
  // 			animate('800ms ease-in')
  // 		])
  // 	])
  // ]
})
export class ToolbarComponent {
  @Input() patient: Patient;
  nav2: boolean = false;

  constructor(
    private associationService: AssociationService,
    private conditionService: ConditionService,
    private doctorService: DoctorService,
    private observationService: ObservationService,
    private scratchPadService: ScratchPadService,
    private toolbarService: ToolBarService,
    private trendsService: HistoricalTrendsService,
    private elRef: ElementRef
  ) { }

  switchNav() {
    this.nav2 = !this.nav2;
  }

  runAssociationsTool() {
    let checkedConditions = this.conditionService.getCheckedConditions();
    let checkedObservations = this.observationService.getCheckedObservations();
    this.associationService.runAssociationsTool(checkedConditions, checkedObservations);
  }

  // whenver the user presses the filter button
  filterScratchPad() {
    
    // Call the filtering method in the service
    this.scratchPadService.addConditionsToScratchPad();
    this.scratchPadService.addObservationToScratchPad();

    // also switch the views to the scratch pad view
    this.scratchPadService.switchToScratchPad(true);
  }

  // reset to default (not scratchPad)
  resetToDefaultView() {
    this.scratchPadService.switchToScratchPad(false);
  }

  updatePosition(ref: ElementRef) {
    let left = this.elRef.nativeElement.querySelector('div').style.left;
    let top = this.elRef.nativeElement.querySelector('div').style.top;

    this.toolbarService.leftPosition = (parseInt(left.replace(/px/, "")) + 150) + "px";
    this.toolbarService.topPosition = (parseInt(top.replace(/px/, "")) + 100) + "px";
  }
}

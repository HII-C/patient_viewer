import { Component, Input, ElementRef } from '@angular/core';

import { DoctorService } from '../../services/doctor.service';
import { ToolBarService } from '../../services/toolbar.service';
import { ScratchPadService } from '../../services/scratchPad.service';
import { ConditionService } from '../../services/condition.service';
import { ObservationService} from '../../services/observation.service';
import { AssociationService } from '../../services/association.service';

import { Patient } from '../../models/patient.model';

/** 
 * A component representing the toolbar at the top of 
 * the application.
 */
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.html'
})
export class ToolbarComponent {
  /** The patient currently displayed by the application. */
  @Input() patient: Patient;
  
  /** 
   * Tracks whether the toolbar is currently in its 1st or 2nd view. 
   */
  private nav2: boolean = false;

  constructor(
    private associationService: AssociationService,
    private conditionService: ConditionService,
    private doctorService: DoctorService,
    private observationService: ObservationService,
    private scratchPadService: ScratchPadService,
    private toolbarService: ToolBarService,
    private elRef: ElementRef
  ) { }
  
  /**
   * Switches between the 1st and 2nd views of the 
   * toolbar.
   */
  switchNav() {
    this.nav2 = !this.nav2;
  }

  /**
   * Run the associations tool.
   */
  runAssociationsTool() {
    let checkedConditions = this.conditionService.getCheckedConditions();
    let checkedObservations = this.observationService.getCheckedObservations();
    this.associationService.runAssociationsTool(checkedConditions, checkedObservations);
  }

  /**
   * Adds the currently selected conditions and observations to the 
   * scratch pad, and opens up the scratch pad view of the triple 
   * lists.
   */
  filterScratchPad() {
    // Call the filtering method in the service
    this.scratchPadService.addConditionsToScratchPad();
    this.scratchPadService.addObservationToScratchPad();

    // also switch the views to the scratch pad view
    this.scratchPadService.switchToScratchPad(true);
  }

  /**
   * Reset triple lists to their default view (not the scratch pad).
   */
  resetToDefaultView() {
    this.scratchPadService.switchToScratchPad(false);
  }
}

import { Component, Input } from '@angular/core';

import { ScratchPadService } from '../../services/scratchPad.service';
import { BaseColumn } from '../baseColumn';


 /**
  * Component for switching between the three states of each column.
  * The three possible states are: Default, Note Pad, and Scratch Pad.
  */
@Component({
  selector: 'columnStateSwitcher',
  templateUrl: './columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  @Input() column: BaseColumn;

  /**
   * The type of the column in which the switcher is used.
   * For example, 'conditions', 'observations', or 'careplans'.
   */
  @Input() columnType: string;

  constructor (private scratchPadService: ScratchPadService) { }

  /**
   * Switch to the default view of the column.
   */
  switchToDefault() {
    if (this.column != null) {
      this.column.columnState = 'default';
      this.column.updateService(); // Update the service to store correct column state
      this.column.showDefault();
    }
  }

  /**
   * Switch to the scratch pad view of the column.
   */
  switchToScratchPad() {
    if (this.column != null) {
      this.column.columnState = 'scratchpad';
      // Update the service to store correct column state
      this.column.updateService(); 
      this.column.showScratchPad();
    }
  }

  /**
   * Retrieve the number of items in the column's scratch pad. This 
   * number is displayed in the switcher component.
   */
  getScratchPadCount(): number {
    if (this.columnType == 'conditions') {
      return this.scratchPadService.conditions.length;
    } else if (this.columnType == 'observations') {
      return this.scratchPadService.observations.length;
    } else if (this.columnType == 'careplans') {
      // TODO: Implement once scratch pad is finished for careplans.
      return 0;
    }
    return 0;
  }
}

import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { ScratchPadService } from '../services/scratchPad.service';
import { BaseColumn } from './baseColumn';

/**
 * Allows for switching between the three states of each column.
 * The three possible states are: Default, Note Pad, and Scratch Pad.
 */
@Component({
  selector: 'columnStateSwitcher',
  templateUrl: './columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  @Input() column: BaseColumn;
  // The type of the column in which the switcher is used.
  // For example, 'conditions', 'observations', or 'careplans'.
  @Input() columnType: string;

  constructor (private scratchPadService: ScratchPadService) { }

  // Switch back to the default view of the column.
  switchToDefault() {
    if (this.column != null) {
      this.column.columnState = 'default';
      this.column.updateService(); // Update the service to store correct column state
      this.column.showDefault();
    }
  }

  // Switch to the scratch pad view of the column.
  switchToScratchPad() {
    if (this.column != null) {
      this.column.columnState = 'scratchpad';
      this.column.updateService(); // Update the service to store correct column state
      this.column.showScratchPad();
    }
  }

  // Return the number of elements in the scratch pad of the column.
  getScratchPadCount() {
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

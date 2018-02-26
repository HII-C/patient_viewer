import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { ScratchPadService } from '../services/scratchPad.service';
import { BaseColumn } from './baseColumn';

/**
 * Allows for switching between the three states of each column.
 * The three possible states are: Default, Note Pad, and Scratch Pad.
 */
@Component({
  selector: 'columnStateSwitcher',
  templateUrl: '/columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  @Input() column: BaseColumn;

  constructor (private scratchPadService: ScratchPadService) { }

  switchToDefault() {
    if (this.column != null) {
      this.column.columnState = "default";
      this.column.showDefault();
    }
  }

  switchToScratchPad() {
    if (this.column != null) {
      this.column.columnState = "scratchpad";
      this.column.showScratchPad();
    }
  }

  getScratchPadCount() {
    return this.scratchPadService.getConditions().length;
  }
}

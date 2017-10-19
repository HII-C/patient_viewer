import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { Column } from '../interfaces/column.interface';

/**
 * Allows for switching between the three states of each column.
 * The three possible states are: Default, Note Pad, and Scratch Pad.
 */
@Component({
  selector: 'columnStateSwitcher',
  templateUrl: '/columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  @Input() column: Column;

  constructor() {
    console.log("ColumnStateSwitcherComponent created...");
  }

  switchToDefault() {
    if (this.column != null) {
      this.column.showDefault();
    }
  }

  switchToScratchPad() {
    if (this.column != null) {
      this.column.showScratchPad();
    }
  }

  switchToNotePad() {
    if (this.column != null) {
      this.column.showNotePad();
    }
  }
}

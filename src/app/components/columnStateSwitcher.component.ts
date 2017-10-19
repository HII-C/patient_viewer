import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';

/**
 * Allows for switching between the three states of each column.
 * The three possible states are: Default, Note Pad, and Scratch Pad.
 */
@Component({
  selector: 'columnStateSwitcher',
  templateUrl: '/columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  @Output() default: EventEmitter<any> = new EventEmitter();
  @Output() scratchPad: EventEmitter<any> = new EventEmitter();
  @Output() notePad: EventEmitter<any> = new EventEmitter();

  constructor() {
    console.log("ColumnStateSwitcherComponent created...");
  }

  switchToDefault() {
    this.default.emit();
  }

  switchToScratchPad() {
    this.scratchPad.emit();
  }

  switchToNotePad() {
    this.notePad.emit();
  }
}

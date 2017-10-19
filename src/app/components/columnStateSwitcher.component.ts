import { Component, Input, Output, EventEmitter, Pipe } from '@angular/core';

@Component({
  selector: 'columnStateSwitcher',
  templateUrl: '/columnStateSwitcher.html'
})
export class ColumnStateSwitcherComponent {
  constructor() {
    console.log("ColumnStateSwitcherComponent created...");
  }
}

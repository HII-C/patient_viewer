import {Component} from '@angular/core';

@Component({
  selector: 'weightSection',
  template: `
    <input type="text" [(ngModel)]="enteredWeight" />
    Weight: {{ enteredWeight }}
  `
})

export class WeightNoteComponent{

}

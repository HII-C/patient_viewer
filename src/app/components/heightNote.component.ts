import {Component} from '@angular/core';

@Component({
  selector: 'heightSection',
  template: `
    <input type="text" [(ngModel)]="enteredHeight" />
    Height: {{ enteredHeight }}
  `
})

export class HeightNoteComponent{

}

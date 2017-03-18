import {Component} from '@angular/core';

@Component({
  selector: 'notesSection',
  template: `
    <input type="text" [(ngModel)]="enteredNotes" />
    Notes: {{ enteredNotes }}
  `
})

export class NotesComponent{

}

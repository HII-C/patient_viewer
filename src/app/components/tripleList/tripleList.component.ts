import { Component, Input } from '@angular/core';
import { Patient } from '../../models/patient.model';

/**
 * A component that displays the triple list of 
 * conditions, observations, and careplans. It provides 
 * the patient data to these individual lists.
 */
@Component({
  selector: 'triplelist',
  templateUrl: './tripleList.html'
})

export class TripleListComponent {
  /** The patient whose data will appear in the three lists. */
  @Input() patient: Patient;
  
  constructor() { }
}
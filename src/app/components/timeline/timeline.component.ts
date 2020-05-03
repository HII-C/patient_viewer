import { Component, Input, ViewChild } from '@angular/core';

import { EncounterService } from '../../services/encounter.service';

import { Encounter } from '../../models/encounter.model';
import { Patient } from '../../models/patient.model';
import { TimelinePopupComponent } from '../timeline_popup/timeline_popup.component';

@Component({
  selector: 'timelines',
  templateUrl: './timeline.html'
})
export class TimelineComponent {
  encounters: Array<Encounter> = [];
  @Input() patient: Patient;
  @ViewChild('popup', { static: false }) popup: TimelinePopupComponent;

  constructor(private encounterService: EncounterService) { }

  ngOnChanges(): void {
    this.loadEncounters();
  }

  private loadEncounters(): void {
    if (this.patient) {
      this.encounterService.loadEncounters(this.patient).subscribe(encounters => {
        this.encounters = this.encounters.concat(encounters);
        console.log('Loaded ' + this.encounters.length + ' encounters.');
        console.log(this.encounters);

        encounters.forEach(enc => enc.position = enc.getLogValue()/5 + "%")
        encounters.forEach(enc =>  console.log('Log Val pos: ' + enc.getStartDate()))
        
      });
    }
  }
}

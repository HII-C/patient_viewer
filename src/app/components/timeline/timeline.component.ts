import { Component, Input } from '@angular/core';

import { EncounterService } from '../../services/encounter.service';

import { Encounter } from '../../models/encounter.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'timelines',
  templateUrl: './timeline.html'
})
export class TimelineComponent {
  encounters: Array<Encounter> = [];
  @Input() patient: Patient;

  constructor(private encounterService: EncounterService) { }

  ngOnChanges(): void {
    this.loadEncounters();
  }

  private loadEncounters(): void {
    console.log('patient1',this.patient);
    if (this.patient) {
      this.encounterService.loadEncounters(this.patient).subscribe(encounters => {
        this.encounters = this.encounters.concat(encounters);
        // console.log('Loaded ' + this.encounters.length + ' encounters.');
        // console.log(this.encounters);

        // encounters.forEach(enc => enc.position = enc.getLogValue()/5 + "%")
        // encounters.forEach(enc =>  console.log('Log Val pos: ' + enc.getStartDate()))
        
      });
    }
  }
  private onScrollClick(): void{
    console.log('patient2',this.patient);

         console.log("e isz : ",this.encounters[1]);
  }
}

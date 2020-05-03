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
  startIndex = 0;
  endIndex = 10;
  encountersLength: any;
  @Input() patient: Patient;
  @ViewChild('popup', { static: false }) popup: TimelinePopupComponent;

  constructor(private encounterService: EncounterService) { }
  

  ngOnChanges(): void {
    this.loadEncounters();
  }
  ngAfterViewInit(): void{
    this.sortByDate();

  }

  private loadEncounters(): void {
    console.log('patient1',this.patient);
    if (this.patient) {
      this.encounterService.loadEncounters(this.patient).subscribe(encounters => {
        this.encounters = this.encounters.concat(encounters);
        this.encountersLength = this.encounters.length;
        // console.log('Loaded ' + this.encounters.length + ' encounters.');
   //     console.log('before', this.encounters);
        this.sortByDate();
        // encounters.forEach(enc => enc.position = enc.getLogValue()/5 + "%")
        // encounters.forEach(enc =>  console.log('Log Val pos: ' + enc.getStartDate())) 
      });
    }

  }

  private sortByDate(): void{
    this.encounters.sort((a : Encounter, b:Encounter) => {
        return a.getStartDate().getTime() - b.getStartDate().getTime();
    });
   // console.log('after', this.encounters);

  }
  private onScrollClickRight(): void{
    console.log('first item', this.encounters[0]);

    if(this.endIndex < this.encounters.length){
      this.startIndex += 10;
      this.endIndex += 10;
    }

  }
  private onScrollClickLeft(): void{
    if(this.startIndex != 0){
      this.startIndex -= 10;
      this.endIndex -= 10;

    }

  }
}

import { Component, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HoverBoxComponent } from '../../components/hoverBox/hoverBox.component';
import { EncounterService } from '../../services/encounter.service';

import { Encounter } from '../../models/encounter.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'timeline-popup',
  templateUrl: './timeline_popup.html'
})

export class TimelinePopupComponent {
  @ViewChild('hoverBox', { static: false }) hover1: HoverBoxComponent;

  constructor(private encounterService: EncounterService) { }

   datePipe: DatePipe = new DatePipe('en-US');
   encounters: Array<Encounter> = [];
   e: Encounter;
   details : Array<String>;

   
  open(index : any, event: MouseEvent): void {
    console.log("e here is : ",this.encounters[index]);
    console.log("hover", this.hover1);
    let details: Array<String>  = [
      'Date: ' + this.datePipe.transform(this.encounters[index].getStartDate(),'MM-dd-yyyy').toString(),
      'Reason: ' + (this.encounters[index].getReason() || 'None')
   ];
    this.hover1.show(details, event);
  }

  close(event: MouseEvent): void {
    this.hover1.hide(event);
  }

}


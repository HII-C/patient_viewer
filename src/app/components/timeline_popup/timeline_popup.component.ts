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
  @ViewChild('hoverBox', { static: false }) hoverBox: HoverBoxComponent;

  constructor(private encounterService: EncounterService) { }

   datePipe: DatePipe = new DatePipe('en-US');
   details : Array<String>;

   
  open(encounter : Encounter, event: MouseEvent): void {
    //console.log("e here is : ",encounter);
   // console.log("hover", this.hoverBox);
    let details: Array<String>  = [
      'Date: ' + this.datePipe.transform(encounter.getStartDate(),'MM-dd-yyyy').toString(),
      'Reason: ' + (encounter.getReason() || 'None')
   ];
    this.hoverBox.show(details, event);
  }

  close(event: MouseEvent): void {
    this.hoverBox.hide(event);
  }

}


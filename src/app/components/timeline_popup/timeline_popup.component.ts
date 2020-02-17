import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HoverBoxComponent } from 'app/components/hoverBox/hoverBox.component';
import { Encounter } from 'app/models/encounter.model';

@Component({
  selector: 'timeline-popup',
  templateUrl: './timeline_popup.html'
})

export class TimelinePopupComponent {
  @ViewChild('hoverBox') hoverBox: HoverBoxComponent;
   datePipe: DatePipe = new DatePipe('en-US');
  open(encounter: Encounter, event: MouseEvent): void {
   
    let details: Array<string> = [
      'Date: ' + this.datePipe.transform(encounter.getStartDate(),'MM-dd-yyyy').toString(),
      'Reason: ' + (encounter.getReason() || 'None')
    ];
    this.hoverBox.show(details, event);
  }

  close(event: MouseEvent): void {
    this.hoverBox.hide(event);
  }
}

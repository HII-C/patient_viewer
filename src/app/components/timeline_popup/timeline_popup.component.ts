import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HoverBoxComponent } from '../../components/hoverBox/hoverBox.component';

import { Encounter } from '../../models/encounter.model';

@Component({
  selector: 'timeline-popup',
  templateUrl: './timeline_popup.html'
})

export class TimelinePopupComponent {
  @ViewChild('hoverBox', { static: false }) hoverBox: HoverBoxComponent;
   datePipe: DatePipe = new DatePipe('en-US');
  open(encounter: Encounter, event: MouseEvent): void {
   
    let details: Array<string> = [
      'Date: ' + this.datePipe.transform(encounter.getStartDate(),'MM-dd-yyyy').toString(),
        let left = this.elRef.nativeElement.querySelector('div').style.left;
        let top = this.elRef.nativeElement.querySelector('div').style.top;
    
        this.timeline.leftPosition = (parseInt(left.replace(/px/, "")) + 150) + "px";
        this.timeline.topPosition = (parseInt(top.replace(/px/, "")) + 100) + "px";
    }
      'Reason: ' + (encounter.getReason() || 'None')
      let left = this.elRef.nativeElement.querySelector('div').style.left;
        let top = this.elRef.nativeElement.querySelector('div').style.top;
    
        this.timeline.leftPosition = (parseInt(left.replace(/px/, "")) + 150) + "px";
        this.timeline.topPosition = (parseInt(top.replace(/px/, "")) + 100) + "px";
    ];
    this.hoverBox.show(details, event);
  }

  close(event: MouseEvent): void {
    this.hoverBox.hide(event);
  }
}

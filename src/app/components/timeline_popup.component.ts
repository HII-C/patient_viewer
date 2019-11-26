import { Component, ViewChild } from '@angular/core';
import { HoverBoxComponent } from '../components/hoverBox.component';
import { Encounter } from '../models/encounter.model';

@Component({
  selector: 'timeline-popup',
  templateUrl: '/timeline_popup.html'
})
export class TimelinePopupComponent {
  @ViewChild('hoverBox') hoverBox: HoverBoxComponent;

  open(encounter: Encounter, event: MouseEvent): void {
    let details: Array<string> = [
      'Period: ' + encounter.period.start + ' to ' + encounter.period.end,
      'Reason: ' + (encounter.getReason() || 'None')
    ];
    this.hoverBox.show(details, event);
  }

  close(event: MouseEvent): void {
    this.hoverBox.hide(event);
  }
}

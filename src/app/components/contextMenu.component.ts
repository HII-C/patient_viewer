import { Component, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'contextMenu',
  templateUrl: '/contextMenu.html'
})
export class ContextMenuComponent {
  visible: boolean = false;
  top: string = '0px';
  left: string = '0px';

  // Observable subscription to document clicks.
  clickSubscription: any = null;

  constructor(private ref: ElementRef) { }

  private handleDocClick(event) {
    // Hide the menu if the user clicks outside of it.
    if (!this.ref.nativeElement.contains(event.target)) {
      this.hide(null);
    }
  }

  // Show the menu.
  public show(event) {
    // Set the location of the menu to where the user clicked.
    this.top = event.pageY + 'px';
    this.left = event.pageX + 'px';

    // Disable the standard right click behavior.
    event.preventDefault();

    // Subscribe to document click events.
    this.clickSubscription = Observable.fromEvent(document, 'click')
      .subscribe((event) => {
        this.handleDocClick(event);
    });

    this.visible = true;
  }

  // Hide the menu.
  public hide(event) {
    if (event) {
      event.preventDefault();
    }

    // Unsubscribe from document click events.
    this.clickSubscription.unsubscribe();
    this.clickSubscription = null;

    this.visible = false;
  }
}

import { Component, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'contextMenu',
  templateUrl: '/contextMenu.html'
})
export class ContextMenuComponent {
  // The list of options displayed in the menu.
  options: Array<any> = [];

  // The data passed into the menu from wherever it was triggered.
  data: any = null;

  visible: boolean = false;
  top: string = '0px';
  left: string = '0px';

  // Observable subscription to document clicks.
  clickSubscription: any = null;

  constructor(private ref: ElementRef) { }

  /*
  Example Usage:

  this.menu.addOption({
    'icon': 'glyphicon-stats', // icon to display
    'text': 'Add to Trend Tool', // text to display
    'exec': function(data) { // what to execute upon click
      console.log(data);
    }
  });
  */
  public addOption(option) {
    this.options = this.options.concat(option);
  }

  private handleDocClick(event) {
    // Hide the menu if the user clicks outside of it.
    if (!this.ref.nativeElement.contains(event.target)) {
      this.hide(null);
    }
  }

  // Show the menu.
  public show(data, event) {
    this.data = data;

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

  // Handle executing actions tied to a clicked menu option.
  private handleOptionClick(option, event) {
    if (option.exec) {
      // Execute the function tied to the clicked menu option.
      option.exec(this.data);
    }

    // Hide the context menu.
    this.hide(event);
  }

  // Hide the menu.
  private hide(event) {
    if (event) {
      event.preventDefault();
    }

    // Unsubscribe from document click events.
    this.clickSubscription.unsubscribe();
    this.clickSubscription = null;

    // Hide the menu and reset the associated data.
    this.visible = false;
    this.data = null;
  }
}

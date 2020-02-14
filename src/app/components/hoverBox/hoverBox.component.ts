import { Component, Input, ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'hoverBox',
  templateUrl: './hoverBox.html'
})

@Injectable()

export class HoverBoxComponent {
  // The data passed into the hover box from wherever it was triggered.
  items: Array<any> = null;

  // Whether the hover box is currently visible.
  visible: boolean = false;

  // Where the hover box is displayed on the screen.
  top: string = '0px';
  left: string = '0px';
  topOffset: number = 18;
  leftOffset: number = 18;

  // Used to track whether the hover box is waiting to be shown.
  timeoutHandle: any = null;

  // Time (in ms) before the hover box appears.
  DISPLAY_DELAY: number = 200;

  constructor() { }

  public show(items, event) {
    // The hover box is already queued to display, no need to display again.
    if (this.timeoutHandle != null) {
      return;
    }

    
    this.timeoutHandle = setTimeout(() => {
      this.items = items;

      // Set the location of the hover box to where the mouse is.
      var topOffset = 0;
      var leftOffset = 0;
      // Code used to test moving the hover box away from the edge of the screen. 
      // TODO: do not hardcode pixels, find information of the pixel box
       
      if (window.innerWidth - event.pageX < 300) {
        leftOffset = window.innerWidth - 300 ;
      } else {
        leftOffset = parseInt(event.pageX) + this.leftOffset;  
      }
      topOffset = parseInt(event.pageY) + this.topOffset;
      this.top = topOffset + "px";
      this.left = leftOffset +  "px";

      //display
      this.visible = true;
    }, this.DISPLAY_DELAY);
  }

  // Hide the menu.
  public hide(event) {
    if (event) {
      event.preventDefault();
    }

    // Cancel the display of the hover box if it was previously queued.
    if (this.timeoutHandle != null) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    // Hide the menu and reset the associated data.
    this.visible = false;
    this.items = null;
  }

  public typeOf(x) {
    return typeof x;
  }

  public isDate(x) {
    return x instanceof Date;
  }

  public isMonth(x) {
    return x.includes("11m");
  }
}
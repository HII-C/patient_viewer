import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

/*
Super class of all three columns in the application. Provides
functionality for dynamic resizing, and keeps track of which
state the column is currently in (ie, scratch pad or default).
*/
export class BaseColumn {
  constructor() {
    // Set the initial height of the column.
    this.columnHeight = window.innerHeight - this.HEIGHT_OFFSET;

    // Resize the column on each window resize event.
    Observable.fromEvent(window, 'resize')
      .debounceTime(100) // Debounce to prevent excessive resizing.
      .subscribe((event) => {
        this.handleResize(event);
    });
  }

  // Update the height of the column.
  handleResize(event) {
    this.columnHeight = event.target.innerHeight - this.HEIGHT_OFFSET;
  }

  // Can be overriden in the child class to handle switching between states.
  showDefault() { }
  showScratchPad() { }

  // The current height (in pixels) of the column.
  columnHeight: number;

  // 220px is an approximate value that seems to work for now.
  HEIGHT_OFFSET: number = 180;

  // The current state (ie, scratch pad) of the column.
  columnState: string = "default";
}

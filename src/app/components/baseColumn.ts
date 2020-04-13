import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Super class of all three columns in the application. Provides
 * functionality for dynamic resizing, and keeps track of which
 * state the column is currently in (ie, scratch pad or default).
 */
export class BaseColumn {
  constructor() {
    // Set the initial height of the column.
    this.columnHeight = window.innerHeight - this.HEIGHT_OFFSET;

    // Resize the column on each window resize event.
    fromEvent(window, 'resize')
      .pipe(debounceTime(100)) // Debounce to prevent excessive resizing.
      .subscribe((event) => {
        this.handleResize(event);
    });
  }

  /**
   * Update the height of the column.
   * @param event Resize event
   */
  handleResize(event) {
    this.columnHeight = event.target.innerHeight - this.HEIGHT_OFFSET;
  }

  /**
   * Show default view. To be overriden in the child class.
   */
  showDefault() { }

  /**
   * Show scratch pad view. To be overriden in the child class.
   */
  showScratchPad() { }

  /**
   * Update the service. To be overriden in the child class.
   */
  updateService() { }

  /** The current height (in pixels) of the column. */
  columnHeight: number;

  /** 220px is an approximate value that seems to work for now. */
  HEIGHT_OFFSET: number = 180;

  /** The current state (ie, scratch pad) of the column. */
  columnState: string = "default";
}

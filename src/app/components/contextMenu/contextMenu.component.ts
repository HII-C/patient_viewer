import { Component, ElementRef } from '@angular/core';
import { ContextMenuOption } from '../../models/contextMenuOption.model';
import { fromEvent } from 'rxjs';

/**
 * A reusable context menu component.
 * 
 * Example Usage:
 * ```
 * this.menu.addOption({
 *   'icon': 'glyphicon-stats', // icon to display
 *   'text': 'Add to Trend Tool', // text to display
 *   'exec': function(data) { // what to execute upon click
 *    console.log(data);
 *   }
 * });
 * ```
 */
@Component({
  selector: 'contextMenu',
  templateUrl: './contextMenu.html'
})
export class ContextMenuComponent {

  /**
  * The list of options displayed in the menu.
  */
  options: Array<ContextMenuOption> = [];

  /**
  * The data passed into the menu from wherever it was triggered.
  */
  data: any = null;

  visible: boolean = false;
  top: string = '0px';
  left: string = '0px';

  /**
  * Observable subscription to document clicks. Clicking out of the 
  * context menu closes it.
  */
  clickSubscription: any = null;

  /**
  * Prevents a glitch in contexts where the menu is opened by a left click.
  * Without this delay on being able to close the menu, the menu would close
  * the moment it opened.
  */
  CLOSEABLE_DELAY: number = 100;
  closeable: boolean = false;

  constructor(private ref: ElementRef) { }

  /**
   * Add an option to the context menu.
   */
  public addOption(option: ContextMenuOption) {
    this.options = this.options.concat(option);
  }

  /**
  * Hide the context menu if user clicks outside of it.
  * 
  * @param event The click event on the document.
  */
  private handleDocClick(event) {
    if (!this.ref.nativeElement.contains(event.target)) {
      // Only hide the menu if it is currently closeable.
      if (this.closeable) {
          this.hide(null);
      }
    }
  }

  /**
   * Show the context menu.
   * 
   * @param data Data to be passed to the context menu.
   * @param event The click event that triggered the menu.
   */
  public show(data, event) {
    this.data = data;

    // Set the location of the menu to where the user clicked.
    this.top = event.pageY + 'px';
    this.left = event.pageX + 'px';

    this.visible = true;
    this.closeable = false;

    // Allow the menu to be closed only after an interval has elapsed.
    setTimeout(() => { this.closeable = true; }, this.CLOSEABLE_DELAY);

    // Disable the standard click behavior.
    event.preventDefault();

    // Subscribe to document click events.
    this.clickSubscription = fromEvent(document, 'click')
      .subscribe((event) => {
        this.handleDocClick(event);
    });
  }

  /**
   * Handles clicks on context menu options. If the option 
   * has an associated `exec` function, it is executed with 
   * `data` passed as the parameter.
   * 
   * @param option The context menu option that was clicked.
   * @param event The click event on the option
   */
  private handleOptionClick(option, event) {
    if (event) {
      event.preventDefault();
    }

    if (option.exec) {
      // Execute the function tied to the clicked menu option.
      option.exec(this.data);
    }

    // Hide the context menu.
    this.hide(event);
  }

  /**
   * Closes the context menu. Also handles cleaning up 
   * the click subscription, which is no longer needed.
   * 
   * @param event The click event triggering the hiding.
   */
  private hide(event) {
    if (event) {
      event.preventDefault();
    }

    // Unsubscribe from document click events.
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
      this.clickSubscription = null;
    }

    // Hide the menu and reset the associated data.
    this.visible = false;
    this.data = null;
  }
}
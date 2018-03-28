import {Component, Input, ElementRef, Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
    selector: 'allergyHover',
    templateUrl: '/allergyHover.html'
})

@Injectable()

export class AllergyHoverComponent {
    // // The data passed into the menu from wherever it was triggered.
    //allergies doesn't need this. we can import data directly into this component
    items: Array<any> = null;
    //
    visible: boolean = false;
    top: string = '0px';
    left: string = '0px';

    constructor(private ref: ElementRef) { }

    public handleItemClick(event) {
      event.preventDefault();
    }

    //REMOVE EXTRANEOUS CODE COPIED FROM CONTEXTMENU.COMPONENT.TS
    // Show the menu.
    public show(items, event) {
        this.items = items;

        // Set the location of the textbox to where the user clicked.
        this.top = event.pageY + 'px';
        this.left = event.pageX + 'px';

        this.visible = true;
    }

    // Hide the menu.
    private hide(event) {
        if (event) {
            event.preventDefault();
        }

        // Hide the menu and reset the associated data.
        this.visible = false;
        this.items = null;
    }
}
